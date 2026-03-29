import { useParams, useNavigate ,useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/user.css';

const FilesInLab = () => {
  const location=useLocation();
  const {user_id}=location.state || {};
  const { labName } = useParams();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/lab-files?lab=${labName}`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error(err));
  }, [labName]);

  const handleRowClick = async (file_id) => {
  // navigate to /view_meta
    
     const now=new Date();
     const modify_time=now.toISOString();
     
     try{
     	

     	const res= await axios.get(`http://localhost:5000/api/file_metadata/${file_id}/${user_id}/${modify_time}`);
     	if(res.data.status=='success'){
     	navigate('/view_meta',{state:{metadata:res.data.metadata,user_id:user_id}});
     	alert(`Input Params:\nFile ID: ${file_id}\nUser ID: ${user_id}\nModified At: ${modify_time}`);
     	}
     	else{
     	console.error("Failed to fetch metadata",res.data.message);
     	}
     }
     catch(err){
     console.error('Error in handleRowClick:', err);
     }
  };

  return (
    <div className="file-table-container">
      <h2 className="file-table-heading">FILES IN {labName.toUpperCase()}</h2>
      <h3>user : {user_id}</h3>
      <table className="file-table">
        <thead>
          <tr>
            <th>File ID</th>
            <th>File Name</th>
            <th>File Version</th>
            <th>Type</th>
            <th>Size (bytes)</th>
            <th>Hash</th>
            <th>Uploaded By</th>
            <th>Uploaded On</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const meta = file.metadata || {};
            return (
              <tr key={file._id} onClick={() => handleRowClick(meta.file_id)} style={{ cursor: 'pointer' }}>
                <td>{meta.file_id}</td>
                <td>{meta.file_name}</td>
                <td>{meta.file_version}</td>
                <td>{meta.file_type}</td>
                <td>{meta.file_size}</td>
                <td style={{ wordBreak: 'break-word' }}>{meta.file_hash}</td>
                <td>{meta.created_by || 'N/A'}</td>
                <td>{new Date(meta.created_on).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FilesInLab;
