import { useNavigate ,useLocation} from 'react-router-dom';
import "../styles/user.css"; // Make sure this path is correct

const LabSelection = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const {user_id}=location.state ||{};
  const handleLabClick = (lab) => {
    navigate(`/files/${encodeURIComponent(lab)}`,{state:{user_id}});
  };

  return (
    <div className="lab-selection-container">
      <h2 className="lab-heading">Select a Lab!!</h2>
      <h3>user : {user_id}</h3>
      <button className="user-btn" onClick={() => handleLabClick('Quantum Lab')}>Quantum Lab</button>
      <button className="user-btn" onClick={() => handleLabClick('Blockchain Lab')}>Blockchain Lab</button>
      <button className="user-btn" onClick={() => handleLabClick('Machine Learning Lab')}>Machine Learning Lab</button>
    </div>
  );
};

export default LabSelection;
