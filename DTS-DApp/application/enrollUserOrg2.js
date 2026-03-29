// enrollUser.js
'use strict';

const { Wallets, X509Identity } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a CA client for interacting with CA
        const caURL = ccp.certificateAuthorities['ca.org2.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a wallet (or access existing)
        const walletPath = path.join(__dirname, 'wallet/org2');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check if user already exists
        const userExists = await wallet.get('appUser');
        if (userExists) {
            console.log('appUser already exists in the wallet');
            return;
        }

        // Check for admin identity
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin identity not found in the wallet');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user
        const secret = await ca.register({
            affiliation: 'org2.department1',
            enrollmentID: 'appUser',
            role: 'client'
        }, adminUser);

        // Enroll the user
        const enrollment = await ca.enroll({
            enrollmentID: 'appUser',
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org2MSP',
            type: 'X.509'
        };

        await wallet.put('appUser', x509Identity);
        console.log('✅ Successfully enrolled appUser and stored in wallet');
    } catch (error) {
        console.error(`Failed to enroll appUser: ${error}`);
    }
}

main();

