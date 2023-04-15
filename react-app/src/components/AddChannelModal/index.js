import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import { createChannelAction } from "../../store/channels";

export default function AddChannelModal() {
 const dispatch = useDispatch();
 const serverId = useSelector((state) => state.servers.singleServerId);
 const [name, setName] = useState("");
 const [type, setType] = useState("");
 const [maxUsers, setMaxUsers] = useState(0);
 const [topic, setTopic] = useState("");
 let [errors, setErrors] = useState([]);
 const { closeModal } = useModal();

 const handleSubmit = (e) => {
  e.preventDefault();
  validateBody();
  const newChannel = {
   server_id: serverId,
   name,
   type,
   max_users: maxUsers,
   topic,
  };
  dispatch(createChannelAction(newChannel, serverId));
  //add dispatch to session action with new channel obj
  closeModal();
 };

 const handleDisable = () => {
  if (name === "") return true;
  if (type === "") return true;
  if (maxUsers <= 0) return true;
  if (topic === "") return true;
 };

 const validateBody = () => {
  const tempErrors = [];
  if (name === "") {
   tempErrors.push("Please Provide a name");
  }
  if (type === "") {
   tempErrors.push("Please Provide a type");
  }
  if (maxUsers <= 0) {
   tempErrors.push("Please Provide a maximum amount of users");
  }
  if (topic === "") {
   tempErrors.push("Please Provide a topic");
  }
  return setErrors(...tempErrors);
 };

 useEffect(() => {
  validateBody();
 });

 return (
  <div className="svr-channel-form-container">
   <h3>New Channel</h3>
   <form className="svr-channel-server-form" onSubmit={handleSubmit}>
    <label className="svr-channel-form-label">
     <input
      className="svr-channel-form-input"
      placeholder="Name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
     />
    </label>
    <label className="svr-channel-form-label">
     <input
      className="svr-channel-form-input"
      placeholder="Type"
      type="text"
      value={type}
      onChange={(e) => setType(e.target.value)}
      required
     />
    </label>
    <label className="svr-channel-form-label">
     <input
      className="svr-channel-form-input"
      placeholder="Max Users"
      type="text"
      value={maxUsers}
      onChange={(e) => setMaxUsers(e.target.value)}
      required
     />
    </label>
    <label className="svr-channel-form-label">
     <input
      className="svr-channel-form-input"
      placeholder="Topic"
      type="text"
      value={topic}
      onChange={(e) => setTopic(e.target.value)}
      required
     />
    </label>
    <input
     className={"svr-channel-form-button"}
     type="submit"
     value="Create new Channel"
    />
   </form>
  </div>
 );
}
