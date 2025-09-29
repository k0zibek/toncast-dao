import { toNano } from '@ton/core';
import { ToncastDAOepoch } from '../build/ToncastDAOepoch/ToncastDAOepoch_ToncastDAOepoch';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();
    const senderAddress = sender.address;
    
    if (!senderAddress) {
        throw new Error('Sender address is required');
    }

    // Get epoch number from args or use default
    const epochNumber = BigInt(provider.network() === 'mainnet' ? 1 : 0);
    const totalToncastStaked = toNano('1000000'); // 1M TONCAST staked
    const deployValue = toNano('1'); // 1 TON initial deposit

    console.log('Deploying ToncastDAOepoch...');
    console.log('Owner address:', senderAddress.toString());
    console.log('Epoch number:', epochNumber.toString());
    console.log('Total TONCAST staked:', totalToncastStaked.toString());
    console.log('Initial TON deposit:', deployValue.toString());

    const toncastDAOepoch = provider.open(
        await ToncastDAOepoch.fromInit(senderAddress, epochNumber)
    );

    await toncastDAOepoch.send(
        sender,
        {
            value: deployValue,
        },
        {
            $$type: 'DeployEpoch',
            totalToncastStaked: totalToncastStaked,
        }
    );

    await provider.waitForDeploy(toncastDAOepoch.address);

    console.log('ToncastDAOepoch deployed at:', toncastDAOepoch.address.toString());
    
    const epochData = await toncastDAOepoch.getGetEpochData();
    console.log('\n=== Epoch Data ===');
    console.log('Epoch number:', epochData.epochNumber);
    console.log('Total TON received:', epochData.totalTonReceived);
    console.log('Total TONCAST staked:', epochData.totalToncastStaked);
    console.log('Is initialized:', epochData.isInitialized);
    console.log('Owner:', epochData.owner.toString());
}
