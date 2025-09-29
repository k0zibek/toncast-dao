import { Cell, Slice } from '@ton/core';

const transactionHex = 'b5ee9c72010225010005710003b57cf8f4228502514f5ebb6b8e7c143edba902df6f5c6a762cf6f5b487ec57003ea000023c2e72b4441688ca542457c90032a5971b5d8b343d44cc76a529558c7ecbfd45bcdd587822d000023c2e2d1600168d198120003467da72e80102030201e0040500827206bbcf349003c7e6246d9cba0054ad90372c7973a385be9fa2a94b4fd82e656c24e36c77807df713f5cb5213c3a57d5ade82222a68a6fda0cae1529e8f60c39b02170455890092787c18655b7c11232401b16800c58c96df0c6ea70d24f3f6ae9e6f7b67b8fa5bdee68c4c2982af5c42cd41ce830033e3d08a1409453d7aedae39f050fb6ea40b7dbd71a9d8b3dbd6d21fb15c00fa90092787c00620a02600004785cdbdf204d1a3300ec0060101df0701310000000100000000000000000000000000000000402faf08080902b168019f1e8450a04a29ebd76d71cf8287db75205bedeb8d4ec59edeb690fd8ae007d50033c33975dd90a9b40173ec14ba04547cec74af920e889555a2151fe87d880e8d500bebc200064fddfe00004785ce568884d1a33025e008090201340a0b014380172d112f11c23e28fd8d36edd9634d248ba4554556f9e1d640a8aade1bd24d3ab01a0114ff00f4a413f4bcf2c80b0c005300000000000000008019f1e8450a04a29ebd76d71cf8287db75205bedeb8d4ec59edeb690fd8ae007d500201620d0e0202ce0f100009a11f9fe0050201201112020120181903e10c8871c02497c0f83434c0c05c6c2497c0f83e903e900c7e800c5c75c87e800c7e800c1cea6d003c00812ce3850c1b088d148cb1c17cb865407e90350c0408fc00f801b4c7f4cfe08417f30f45148c2eb8c08c0d4de0840bf2c9a8949c2eb8c0a0840e8e8e8e85eeb8c097c1a103fcbc2013141500113e910c1c2ebcb8536002ac3210375e3240135135c705f2e191fa4021f001fa40d20031fa0020d749c200f2e2c4820afaf0801ba121945315a0a1de22d70b01c300209206a19136e220c2fff2e1922194102a375be30d0293303234e30d5502f0031617007c3234347082108b77173504c8cbff5005cf16102410238040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0000807082107b7b7b7b02c8cbff5007cf165005cf16cc102410238040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00007c821005138d91c85009cf16500bcf16712449145446a0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb001047006a26f0018210d53276db103744006d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00003b3b513434cffe900835d27080269fc07e90350c04090408f80c1c165b5b60001d00f232cfd633c58073c5b3327b5520010300c01b0201201c1d0143bff082eb663b57a00192f4a6ac467288df2dfeddb9da1bee28f6521c8bebd21f1ec01e0201201f20000c00302e706e670142bf82a3537ff0dbce7eec35d69edc3a189ee6f17d82f353a553f9aa96cb0be3ce89210142bf89046f7a37ad0ea7cee73355984fa5428982f8b37c8f7bcec91f7ac71a7cd10422003800202330207c20313030303030303030307c31373538353636343037005c0043b9aca000000000068d19807800c58c96df0c6ea70d24f3f6ae9e6f7b67b8fa5bdee68c4c2982af5c42cd41ce009e436dcc05dbdc00000000000000007d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006fc99df3304c4fdd8400000000000200000000000351116fcf72a701b45e605b05bcb321ab958668cb4c45cd1a04106d6720b231104710d524';

try {
    const cell = Cell.fromBoc(Buffer.from(transactionHex, 'hex'))[0];
    const slice = cell.beginParse();
    
    console.log('Transaction BOC analysis:\n');
    
    // Skip transaction headers to get to the message body
    // This is a complex structure, let's look for interesting patterns
    
    // Look for ASCII text in the data
    const findAsciiInCell = (cell: Cell, depth = 0): void => {
        const indent = '  '.repeat(depth);
        const data = cell.toBoc();
        
        // Look for ASCII sequences
        let asciiStart = -1;
        let asciiBuffer = '';
        
        for (let i = 0; i < data.length; i++) {
            if (data[i] >= 32 && data[i] <= 126) {
                if (asciiStart === -1) asciiStart = i;
                asciiBuffer += String.fromCharCode(data[i]);
            } else if (asciiBuffer.length > 3) {
                console.log(`${indent}ASCII at offset ${asciiStart}: "${asciiBuffer}"`);
                asciiBuffer = '';
                asciiStart = -1;
            } else {
                asciiBuffer = '';
                asciiStart = -1;
            }
        }
        
        if (asciiBuffer.length > 3) {
            console.log(`${indent}ASCII at offset ${asciiStart}: "${asciiBuffer}"`);
        }
        
        // Check refs
        const refs = [];
        try {
            const slice = cell.beginParse();
            while (slice.remainingRefs > 0) {
                refs.push(slice.loadRef());
            }
        } catch (e) {
            // Ignore parsing errors
        }
        
        refs.forEach((ref, i) => {
            console.log(`${indent}Ref ${i}:`);
            findAsciiInCell(ref, depth + 1);
        });
    };
    
    console.log('Looking for ASCII text in transaction:');
    findAsciiInCell(cell);
    
    // Also try to find specific patterns
    const bocHex = cell.toBoc().toString('hex');
    
    // Look for .png
    const pngIndex = bocHex.indexOf('2e706e67'); // .png in hex
    if (pngIndex >= 0) {
        console.log(`\nFound ".png" at hex offset ${pngIndex}`);
        // Get surrounding context
        const start = Math.max(0, pngIndex - 40);
        const end = Math.min(bocHex.length, pngIndex + 40);
        console.log(`Context: ${bocHex.substring(start, end)}`);
    }
    
    // Look for the timestamp pattern
    const timestampPattern = '313030303030303030307c31373538353636343037'; // "100000000|1758566407"
    const tsIndex = bocHex.indexOf(timestampPattern);
    if (tsIndex >= 0) {
        console.log(`\nFound timestamp pattern at hex offset ${tsIndex}`);
        console.log(`Decoded: ${Buffer.from(timestampPattern, 'hex').toString('ascii')}`);
    }
    
} catch (error) {
    console.error('Error parsing transaction:', error);
}
