const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient,GridFSBucket ,ObjectId} = require('mongodb');
const multer=require('multer');
const {Readable}=require('stream');
const crypto=require('crypto');
const fs=require('fs');
const fabric=require('../fabric/Doc_function');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Setup
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'D-App';
const collectionName = 'users'; // Make sure this exists in your MongoDB
const storage = multer.memoryStorage();
const upload = multer({ storage });
let bucket;

client.connect().then(() => {
  const db = client.db(dbName);
  bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  console.log("GridFS Bucket ready.");
}).catch(console.error);

// File upload Dependency

function generateFileID(folder) {
  const prefixMap = {
    "Blockchain Lab": "BLK",
    "Machine Learning Lab": "MLL",
    "Quantum Lab": "QLB"
  };
  const prefix = prefixMap[folder] || "GEN";
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${randomStr}`;
}


function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}



// Route for login
app.post('/api/login', async (req, res) => {
  try {
    const { user_email, user_pass } = req.body;
    
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection(collectionName);

    const user = await users.findOne({ 'user_email':user_email, 'user_pass':user_pass });

    if (user) {
      if (user['type']=='user'){
         res.json({ status: 'success_user', message: 'Login successful' });
      console.log('Data Found:',user);
      }
      res.json({ status: 'success_admin', message: 'Login successful' });
      console.log('Data Found:',user);
    } else {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
      console.log('Data Not Found:',user);
  
    }
  } catch (err) {
    console.error(err);
   return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Signup Information
app.post('/api/signup',async (req,res)=> {
  try{
    const {user_name,user_email,user_pass}=req.body;
    const now= new Date();
    const data={
      'entry_time': now.toLocaleString(),
      'user_email':user_email,
      'user_name':user_name,
      'user_pass':user_pass,
      'is_approved':false,
      'type':'user'
    };
    console.log("Data Created:",data)
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection(collectionName);
    
    const check_entry= await users.findOne({'user_email':user_email});
    if (check_entry){
      res.json({status:'redundant',message:'Please Enter New Email ID,This One Already Taken!!'});
      console.log("Email ID Already Registered!!");
      
    }
    else{
    const new_entry = await users.insertOne(data);
    if (new_entry){
      res.json({status:'success',message:'SignUp Requested!!'});
      console.log('User signup request initiated');
    }
    else{
      res.json({status:'fail',message:'SignUp Request Declined!!'});
      console.log('User signup request Declined,Try Again Later');
    }
    }
  }
  catch(err){
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  
  }
});

// Upload File Route
app.post('/api/upload', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
  else{
  const options = req.body.options ? JSON.parse(req.body.options) : [];
  const {created_by }=req.body;
  const file_id=generateFileID(options[0]);
  
  try {
    const uploadResults = [];

    for (const file of req.files) {
      const stream = Readable.from(file.buffer);
      const file_hash=hashBuffer(file.buffer);
      const now= new Date();
      const filedata={
        file_id,
        file_type: file.mimetype,
        file_name: file.originalname,
        file_version: 1,
        file_hash,
        file_size: file.size,
        file_status: 'active',
        collection_name: options[0],
        created_on: now.toISOString(),
        created_by
      };
      const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: filedata,
      });

      stream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          uploadResults.push({
            filename: uploadStream.filename,
            fileId: uploadStream.id,
            filedata,
          });
          resolve();
        });
        uploadStream.on('error', reject);
      });
      
      const doc_data=await fabric.createFileMetadata({
      fileId:filedata.file_id,
      fileName:filedata.file_name,
      folderName:filedata.collection_name,
      createdBy:filedata.created_by,
      fileHash:filedata.file_hash,
      fileSize:filedata.file_size,
      createdAt:filedata.created_on,
      gridFSId:uploadStream.id.toString()
      }); 
    }

    return res.json({
      status:'success',
      message: 'Files uploaded successfully',
      files: uploadResults
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.json({ 
      status:'fail',
      message: 'Error uploading files' });
  }
}
});

// View  File Route
app.get('/api/file_view/:file_id/:GridId', async (req, res) => {
  try {
    const db = client.db(dbName);
    const searchitem=req.params.file_id;
    const file = await db.collection('uploads.files').findOne({ 
      $and:[
        {_id:new ObjectId(req.params.GridId)},
        {"metadata.file_status":"active" },
        
      ]});

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

   res.set({
      'Content-Type': file.metadata?.file_type || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${file.filename}"`,
    });

    const downloadStream=bucket.openDownloadStream(new ObjectId(req.params.GridId));
    downloadStream.pipe(res);
  } catch (err) {
    console.error('File View error:', err);
    return res.status(500).json({ message: 'Error retrieving file' });
  }
});

// Download File Route

app.get('/api/file_download/:filename',async (req,res)=>{

  try{
    const db=client.db(dbName);
    const searchitem=req.params.filename;
    const file= await db.collection('uploads.files').findOne({
      $or:[
        {filename:searchitem},
        {"metadata.file_id":searchitem}
      ] 
    });
    if(!file){
     return res.status(404).json({message:"File Not Found!!"});
    }
    
    res.set({
        'Content-Type':file.metadata?.file_type || 'application/octet-stream',
        'Content-Disposition':`attachment;filename="${file.filename}"`,
    });
    const downloadStream = bucket.openDownloadStreamByName(file.filename);
    downloadStream.pipe(res);
    
  }
  catch (err){
    console.error("Download Error: ",err);
  }
});

// Metadata File Route
app.get('/api/file_metadata/:fileId/:accessedBy/:modifiedAt',async (req,res)=>{
    try{
    const{fileId, accessedBy, modifiedAt}=req.params;
    const result=await fabric.readFileMetadata({fileId,accessedBy,modifiedAt});
   
    return res.json({
      status:'success',
      message: 'File Metadata Found',
      metadata: result
    });
    }
    catch(err){
    console.error('Metadata Read Error:', err);
    return res.json({ 
      status:'fail',
      message: 'Error getting file metadata' });
    }
});


// ✅ Get Files by Lab Name
app.get('/api/lab-files', async (req, res) => {
  try {
    const lab = req.query.lab;
    const db = client.db(dbName);

    const files = await db.collection('uploads.files').find({
      "metadata.collection_name": lab,
      "metadata.file_status":"active"  // ✅ match any file tagged with the selected lab
    }).toArray();

    res.json(files);
  } catch (err) {
    console.error("Error fetching lab files:", err);
    res.status(500).json({ message: "Error retrieving files" });
  }
});

// Get File History Route
app.get('/api/file-history/:fileId',async (req,res)=>{
    try{
 //   const {fileId}= req.query.fileId;
    const{fileId}=req.params;
    const file_his=await fabric.readFileHistory({fileId});
    return res.json({
        status:'success',
        message:'File History Found',
        data:file_his
    });
    }
    catch (err){
    console.error("Error fetching file history:", err);
    res.status(500).json({ message: "Error retrieving file history" });
    }
});
// Update File Metadata Route
app.post('/api/update-file/',upload.array('files'),async(req,res)=>{
  try{
    console.log("Update File Metadata Request Received");
    console.log(req.body);
    console.log(req.files);
    if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No file for update uploaded.' });
  }

  else{
    const {fileId,fileVersion,folderName, modifiedBy} = req.body;
    const db = client.db(dbName) ;
    for (const file of req.files) {
      const stream = Readable.from(file.buffer);
      const file_hash=hashBuffer(file.buffer);
      const labName = folderName ;
      const hash_found=await db.collection('uploads.files').findOne({"metadata.file_hash":file_hash,
        "metadata.collection_name":labName});
      if(hash_found){
        return res.json({ status: 'fail', message: 'File Already Exists!! Please Upload a Different File' });
      }
      await db.collection('uploads.files').updateMany(
      {"metadata.file_id":fileId},
      {$set:{"metadata.file_status":"inactive"}});
    const uploadResults = []; 
      const now= new Date();
      const modifiedAt= now.toISOString();
      const filedata={
        file_id: fileId,
        file_type: file.mimetype,
        file_name: file.originalname,
        file_version: Number(fileVersion)+1,
        file_hash,
        file_size: file.size,
        file_status: 'active',
        collection_name: folderName,
        created_on: modifiedAt,
        created_by:modifiedBy
      };
      const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: filedata,
      });

      stream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          uploadResults.push({
            filename: uploadStream.filename,
            fileId: uploadStream.id,
            filedata,
          });
          resolve();
        });
        uploadStream.on('error', reject);
      });
      
    
    const result = await fabric.updateFileMetadata({
      fileId,
      fileHash:file_hash,
      fileSize: file.size,
      modifiedBy,
      modifiedAt,
      gridFSId:uploadStream.id.toString()
    });
    return res.json({
      status: 'success',
      message: 'File metadata updated successfully',
      files: uploadResults
    });
  }

}
  }
  catch (err) {
    console.error('Error updating file metadata:', err);
    return res.status(500).json({ status: 'fail', message: 'Error updating file metadata' });
  }
});


// Rollback File Version options
app.get("/api/file_rollback_options/:fileId", async (req, res) => {
  try{
    const {fileId}=req.params;
    const db = client.db(dbName);
    const file = await db.collection('uploads.files').find({
      "metadata.file_id": fileId,
      "metadata.file_status": "inactive"
    }).toArray();
    if (!file || file.length === 0) {
      return res.json({ status: 'fail', message: 'No rollback options available for this file' });
    }
    const roll_options=[];
    const arr_len=file.length;
    for (let i=0;i<arr_len;i++){
      roll_options.push(file[i].metadata.file_version);
    }
    console.log("Rollback Options:",roll_options);
    return res.json({
      status: 'success',
      message: 'Rollback options retrieved successfully',
      data: roll_options
    });
  }
  catch (err){
    console.error("Error fetching rollback options:", err);
    return res.status(500).json({ status: 'fail', message: 'Error fetching rollback options' });
  }
});

// File Version Management Route
app.post('/api/file_rollback/:fileId/:rollBackTo/:modifiedBy/:currentVersion', async (req, res) => {
  try {
    const {fileId, rollBackTo, modifiedBy,currentVersion} = req.params;
    const modifiedAt = new Date().toISOString();
    const result=await fabric.rollBackFile({fileId, rollBackTo, modifiedBy, modifiedAt});
    if(!result){
      return res.status(404).json({ status: 'fail', message: 'File version not found' });
    }
    // Update the GridFS file status to 'active' for the rolled back version
    const db = client.db(dbName);

    await db.collection('uploads.files').updateMany(
      { "metadata.file_id": fileId},{ $set: { "metadata.file_status": "inactive" } });
    
    await db.collection('uploads.files').updateOne(
      { "metadata.file_id": fileId, "metadata.file_version": Number(rollBackTo) },
      { $set: { "metadata.file_status": "active","metadata.file_version":Number(currentVersion)+1} }
    );
    return res.json({
      status: 'success',
      message: 'File rolled back successfully',
      data: result
    });
  }
  catch (err) {
    console.error('Error to rollback file:', err);
    return res.status(500).json({ status: 'fail', message: 'Error in file version management' });
  }});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
