import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import { createChannelAction } from "../../store/channels";
import { updateChannelAction } from "../../store/channels";

export default function AddChannelModal({channel, flag}) {
 const dispatch = useDispatch();
 const serverId = useSelector((state) => state.servers.singleServerId);
 const [name, setName] = useState("");
 const [type, setType] = useState("");
 const [maxUsers, setMaxUsers] = useState(0);
 const [topic, setTopic] = useState("");
 let [errors, setErrors] = useState([]);
 const { closeModal } = useModal();
const currentChannelId = useSelector(state => state.channels.singleChannelId);
 useEffect(() => {
    if (channel) {
    setName(channel.name);
    setType(channel.type);
    setMaxUsers(channel.max_users);
    setTopic(channel.topic);
    }
 }, [flag])
 const handleSubmit = (e) => {
  e.preventDefault();
  validateBody();
  if (flag) {
    console.log("WHERE EDITINGIN")
    const updatedChannel = {
        name,
        type,
        max_users: maxUsers,
        topic
    }
    console.log("CHANNEL TO EDIT", updatedChannel)
    dispatch(updateChannelAction(updatedChannel, currentChannelId));
    closeModal();
  } else {

  const newChannel = {
   server_id: serverId,
   name,
   type,
   max_users: maxUsers,
   topic,
  };
  dispatch(createChannelAction(newChannel, serverId));
  closeModal();
}
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
   {flag ? <h3>Edit Channel</h3> : <h3>New Channel</h3>}
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
     value={flag ? "Update Channel" : "Create new Channel"}
    />
   </form>
  </div>
 );
}
