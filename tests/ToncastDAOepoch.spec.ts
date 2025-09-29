import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { ToncastDAOepoch } from '../build/ToncastDAOepoch/ToncastDAOepoch_ToncastDAOepoch';
import { toNano, beginCell } from '@ton/core';
import '@ton/test-utils';

describe('ToncastDAOepoch', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let toncastDAOepoch: SandboxContract<ToncastDAOepoch>;
    const epochNumber = 1n;
    const totalToncastStaked = toNano('1000000'); // 1M TONCAST
    const deployValue = toNano('1');

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        
        toncastDAOepoch = blockchain.openContract(
            await ToncastDAOepoch.fromInit(deployer.address, epochNumber)
        );

        const deployResult = await toncastDAOepoch.send(
            deployer.getSender(),
            {
                value: deployValue,
            },
            {
                $$type: 'DeployEpoch',
                totalToncastStaked: totalToncastStaked,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: toncastDAOepoch.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and toncastDAOepoch are ready to use
    });

    it('should have correct epoch data after deploy', async () => {
        const epochData = await toncastDAOepoch.getGetEpochData();
        
        // Check epoch number
        expect(epochData.epochNumber).toEqual(epochNumber);
        
        // Check owner
        expect(epochData.owner.toString()).toEqual(deployer.address.toString());
        
        // Check TON received
        expect(epochData.totalTonReceived).toBeGreaterThan(0n);
        expect(epochData.totalTonReceived).toBeLessThanOrEqual(deployValue);
        
        // Check TONCAST staked
        expect(epochData.totalToncastStaked).toEqual(totalToncastStaked);
        
        // Check initialization
        expect(epochData.isInitialized).toBe(true);
    });

    it('should not update TON amount on subsequent deposits', async () => {
        const initialData = await toncastDAOepoch.getGetEpochData();
        const initialTon = initialData.totalTonReceived;
        
        // Send more TON with empty message
        await toncastDAOepoch.send(
            deployer.getSender(),
            {
                value: toNano('2'),
            },
            beginCell().endCell().asSlice()
        );
        
        const afterData = await toncastDAOepoch.getGetEpochData();
        expect(afterData.totalTonReceived).toEqual(initialTon); // Should not change
    });

    describe('PayoutStaker', () => {
        it('should calculate correct reward for staker', async () => {
            // Test reward calculation
            const stakerAmount = toNano('100000'); // 100k TONCAST
            const expectedReward = await toncastDAOepoch.getCalculateStakerReward(stakerAmount);
            
            // Manual calculation: (100k / 1M) * totalTonReceived
            const epochData = await toncastDAOepoch.getGetEpochData();
            const manualReward = (stakerAmount * epochData.totalTonReceived) / totalToncastStaked;
            
            expect(expectedReward).toEqual(manualReward);
        });
        
        it('should allow owner to payout staker', async () => {
            const staker = await blockchain.treasury('staker');
            const stakerAmount = toNano('100000'); // 100k TONCAST = 10% of total
            
            const result = await toncastDAOepoch.send(
                deployer.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'PayoutStaker',
                    queryId: 1n,
                    stakerAddress: staker.address,
                    stakerToncastAmount: stakerAmount,
                }
            );
            
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: toncastDAOepoch.address,
                success: true,
            });
            
            // Check that staker received funds
            expect(result.transactions).toHaveTransaction({
                from: toncastDAOepoch.address,
                to: staker.address,
                success: true,
            });
        });
        
        it('should not allow non-owner to payout', async () => {
            const notOwner = await blockchain.treasury('notOwner');
            const staker = await blockchain.treasury('staker2');
            
            const result = await toncastDAOepoch.send(
                notOwner.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'PayoutStaker',
                    queryId: 2n,
                    stakerAddress: staker.address,
                    stakerToncastAmount: toNano('100000'),
                }
            );
            
            expect(result.transactions).toHaveTransaction({
                from: notOwner.address,
                to: toncastDAOepoch.address,
                success: false,
                exitCode: 132, // Standard owner check error code
            });
        });
        
        it('should not allow payout exceeding total staked', async () => {
            const staker = await blockchain.treasury('staker4');
            const excessAmount = totalToncastStaked + toNano('1');
            
            const result = await toncastDAOepoch.send(
                deployer.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'PayoutStaker',
                    queryId: 5n,
                    stakerAddress: staker.address,
                    stakerToncastAmount: excessAmount,
                }
            );
            
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: toncastDAOepoch.address,
                success: false,
                exitCode: 503, // Amount exceeds total staked
            });
        });
        
        it('should not allow payout less than minimum (0.005 TON)', async () => {
            const staker = await blockchain.treasury('staker5');
            const tinyAmount = 1n; // 1 nanoTONCAST - will result in less than 0.005 TON reward
            
            const result = await toncastDAOepoch.send(
                deployer.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: 'PayoutStaker',
                    queryId: 6n,
                    stakerAddress: staker.address,
                    stakerToncastAmount: tinyAmount,
                }
            );
            
            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: toncastDAOepoch.address,
                success: false,
                exitCode: 504, // Payout amount too small
            });
        });
    });
});
