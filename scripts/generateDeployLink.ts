import { Address, toNano, Cell, beginCell, Dictionary, DictionaryValue } from '@ton/core';
import { sha256_sync } from '@ton/crypto';
import { ToncastDAO, storeDeploy } from '../build/ToncastDAO/ToncastDAO_ToncastDAO';
import { NetworkProvider } from '@ton/blueprint';

// Convert buffer to base64url format for deeplinks
function toBase64Url(buffer: Buffer): string {
    return buffer
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

// Utility: string -> Cell (using TEP-64 compatible format)
function stringToCell(str: string): Cell {
    // Use 0x00 prefix + tail string (as in working NFT example)
    return beginCell().storeUint(0, 8).storeStringTail(str).endCell();
}

// Utility: sha256 hash for metadata keys -> bigint
function hashKey(key: string): bigint {
    const hash = sha256_sync(Buffer.from(key, "utf-8")); // Returns Uint8Array
    return BigInt("0x" + Buffer.from(hash).toString("hex"));
}

// Dictionary codec for Cell values
const cellValue: DictionaryValue<Cell> = {
    serialize: (src, builder) => {
        builder.storeRef(src);
    },
    parse: (src) => src.loadRef()
};

// Compose collection metadata in TEP-64 format
function composeCollectionMetadata(
    name: string,
    description: string,
    image: string,
    socialLinks: string[]
): Cell {
    // Create dictionary for metadata
    const dict = Dictionary.empty<bigint, Cell>();
    
    // Add metadata fields
    dict.set(hashKey("name"), stringToCell(name));
    dict.set(hashKey("description"), stringToCell(description));
    dict.set(hashKey("image"), stringToCell(image));
    
    // Optional: social links as JSON array string (works in explorers)
    if (socialLinks && socialLinks.length > 0) {
        const socialLinksJson = JSON.stringify(socialLinks);
        dict.set(hashKey("social_links"), stringToCell(socialLinksJson));
    }
    
    // Top-level on-chain content: 0x00 prefix + inline dict (as in working example)
    return beginCell()
        .storeUint(0, 8)
        .storeDict(dict, Dictionary.Keys.BigUint(256), cellValue)
        .endCell();
}

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    
    // Get deployment parameters from user
    ui.write('=== ToncastDAO Deployment Link Generator (with Deploy body) ===\n');
    
    const owner = Address.parse(
        (await ui.input('Owner address (your wallet address) (default: kQDupEKOQUR4741xxeObL36Kj-izgp_UgyWzKPqqs6Plp1dl)'))
        || 'kQDupEKOQUR4741xxeObL36Kj-izgp_UgyWzKPqqs6Plp1dl'
    );
    const jettonMasterAddress = Address.parse(
        (await ui.input('Toncast Jetton master address (NOT wallet address) (default: kQBM0jlIe1_IGNJmHxV3EYDAswxLQhIxZnzvResvWbtPTCAV)'))
        || 'kQBM0jlIe1_IGNJmHxV3EYDAswxLQhIxZnzvResvWbtPTCAV'
    );
    const minDepositAmount = toNano(
        (await ui.input('Minimum deposit amount in Toncast tokens (default: 20)'))
        || '20'
    );
    const nftNamePrefix = (await ui.input('NFT name prefix (default: "Toncast Stakeholder")'))
        || 'Toncast Stakeholder';
    const nftImageUrl = (await ui.input('NFT image URL template (default: "https://img.toncast.me/nft/")'))
        || 'https://img.toncast.me/nft/';
    
    // Get epoch duration with default for mainnet
    const epochDurationStr = await ui.input('Epoch duration in seconds (default: 2592000 for 30 days)') || '2592000';
    const epochDuration = BigInt(epochDurationStr);
    
    // Get sequence number for unique address
    const seqStr = await ui.input('Sequence number for unique contract address (default: 0)') || '0';
    const seq = BigInt(seqStr);
    
    // Get NFT Collection metadata parameters
    ui.write('\n=== NFT Collection Metadata ===');
    const collectionName = await ui.input('NFT Collection name (default: "Toncast Stakers Collection")') 
        || 'Toncast Stakers Collection';
    
    const collectionDescription = await ui.input('Collection description (default: standard description)') 
        || 'The Toncast Stakers NFT Collection is a permanent on-chain badge for those who have already staked their TCAST tokens in a Toncast DAO. Each NFT is proof of commitment and recognition as a true stakeholder in Toncast\'s journey.';
    
    const collectionImage = await ui.input('Collection image URL (default: "https://img.toncast.me/nft-collection/1.png")') 
        || 'https://img.toncast.me/nft-collection/1.png';
    
    const socialLinksInput = await ui.input('Social links (comma-separated, default: toncast.me, twitter, telegram)') 
        || 'https://toncast.me,https://x.com/TCASTFoundation,https://t.me/Toncast_TCAST_bot';
    
    const socialLinks = socialLinksInput.split(',').map(link => link.trim());
    
    // Choose network
    const isTestnet = (await ui.input('\nDeploy on testnet? (yes/no, default: yes)')) !== 'no';
    
    // Generate collection metadata Cell
    const collectionMetadata = composeCollectionMetadata(
        collectionName,
        collectionDescription,
        collectionImage,
        socialLinks
    );
    
    // Create contract instance
    const toncastDAO = await ToncastDAO.fromInit(
        owner,
        jettonMasterAddress,
        minDepositAmount,
        0n, // Start with NFT index 0
        nftNamePrefix,
        nftImageUrl,
        epochDuration,
        collectionMetadata,
        seq
    );
    
    // Get contract data
    const contractAddress = toncastDAO.address;
    const stateInit = toncastDAO.init;
    
    if (!stateInit || !stateInit.code || !stateInit.data) {
        throw new Error('Failed to generate state init');
    }
    
    // Create state init cell according to TON standards
    const stateInitCell = beginCell()
        .storeUint(0, 2) // no split_depth, no special
        .storeUint(1, 1) // has code
        .storeRef(stateInit.code)
        .storeUint(1, 1) // has data
        .storeRef(stateInit.data)
        .storeUint(0, 1) // no libraries
        .endCell();
    
    // Create Deploy message body for first transaction
    const deploymentMessage = beginCell()
        .store(storeDeploy({ $$type: 'Deploy', queryId: 0n }))
        .endCell();
    
    // Encode for deeplink
    const stateInitBoc = toBase64Url(stateInitCell.toBoc());
    const messageBoc = toBase64Url(deploymentMessage.toBoc());
    
    // Calculate deployment cost
    const deployAmount = toNano('0.4'); // 0.4 TON for deployment (covers init + body)
    
    // Generate TonKeeper/Tonhub deeplink
    // Format: ton://transfer/<address>?amount=<nanotons>&bin=<base64url>&init=<base64url>
    const deeplink = `ton://transfer/${contractAddress.toString({
        urlSafe: true,
        testOnly: isTestnet,
        bounceable: false
    })}?amount=${deployAmount.toString()}&bin=${messageBoc}&init=${stateInitBoc}`;
    
    // Display deployment information
    ui.write('\n=== Deployment Information ===');
    ui.write(`Network: ${isTestnet ? 'TESTNET' : 'MAINNET'}`);
    ui.write(`Contract Address: ${contractAddress.toString({ urlSafe: true, testOnly: isTestnet })}`);
    ui.write(`Owner: ${owner.toString({ urlSafe: true, testOnly: isTestnet })}`);
    // Collection address is initialized as null in contract and will be set after collection deploy
    ui.write(`Toncast Jetton Master: ${jettonMasterAddress.toString({ urlSafe: true, testOnly: isTestnet })}`);
    ui.write(`Min Deposit: ${Number(minDepositAmount) / 1e9} TONCAST`);
    ui.write(`NFT Name Prefix: ${nftNamePrefix}`);
    ui.write(`NFT Image URL: ${nftImageUrl}`);
    ui.write(`Deployment Amount: ${Number(deployAmount) / 1e9} TON`);
    
    ui.write('\n=== TonKeeper/Tonhub Deployment Link ===');
    ui.write('Copy this link and open it in TonKeeper or Tonhub:\n');
    ui.write(deeplink);
    
    // Display deployment info
    ui.write('\n=== Deployment Information ===');
    ui.write(`Network: ${isTestnet ? 'Testnet' : 'Mainnet'}`);
    ui.write(`Contract Address: ${contractAddress.toString({ urlSafe: true, testOnly: isTestnet })}`);
    ui.write(`Owner: ${owner.toString({ urlSafe: true, testOnly: isTestnet })}`);
    ui.write(`Jetton Master: ${jettonMasterAddress.toString({ urlSafe: true, testOnly: isTestnet })}`);
    ui.write(`Min Deposit: ${Number(minDepositAmount) / 1e9} TONCAST`);
    ui.write(`NFT Name Prefix: ${nftNamePrefix}`);
    ui.write(`NFT Image URL: ${nftImageUrl}`);
    ui.write(`Epoch Duration: ${epochDuration} seconds`);
    ui.write(`Sequence Number: ${seq}`);
    ui.write('\n=== Collection Metadata ===');
    ui.write(`Collection Name: ${collectionName}`);
    ui.write(`Collection Description: ${collectionDescription.substring(0, 50)}...`);
    ui.write(`Collection Image: ${collectionImage}`);
    ui.write(`Social Links: ${socialLinks.join(', ')}`);
    ui.write(`\nDeployment Amount: ${Number(deployAmount) / 1e9} TON`);
    ui.write('\n⚠️  IMPORTANT: Open the link in TonKeeper/Tonhub to deploy the contract!');
}

