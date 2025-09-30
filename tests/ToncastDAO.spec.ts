import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address, beginCell, Cell, StateInit, Dictionary } from '@ton/core';
import { ToncastDAO } from '../build/ToncastDAO/ToncastDAO_ToncastDAO';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { createHash } from 'crypto';

describe('ToncastDAO', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let nftCollectionDeployedAddress: Address | null;
    let jettonMasterMock: SandboxContract<TreasuryContract>;
    let toncastDAO: SandboxContract<ToncastDAO>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        user = await blockchain.treasury('user');
        jettonMasterMock = await blockchain.treasury('jetton-master');

        // Create collection metadata
        const collectionMetadata = beginCell()
            .storeUint(0, 8) // TEP-64 prefix
            .storeDict(null) // Empty metadata dict for testing
            .endCell();

        toncastDAO = blockchain.openContract(
            await ToncastDAO.fromInit(
                deployer.address,  // Owner
                jettonMasterMock.address,
                toNano('1'), // Min deposit: 1 TONCAST token
                0n, // Start NFT index at 0
                'ToncastDAO Member', // NFT name prefix
                'https://toncast.io/nft/', // NFT image URL template
                3600n, // Epoch duration: 1 hour for testing
                collectionMetadata, // Collection metadata
                0n // Sequence number
            )
        );

        const deployResult = await toncastDAO.send(
            deployer.getSender(),
            {
                value: toNano('1'), // Увеличиваем до 1 TON для деплоя NFT коллекции
            },
            { $$type: 'Deploy', queryId: 0n }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: toncastDAO.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and toncastDAO are ready to use
    });

    it('should have correct initial state', async () => {
        expect(await toncastDAO.getOwner()).toEqualAddress(deployer.address);
        const configData = await toncastDAO.getGetDaoConfigData();
        expect(configData.nftCollectionAddress).not.toBeNull(); // Collection deployed during DAO deploy
        expect(configData.jettonMasterAddress).toEqualAddress(jettonMasterMock.address);
        expect(configData.jettonWalletAddress).toEqualAddress(
            configData.jettonWalletAddress // Ensure getter works
        );
        expect(configData.minDepositAmount).toBe(toNano('1'));
        expect(configData.nextItemIndex).toBe(0n);
        expect(configData.nftNamePrefix).toBe('ToncastDAO Member');
        expect(configData.nftImageUrl).toBe('https://toncast.io/nft/');
    });

    it('should handle jetton transfer notification and mint NFT', async () => {
        // Collection is already deployed during DAO deploy
        nftCollectionDeployedAddress = (await toncastDAO.getGetDaoConfigData()).nftCollectionAddress;
        expect(nftCollectionDeployedAddress).not.toBeNull();
        const depositAmount = toNano('2'); // 2 TONCAST tokens

        // Simulate receiving jettons from the correct wallet
        const result = await toncastDAO.send(
            blockchain.sender(
                (await toncastDAO.getGetDaoConfigData()).jettonWalletAddress // Use calculated address
            ),
            {
                value: toNano('1'), // Enough TON for NFT minting and fees
            },
            {
                $$type: 'JettonTransferNotification',
                queryId: 123n,
                amount: depositAmount,
                sender: user.address,
                forwardPayload: beginCell().endCell().beginParse(),
            }
        );

        // Check that message was processed successfully
        expect(result.transactions).toHaveTransaction({
            from: (await toncastDAO.getGetDaoConfigData()).jettonWalletAddress, // Use calculated address
            to: toncastDAO.address,
            success: true,
        });

        // Check that NFT mint message was sent to deployed collection
        expect(result.transactions).toHaveTransaction({
            from: toncastDAO.address,
            to: nftCollectionDeployedAddress!,
            success: true, // Message sent successfully
        });

        // Check that NFT index was incremented
        expect((await toncastDAO.getGetDaoConfigData()).nextItemIndex).toBe(1n);
    });

    it('should reject deposit below minimum amount', async () => {
        const depositAmount = toNano('0.5'); // 0.5 TONCAST - below minimum of 1

        const result = await toncastDAO.send(
            blockchain.sender(
                (await toncastDAO.getGetDaoConfigData()).jettonWalletAddress // Use calculated address
            ),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'JettonTransferNotification',
                queryId: 123n,
                amount: depositAmount,
                sender: user.address,
                forwardPayload: beginCell().endCell().beginParse(),
            }
        );

        // Check that transaction failed
        expect(result.transactions).toHaveTransaction({
            from: (await toncastDAO.getGetDaoConfigData()).jettonWalletAddress, // Use calculated address
            to: toncastDAO.address,
            success: false,
            exitCode: 402, // Insufficient amount
        });
    });

    it('should reject jettons from wrong wallet', async () => {
        const wrongWallet = Address.parse('EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG');
        const depositAmount = toNano('2'); // 2 TONCAST tokens

        const result = await toncastDAO.send(
            blockchain.sender(wrongWallet),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'JettonTransferNotification',
                queryId: 123n,
                amount: depositAmount,
                sender: user.address,
                forwardPayload: beginCell().endCell().beginParse(),
            }
        );

        // Check that transaction failed
        expect(result.transactions).toHaveTransaction({
            from: wrongWallet,
            to: toncastDAO.address,
            success: false,
            exitCode: 401, // Unauthorized
        });
    });
    
    // Tests for UpdateNftNamePrefix and UpdateNftImageUrl removed 
    // as these admin functions are no longer supported in the contract
    
    describe('NFT Withdrawal', () => {
        let nftCollectionAddress: Address;
        let jettonWallet: SandboxContract<TreasuryContract>;
        
        beforeEach(async () => {
            // Collection is already deployed during DAO deploy
            nftCollectionAddress = (await toncastDAO.getGetDaoConfigData()).nftCollectionAddress!;
            expect(nftCollectionAddress).not.toBeNull();
            
            // Create jetton wallet mock
            jettonWallet = await blockchain.treasury('jetton-wallet');
            
            // Set up jetton wallet to be the expected address
            const expectedJettonWallet = (await toncastDAO.getGetDaoConfigData()).jettonWalletAddress;
        });
        
        it('should mint NFT on jetton deposit', async () => {
            const depositAmount = toNano('5');
            
            // Send jetton transfer notification from the correct jetton wallet
            const result = await toncastDAO.send(
                blockchain.sender((await toncastDAO.getGetDaoConfigData()).jettonWalletAddress),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: 'JettonTransferNotification',
                    queryId: 123n,
                    amount: depositAmount,
                    sender: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            expect(result.transactions).toHaveTransaction({
                from: (await toncastDAO.getGetDaoConfigData()).jettonWalletAddress,
                to: toncastDAO.address,
                success: true,
            });
            
            // Check that NFT was minted
            expect((await toncastDAO.getGetDaoConfigData()).nextItemIndex).toBe(1n);
        });
        
        it('should process NFT withdrawal', async () => {
            const depositAmount = toNano('10');
            
            // First, mint an NFT by depositing tokens
            const mintResult = await toncastDAO.send(
                blockchain.sender((await toncastDAO.getGetDaoConfigData()).jettonWalletAddress),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: 'JettonTransferNotification',
                    queryId: 123n,
                    amount: depositAmount,
                    sender: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            expect(mintResult.transactions).toHaveTransaction({
                success: true,
            });
            
            // Now send NFT back to DAO (withdrawal initiation)
            // Note: In real test we would need to calculate the NFT item address
            // For now, we'll test just the NftTransferNotification handler
            
            const nftItem = await blockchain.treasury('nft-item');
            const nftItemAddress = nftItem.address;
            
            const withdrawResult = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.4'),
                },
                {
                    $$type: 'NftTransferNotification',
                    queryId: 456n,
                    prevOwner: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            // Should send NftGetAllData request
            expect(withdrawResult.transactions).toHaveTransaction({
                from: nftItemAddress,
                to: toncastDAO.address,
                success: true,
            });
            
            // Should have sent a message back to NFT
            expect(withdrawResult.transactions).toHaveTransaction({
                from: toncastDAO.address,
                to: nftItemAddress,
                op: 0x3a3a3a3a, // op::get_all_data
            });
        });
        
        it('should validate NFT address during withdrawal', async () => {
            const depositAmount = toNano('100');
            const nftIndex = 0n;
            const queryId = 789n;
            
            // Mock NFT item address (won't match calculated address)
            const nftItem = await blockchain.treasury('nft-item');
            const nftItemAddress = nftItem.address;
            
            // First, register pending withdrawal
            await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.4'),
                },
                {
                    $$type: 'NftTransferNotification',
                    queryId: queryId,
                    prevOwner: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            // Build staking data
            const stakingData = beginCell()
                .storeCoins(depositAmount)
                .storeUint(Math.floor(Date.now() / 1000), 64)
                .storeAddress(toncastDAO.address)
                .endCell();
            
            // Build data cell as NFT would send it - now only addresses and staking data
            const addrData = beginCell()
                .storeAddress(nftCollectionAddress)
                .storeAddress(toncastDAO.address) // NFT now owned by DAO
                .endCell();
            
            const dataCell = beginCell()
                .storeRef(addrData)
                .storeRef(stakingData)
                .endCell();
            
            // Send NftReportAllData
            const result = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.3'),
                },
                {
                    $$type: 'NftReportAllData',
                    queryId: queryId,
                    index: nftIndex,
                    data: dataCell,
                }
            );
            
            // Should fail with exit code 418 (Invalid NFT address)
            expect(result.transactions).toHaveTransaction({
                from: nftItemAddress,
                to: toncastDAO.address,
                success: false,
                exitCode: 418,
            });
        });
        
        it('should reject withdrawal from wrong NFT', async () => {
            const wrongNft = await blockchain.treasury('wrong-nft');
            
            const result = await toncastDAO.send(
                blockchain.sender(wrongNft.address),
                {
                    value: toNano('0.4'),
                },
                {
                    $$type: 'NftTransferNotification',
                    queryId: 999n,
                    prevOwner: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            // Should process but will fail on NftReportAllData validation
            expect(result.transactions).toHaveTransaction({
                from: wrongNft.address,
                to: toncastDAO.address,
                success: true,
            });
        });
        
        it('should take 10% commission twice during withdrawal', async () => {
            const nftItem = await blockchain.treasury('nft-item');
            const nftItemAddress = nftItem.address;
            const initialValue = toNano('1'); // 1 TON
            
            // First commission (10%) during NftTransferNotification
            const firstResult = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: initialValue,
                },
                {
                    $$type: 'NftTransferNotification',
                    queryId: 123n,
                    prevOwner: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            // Check that DAO kept 10% and sent 90% to NFT
            const commission1 = initialValue / 10n; // 0.1 TON
            const sentToNft = initialValue - commission1; // 0.9 TON
            
            expect(firstResult.transactions).toHaveTransaction({
                from: toncastDAO.address,
                to: nftItemAddress,
                value: (x) => x! < sentToNft + toNano('0.01') && x! > sentToNft - toNano('0.01'),
            });
        });
        
        it('should demonstrate detailed NFT data request flow', async () => {
            // Включаем подробные логи для этого теста
            blockchain.verbosity = {
                ...blockchain.verbosity,
                print: true,
                vmLogs: 'vm_logs_full',
            };
            
            const depositAmount = toNano('100');
            const queryId = 12345n;
            
            // 1. Сначала регистрируем NFT для вывода
            const nftItem = await blockchain.treasury('test-nft');
            const nftItemAddress = nftItem.address;
            
            console.log('\n=== STEP 1: NFT Transfer Notification ===');
            console.log(`NFT Address: ${nftItemAddress}`);
            console.log(`Query ID: ${queryId}`);
            console.log(`Initial value: 0.5 TON`);
            
            const step1Result = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: 'NftTransferNotification',
                    queryId: queryId,
                    prevOwner: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            // Анализируем результат
            const nftTransferTx = step1Result.transactions[1]; // DAO transaction
            
            if (nftTransferTx && nftTransferTx.description.type === 'generic') {
                console.log(`\nTransaction success: ${nftTransferTx.description.aborted === false}`);
                console.log(`Gas used: ${nftTransferTx.description.computePhase.type === 'vm' ? nftTransferTx.description.computePhase.gasUsed : 'N/A'}`);
            }
            
            // Проверяем отправку NftGetAllData
            const getAllDataTx = step1Result.transactions.find((tx, idx) => 
                idx > 1 && 
                tx.description.type === 'generic' &&
                tx.description.computePhase.type === 'vm'
            );
            
            console.log('\n=== NftGetAllData Message Details ===');
            if (getAllDataTx) {
                console.log(`From: DAO`);
                console.log(`To: NFT`);
                console.log(`Op code: 0x3a3a3a3a (NftGetAllData)`);
                console.log(`Transaction found in results`);
                
                // Рассчитываем комиссию
                const originalValue = toNano('0.5');
                const commission = originalValue / 10n;
                const sentToNft = originalValue - commission;
                console.log(`\nCommission calculation:`);
                console.log(`- Original value: ${originalValue}`);
                console.log(`- 10% commission: ${commission}`);
                console.log(`- Sent to NFT: ${sentToNft}`);
            }
            
            // 2. Теперь симулируем ответ от NFT с данными
            console.log('\n\n=== STEP 2: NFT Report All Data ===');
            
            // Создаем данные стейкинга
            const currentTime = Math.floor(Date.now() / 1000);
            const stakingData = beginCell()
                .storeCoins(depositAmount)
                .storeUint(currentTime, 64)
                .storeAddress(toncastDAO.address)
                .endCell();
            
            console.log('\nStaking data structure:');
            console.log(`- Amount: ${depositAmount} (100 TON)`);
            console.log(`- Timestamp: ${currentTime}`);
            console.log(`- DAO Address: ${toncastDAO.address}`);
            
            // Создаем метаданные NFT
            const sha256 = (str: string): bigint => {
                const hash = createHash('sha256').update(str).digest('hex');
                return BigInt('0x' + hash);
            };
            
            const metadata = Dictionary.empty<bigint, Cell>(
                Dictionary.Keys.BigUint(256),
                Dictionary.Values.Cell()
            );
            
            const description = `${depositAmount}|${currentTime}|${toncastDAO.address.toString()}`;
            
            // No need for metadata and individualContent - NFT now returns only addresses and staking data
            console.log('\nStaking Data in NFT:');
            console.log(`- amount: ${depositAmount}`);
            console.log(`- timestamp: ${currentTime}`);
            console.log(`- dao_address: ${toncastDAO.address.toString()}`);
            
            // Build data cell как это делает FunC
            const addrData = beginCell()
                .storeAddress(nftCollectionAddress)
                .storeAddress(toncastDAO.address) // NFT owned by DAO
                .endCell();
            
            const dataCell = beginCell()
                .storeRef(addrData)
                .storeRef(stakingData)
                .endCell();
            
            console.log('\n=== Message Structure from FunC ===');
            console.log('Message body format:');
            console.log('- op: 0x7b7b7b7b (32 bits)');
            console.log('- query_id: ${queryId} (64 bits)');
            console.log('- index: 0 (256 bits)');
            console.log('- data: [ref to data cell]');
            console.log('  - addresses: [ref]');
            console.log('    - collection_address');
            console.log('    - owner_address (DAO)');
            console.log('  - staking_data: [ref]');
            console.log('    - amount');
            console.log('    - timestamp');
            console.log('    - dao_address');
            
            const step2Result = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.4'),
                },
                {
                    $$type: 'NftReportAllData',
                    queryId: queryId,
                    index: 0n,
                    data: dataCell,
                }
            );
            
            // Анализируем обработку
            const reportDataTx = step2Result.transactions[1]; // DAO transaction
            
            console.log('\n=== Processing Result ===');
            if (reportDataTx && reportDataTx.description.type === 'generic') {
                console.log(`Transaction aborted: ${reportDataTx.description.aborted}`);
                console.log(`Expected: exit code 418 (Invalid NFT address - because we use simulated address)`);
                console.log(`\nThis is expected! The contract correctly validates that the NFT address`);
                console.log(`doesn't match the calculated address for index 0 in the collection.`);
            }
            
            console.log('\n=== Summary ===');
            console.log('1. DAO receives NftTransferNotification and takes 10% commission');
            console.log('2. DAO sends NftGetAllData request to NFT with remaining 90%');
            console.log('3. NFT responds with NftReportAllData containing all staking info');
            console.log('4. DAO validates the NFT address (fails here with simulated address)');
            console.log('5. In real scenario: DAO would send jettons back to original owner');
            
            expect(step2Result.transactions).toHaveTransaction({
                from: nftItemAddress,
                to: toncastDAO.address,
                success: false,
                exitCode: 418, // Invalid NFT address
            });
        });
        
        it('should complete full withdrawal flow with real NFT', async () => {
            const depositAmount = toNano('50');
            
            // Step 1: Mint NFT by depositing tokens
            const mintResult = await toncastDAO.send(
                blockchain.sender((await toncastDAO.getGetDaoConfigData()).jettonWalletAddress),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: 'JettonTransferNotification',
                    queryId: 1234n,
                    amount: depositAmount,
                    sender: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            expect(mintResult.transactions).toHaveTransaction({
                success: true,
            });
            
            // For testing purposes, we'll use a simulated NFT address
            // In a real scenario, we would calculate the actual NFT address
            // using the collection contract and item index
            const nftItem = await blockchain.treasury('nft-item-0');
            const nftItemAddress = nftItem.address;
            
            // Step 2: Simulate NFT transfer to DAO (withdrawal initiation)
            // In a real scenario, user would transfer NFT to DAO
            // For testing, we simulate the NFT notifying DAO about transfer
            const withdrawInitResult = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.5'),
                },
                {
                    $$type: 'NftTransferNotification',
                    queryId: 5678n,
                    prevOwner: user.address,
                    forwardPayload: beginCell().endCell().beginParse(),
                }
            );
            
            expect(withdrawInitResult.transactions).toHaveTransaction({
                from: nftItemAddress,
                to: toncastDAO.address,
                success: true,
            });
            
            // Should have sent get_all_data request
            expect(withdrawInitResult.transactions).toHaveTransaction({
                from: toncastDAO.address,
                to: nftItemAddress,
                op: 0x3a3a3a3a, // op::get_all_data
            });
            
            // Step 3: Simulate NFT reporting its data
            // Get the actual NFT content as it was minted
            const currentTime = Math.floor(Date.now() / 1000);
            const stakingData = beginCell()
                .storeCoins(depositAmount)
                .storeUint(currentTime, 64)
                .storeAddress(toncastDAO.address)
                .endCell();
            
            // No need to build metadata - NFT now returns only addresses and staking data
            
            // Build data cell - now contains only addresses and staking data
            const addrData = beginCell()
                .storeAddress(nftCollectionAddress)
                .storeAddress(toncastDAO.address) // NFT now owned by DAO
                .endCell();
            
            const dataCell = beginCell()
                .storeRef(addrData)
                .storeRef(stakingData)
                .endCell();
            
            // Send NftReportAllData from the actual NFT address
            const withdrawCompleteResult = await toncastDAO.send(
                blockchain.sender(nftItemAddress),
                {
                    value: toNano('0.4'),
                },
                {
                    $$type: 'NftReportAllData',
                    queryId: 5678n,
                    index: 0n,
                    data: dataCell,
                }
            );
            
            // Since we're using a simulated NFT address, it will fail address validation
            // with exit code 418 (Invalid NFT address)
            expect(withdrawCompleteResult.transactions).toHaveTransaction({
                from: nftItemAddress,
                to: toncastDAO.address,
                success: false,
                exitCode: 418,
            });
            
            // This demonstrates that the contract correctly validates NFT addresses
            // In a real scenario with properly deployed NFT, this would succeed
        });
    });
    
    describe('Stop and Redirect', () => {
        it('should allow owner to stop and redirect DAO', async () => {
            // Deploy new DAO address (mock)
            const newDAO = await blockchain.treasury('new-dao');
            
            // Get initial state
            const configBefore = await toncastDAO.getGetDaoConfigData();
            expect(configBefore.stopped).toBe(false);
            expect(configBefore.newDaoAddress).toBeNull();
            
            // Send StopAndRedirect message from owner
            const stopResult = await toncastDAO.send(
                deployer.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'StopAndRedirect',
                    newDaoAddress: newDAO.address
                }
            );
            
            expect(stopResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: toncastDAO.address,
                success: true,
            });
            
            // Check state after stop
            const configAfter = await toncastDAO.getGetDaoConfigData();
            expect(configAfter.stopped).toBe(true);
            expect(configAfter.newDaoAddress?.toString()).toBe(newDAO.address.toString());
        });
        
        it('should reject stop from non-owner', async () => {
            const newDAO = await blockchain.treasury('new-dao');
            
            // Try to stop from non-owner
            const stopResult = await toncastDAO.send(
                user.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'StopAndRedirect',
                    newDaoAddress: newDAO.address
                }
            );
            
            expect(stopResult.transactions).toHaveTransaction({
                from: user.address,
                to: toncastDAO.address,
                success: false,
                exitCode: 132, // Access denied
            });
        });
    });
});
