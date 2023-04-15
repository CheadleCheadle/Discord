// frontend/src/components/DeleteReviewModal.js
import React, { useState } from "react";
import { thunkDeleteAServer } from "../store/servers";
import { useDispatch } from "react-redux";
import { useModal } from "../context/Modal";
//import "./LoginForm.css";

function DeleteServerModal({ serverId }) {
  const dispatch = useDispatch();
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleDelete = () => {
    setErrors([]);
    return dispatch(thunkDeleteAServer(serverId))
      .then(closeModal)
      .catch(async (res) => {
        closeModal();
      });
  };

<<<<<<< HEAD
 return (
  <div className="svr-delete-server-form-container">
   <div>
    <h3>Confirm Delete</h3>
   </div>
   <div>
    <p>Are you sure you want to remove this server?</p>
   </div>
=======
  return (
    <div className="delete-review-form-container">
      <div>
        <h1>Confirm Delete</h1>
      </div>
      <div>
        <p>Are you sure you want to remove this server?</p>
      </div>
>>>>>>> login/singup-modals-css

      <div>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </div>

<<<<<<< HEAD
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
=======
      <button className="delete-review-button" onClick={() => handleDelete()}>
        Yes (Delete Server)
      </button>

      <button className="cancel-delete-review-button" onClick={() => closeModal()}>
        No (Keep Server)
      </button>
    </div>
  );
>>>>>>> login/singup-modals-css
}

export default DeleteServerModal;
