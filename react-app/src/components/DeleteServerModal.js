import React, { useState } from "react";
import { thunkDeleteAServer } from "../store/servers";
import { useDispatch } from "react-redux";
import { useModal } from "../context/Modal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function DeleteServerModal({ serverId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleDelete = () => {
    setErrors([]);
    history.replace('/servers')
     dispatch(thunkDeleteAServer(serverId))
      .then(() => {
        closeModal();
      })

  };

 return (
  <div className="svr-delete-server-form-container">
   <div>
    <h3>Confirm Delete</h3>
   </div>
   <div>
    <p>Are you sure you want to remove this server?</p>
   </div>

      <div>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </div>

   <button className="svr-delete-server-button" onClick={() => handleDelete()}>
    Yes (Delete Server)
   </button>

   <button
    className="svr-cancel-delete-server-button"
    onClick={() => closeModal()}
   >
    No (Keep Server)
   </button>
  </div>
 );
}

export default DeleteServerModal;
