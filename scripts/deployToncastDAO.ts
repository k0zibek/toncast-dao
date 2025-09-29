import { toNano, Address, Cell } from '@ton/core';
import { ToncastDAO } from '../build/ToncastDAO/ToncastDAO_ToncastDAO';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    // Get deployment parameters from user
    const nftCollectionAddress = Address.parse(
        await ui.input('NFT Collection address')
    );
    const jettonMasterAddress = Address.parse(
        await ui.input('Toncast Jetton master address (NOT wallet address)')
    );
    
    const minDepositAmount = toNano(
        await ui.input('Minimum deposit amount in Toncast tokens (default: 1)')
    );
    const nftNamePrefix = await ui.input('NFT name prefix (e.g., "ToncastDAO Member")');
    const nftImageUrl = await ui.input('NFT image URL template (e.g., "https://example.com/nft/")');
    
    const toncastDAO = provider.open(
        await ToncastDAO.fromInit(
            provider.sender().address!,  // Owner is the deployer
            jettonMasterAddress,
            minDepositAmount,
            0n, // Start with NFT index 0
            nftNamePrefix,
            nftImageUrl
        )
    );

    await toncastDAO.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(toncastDAO.address);

    console.log('ToncastDAO deployed at:', toncastDAO.address);
    console.log('Owner:', await toncastDAO.getOwner());
    console.log('NFT Collection:', await toncastDAO.getNftCollectionAddress());
    console.log('Jetton Master Address:', await toncastDAO.getJettonMasterAddress());
    console.log('Calculated Jetton Wallet Address:', await toncastDAO.getJettonWalletAddress());
    console.log('Min Deposit Amount:', await toncastDAO.getMinDepositAmount());
    console.log('NFT Name Prefix:', await toncastDAO.getNftNamePrefix());
    console.log('NFT Image URL:', await toncastDAO.getNftImageUrl());
}
