'use strict';

const { Contract } = require('fabric-contract-api');

class FileTrackerContract extends Contract {

    async InitLedger(ctx) {
        const files = [];

        for (const file of files) {
            await ctx.stub.putState(file.fileId, Buffer.from(JSON.stringify(file)));
        }

        console.info('Ledger initialized with empty file list.');
    }

    async CreateFileMetadata(ctx, fileId, fileName, folderName, createdBy, fileHash, fileSize,createdAt,gridFSId) {
        const exists = await this.FileExists(ctx, fileId);
        if (exists) {
            throw new Error(`The file ${fileId} already exists`);
        }

        const fileMetadata = {
            fileId,
            fileName,
            folderName,
            createdBy,
            fileHash,
            fileSize,
            lastModifiedTime: createdAt,
            lastAccessedBy: createdBy,
            lastActionPerformed: "create",
            fileVersion: 1,
            gridFSId,
            rollBackFrom: null,
            rollBackTo: null,
        };

        await ctx.stub.putState(fileId, Buffer.from(JSON.stringify(fileMetadata)));
        return JSON.stringify(fileMetadata);
    }

    async UpdateFileMetadata(ctx, fileId, fileHash, fileSize, modifiedBy,modifiedAt,gridFSId) {
        const file = await this._getFile(ctx, fileId);

        if (file.isLocked && file.lockedBy !== modifiedBy) {
            throw new Error(`File is currently locked by ${file.lockedBy}`);
        }

        file.fileHash = fileHash;
        file.fileSize = fileSize;
        file.fileVersion += 1; // Increment version on update
        file.gridFSId=gridFSId
        file.lastModifiedTime = modifiedAt;
        file.lastAccessedBy = modifiedBy;
        file.lastActionPerformed = "write";
        file.rollBackFrom = null;
        file.rollBackTo = null;

        await ctx.stub.putState(fileId, Buffer.from(JSON.stringify(file)));
        return JSON.stringify(file);
    }

    async ReadFileMetadata(ctx, fileId, accessedBy,modifiedAt) {
        const file = await this._getFile(ctx, fileId);

        file.lastAccessedBy = accessedBy;
        file.lastModifiedTime = modifiedAt;
        file.lastActionPerformed = "read";

        await ctx.stub.putState(fileId, Buffer.from(JSON.stringify(file)));
        return JSON.stringify(file);
    }

    

    async GetFileHistory(ctx, fileId) {
        const iterator = await ctx.stub.getHistoryForKey(fileId);
        const history = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = {
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete,
                    data: JSON.parse(res.value.value.toString('utf8'))
                };
                history.push(record);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(history);
    }

    async RollBackToVersion(ctx, fileId, targetVersion, performedBy, performedAt) {
        const historyJSON = await this.GetFileHistory(ctx, fileId);
        const history = JSON.parse(historyJSON);

        // Find the version to roll back to
        const targetState = history
            .map(h => h.data)
            .find(entry => entry.fileVersion === parseInt(targetVersion));

        if (!targetState) {
            throw new Error(`Version ${targetVersion} not found for file ${fileId}`);
        }

        // Get current state
        const currentState = await this._getFile(ctx, fileId);

        const rollbackState = {
            ...targetState,
            fileVersion: currentState.fileVersion + 1,
            lastActionPerformed: "rollback",
            lastAccessedBy: performedBy,
            lastModifiedTime: performedAt,
            rollBackFrom: currentState.fileVersion,
            rollBackTo: targetVersion,
        };

        await ctx.stub.putState(fileId, Buffer.from(JSON.stringify(rollbackState)));
        return JSON.stringify(rollbackState);
    }


    async FileExists(ctx, fileId) {
        const buffer = await ctx.stub.getState(fileId);
        return !!buffer && buffer.length > 0;
    }

    async _getFile(ctx, fileId) {
        const buffer = await ctx.stub.getState(fileId);
        if (!buffer || buffer.length === 0) {
            throw new Error(`File ${fileId} does not exist`);
        }
        return JSON.parse(buffer.toString());
    }
}

module.exports = FileTrackerContract;
    
