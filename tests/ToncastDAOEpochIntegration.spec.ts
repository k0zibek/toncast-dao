import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { ToncastDAO } from '../build/ToncastDAO/ToncastDAO_ToncastDAO';
import { ToncastDAOepoch } from '../build/ToncastDAOepoch/ToncastDAOepoch_ToncastDAOepoch';
import { toNano, Address, beginCell } from '@ton/core';
import '@ton/test-utils';

describe('ToncastDAO Epoch Integration', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dao: SandboxContract<ToncastDAO>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        
        // Create collection metadata
        const collectionMetadata = beginCell()
            .storeUint(0, 8) // TEP-64 prefix
            .storeDict(null) // Empty metadata dict for testing
            .endCell();

        // Deploy DAO
        dao = blockchain.openContract(
            await ToncastDAO.fromInit(
                deployer.address,
                deployer.address, // Mock jetton master
                toNano('1'), // Min deposit
                0n, // Next item index
                'Test NFT',
                'https://test.com/',
                3600n, // Epoch duration: 1 hour for testing
                collectionMetadata, // Collection metadata
                0n // Sequence number
            )
        );
        
        const deployResult = await dao.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            { $$type: 'Deploy', queryId: 0n }
        );
        
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: dao.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
    });
    
    it('should have correct initial epoch values', async () => {
        const epochData = await dao.getGetDaoEpochData();
        expect(epochData.currentRealTimeEpoch).toEqual(0n);
        expect(epochData.epochDuration).toEqual(3600n); // 1 hour
        expect(epochData.currentStoredEpochNumber).toEqual(0n);
        expect(epochData.totalCurrentlyStaked).toEqual(0n);
    });
    
    it('should calculate epoch contract address', async () => {
        const epochAddress = await dao.getGetEpochContractAddress(0n);
        expect(epochAddress).toBeDefined();
        
        // Verify it's a valid address
        expect(epochAddress.toString()).toMatch(/^[EU]Q[A-Za-z0-9_-]{46}$/);
    });
    
    it('should process epochs on incoming TON', async () => {
        // First send some TON to DAO to accumulate funds
        await dao.send(
            deployer.getSender(),
            {
                value: toNano('5'),
            },
            beginCell().endCell().asSlice()
        );
        
        // Sending more TON triggers epoch check
        // Without actual staking, it won't send funds but won't fail either
        const result = await dao.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            beginCell().endCell().asSlice()
        );
        
        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: dao.address,
            success: true,
        });
    });
    
    it('should track last funded epoch and total staked', async () => {
        // Verify the getter works
        const epochData = await dao.getGetDaoEpochData();
        expect(epochData.currentStoredEpochNumber).toEqual(0n);
        expect(epochData.totalCurrentlyStaked).toEqual(0n);
    });
    
    it('should be able to create epoch contract with correct init', async () => {
        // Get predicted epoch address from DAO
        const epochNumber = 0n;
        const predictedAddress = await dao.getGetEpochContractAddress(epochNumber);
        
        // Create epoch contract directly with same init parameters
        const epochContract = blockchain.openContract(
            await ToncastDAOepoch.fromInit(
                dao.address,
                epochNumber
            )
        );
        
        // Verify addresses match
        expect(epochContract.address.toString()).toEqual(predictedAddress.toString());
    });
});
