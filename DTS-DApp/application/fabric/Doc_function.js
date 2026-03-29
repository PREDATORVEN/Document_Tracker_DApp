const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

// Org1 config
const ccpPathOrg1 = path.resolve(__dirname, '../../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
const walletPathOrg1 = path.join(__dirname, '../wallet/org1');

// Org2 config
const ccpPathOrg2 = path.resolve(__dirname, '../../../fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/connection-org2.json');
const walletPathOrg2 = path.join(__dirname, '../wallet/org2');

// Helper to connect to Org
async function getContract(ccpPath, walletPath, identity, contractName = 'file-tracker') {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity,
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract(contractName);
    return { contract, gateway };
}

exports.createFileMetadata = async ({ fileId, fileName, folderName, createdBy, fileHash,fileSize,createdAt,gridFSId}) => {
    // Connect Org1
    const { contract: contract1, gateway: gateway1 } = await getContract(ccpPathOrg1, walletPathOrg1, 'appUser');
    // Connect Org2 (needed to ensure endorsement policy)
    const { contract: contract2, gateway: gateway2 } = await getContract(ccpPathOrg2, walletPathOrg2, 'appUser');

    // Create proposal from Org1
    const txn = contract1.createTransaction('CreateFileMetadata');

    // Set expected endorsing organizations (Org1 + Org2)
    txn.setEndorsingOrganizations('Org1MSP', 'Org2MSP');



    // Submit transaction with both endorsements
    await txn.submit(fileId, fileName, folderName, createdBy, fileHash,fileSize,createdAt,gridFSId);
    console.log("✅ Document saved and endorsed by Org1 and Org2");

    await gateway1.disconnect();
    await gateway2.disconnect();
};

exports.readFileMetadata= async ({fileId,accessedBy,modifiedAt})=> {
 // Connect Org1
    const { contract: contract1, gateway: gateway1 } = await getContract(ccpPathOrg1, walletPathOrg1, 'appUser');
    // Connect Org2 (needed to ensure endorsement policy)
    const { contract: contract2, gateway: gateway2 } = await getContract(ccpPathOrg2, walletPathOrg2, 'appUser');

    // Create proposal from Org1
    const txn = contract1.createTransaction('ReadFileMetadata');

    // Set expected endorsing organizations (Org1 + Org2)
    txn.setEndorsingOrganizations('Org1MSP', 'Org2MSP');



    // Submit transaction with both endorsements
    const result=await txn.submit(fileId, accessedBy ,modifiedAt);
    console.log("✅ Document Read Mode Updated");

    await gateway1.disconnect();
    await gateway2.disconnect();
    return JSON.parse(result.toString());

};

exports.readFileHistory=async ({fileId})=>{
    const{contract , gateway}= await getContract(ccpPathOrg1,walletPathOrg1,'appUser');
    const result = await contract.evaluateTransaction('GetFileHistory',fileId);
    await gateway.disconnect();
    return JSON.parse(result.toString());
};

exports.updateFileMetadata=async ({fileId,fileHash,fileSize,modifiedBy,modifiedAt,gridFSId})=>{
    // Connect Org1
    const { contract: contract1, gateway: gateway1 } = await getContract(ccpPathOrg1, walletPathOrg1, 'appUser');
    // Connect Org2 (needed to ensure endorsement policy)
    const { contract: contract2, gateway: gateway2 } = await getContract(ccpPathOrg2, walletPathOrg2, 'appUser');

    // Create proposal from Org1
    const txn = contract1.createTransaction('UpdateFileMetadata');

    // Set expected endorsing organizations (Org1 + Org2)
    txn.setEndorsingOrganizations('Org1MSP', 'Org2MSP');

    const result = await txn.submit(fileId, fileHash, fileSize, modifiedBy, modifiedAt, gridFSId);
    console.log("✅ Document Updated");
    await gateway1.disconnect();
    await gateway2.disconnect();
    return JSON.parse(result.toString());
};

exports.rollBackFile=async ({fileId,rollBackTo, modifiedBy, modifiedAt}) => {
    // Connect Org1
    const { contract: contract1, gateway: gateway1 } = await getContract(ccpPathOrg1, walletPathOrg1, 'appUser');
    // Connect Org2 (needed to ensure endorsement policy)
    const { contract: contract2, gateway: gateway2 } = await getContract(ccpPathOrg2, walletPathOrg2, 'appUser');

    // Create proposal from Org1
    const txn = contract1.createTransaction('RollBackToVersion');

    // Set expected endorsing organizations (Org1 + Org2)
    txn.setEndorsingOrganizations('Org1MSP', 'Org2MSP');

    const result = await txn.submit(fileId, rollBackTo, modifiedBy, modifiedAt);
    console.log("✅ Document Rolled Back");
    
    await gateway1.disconnect();
    await gateway2.disconnect();
    return JSON.parse(result.toString());
}

