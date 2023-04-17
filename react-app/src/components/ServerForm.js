import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../context/Modal";
import { useHistory, useParams } from "react-router-dom";
import { thunkAddAServer, thunkEditAServer } from "../store/servers";
import { editServer } from "../store/session";

const ServerForm = ({ formType, server }) => {
 const dispatch = useDispatch();
 const [icon_url, setIcon_url] = useState("");
 const [public_, setPublic_] = useState("True");
 const [name, setName] = useState("");
 const [max_users, setMax_users] = useState();
 const [description, setDescription] = useState("");
 const [disabled, setDisabled] = useState(false);

 const [errors, setErrors] = useState([]);
 const { closeModal } = useModal();
 const history = useHistory();

 let return_servers = useSelector((state) => state.servers);
 let servers = return_servers.allServers;



 console.log("state.servers.allServers, server", servers, server);
 useEffect(() => {
  if (formType === "EditServerForm") {
   setIcon_url(server.icon_url);
   server.public === true ? setPublic_("True") : setPublic_("False");
   setName(server.name);
   setDescription(server.description);
   setMax_users(server.max_users);
  }
 }, [formType]);

 useEffect(() => {
  let errs = [];
  setDisabled(true);
  if (max_users < 3)
   errs.push("Max number of members need to be greater than 2.");
  if (max_users === null) errs.push("Max number of members is required");
  //

  if (name.length > 100)
   errs.push("Name need to be no more than 100 characters");
  if (!public_) errs.push("Public or Private type is required");

  // if (showErr) {
  if (errs.length === 0) setDisabled(false);
  //  if (run === false) setRun(true);
  setErrors(errs);
  // } else {
  //  if (errs.length === 0) setRun(true);
  //  else setRun(false);
  // }
 }, [name, public_, max_users, icon_url]);

 const handleSubmit = (e) => {
  e.preventDefault();
  setErrors([]);

  if (formType === "AddServerForm") {
   const newServer = {
    icon_url: icon_url,
    name: name,
    max_users: 100,
    description: description,
   };

   let public_value = public_ === "True" ? true : false;
   newServer.public_ = public_value;
   console.log("****************newServer", newServer);
    dispatch(thunkAddAServer(newServer)).then((server) => {
    console.log("new server", server);
    //history.push(`/servers/${server.id}`);
    closeModal();
   });
  }

  if (formType === "EditServerForm") {
   //  setIcon_url(server.icon_url);
   //  setPublic_(server.public);
   //  setName(server.name);
   //  setDescription(server.description);
   //  setMax_users(server.max_users);

   const theServer = {
    icon_url: icon_url,
    name: name,
    max_users: parseInt(max_users),
    description: description,
   };

   let public_value = public_ === "True" ? true : false;
   theServer.public_ = public_value;

   console.log("EditServerForm");
   console.log("****************theServer", theServer);
   dispatch(thunkEditAServer(theServer, server.id))
   .then((server) => {
      dispatch(editServer(server))
     closeModal();
    })
    .catch(async (res) => {
     let data = res.json();
    });
  }
 };

 return (
  <div className="svr-server-form-container">
   <h3>
    {formType === "AddServerForm"
     ? "Create a new Server"
     : "Update your Server"}
   </h3>

   <form className="svr-server-form" onSubmit={handleSubmit}>
    <div className="where-text"></div>
    <ul className="error-message">
     {/* {bErrs?.name === "SequelizeValidationError" &&
      bErrs?.errors.map((error, idx) => <li key={idx}>{error.message}</li>)} */}
     {errors?.map((error, idx) => (
      <li className="error-message" key={idx}>
       {error}
      </li>
     ))}
    </ul>
    <label className="svr-form-label">
     Server name:
     <input
      className="svr-form-input"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
      required
     />
    </label>
    {formType === "AddServerForm" ? (
     ""
    ) : (
     <label>
      <input
       type="radio"
       value="True"
       name="public_"
       checked={public_ === "True" ? "checked" : ""}
       onChange={(e) => setPublic_(e.target.value)}
       required
      />
      Public
     </label>
    )}
    {formType === "AddServerForm" ? (
     ""
    ) : (
     <label>
      <input
       type="radio"
       value="False"
       name="public_"
       checked={public_ === "False" ? "checked" : ""}
       onChange={(e) => setPublic_(e.target.value)}
       required
      />
      Private
     </label>
    )}

    <div className="svr-Icon-URL">
     <label className="svr-form-label">
      Icon URL:
      <input
       className="svr-form-input"
       type="url"
       value={icon_url}
       onChange={(e) => setIcon_url(e.target.value)}
       placeholder="Icon URL"
       required
      />
      {/* <p className="error-message">
       {errors.filter((err) => err.includes("City"))}
      </p>
      {<p className="error-message">{bErrs?.city}</p>} */}
     </label>
    </div>
    <div className="max-number">
     {formType === "AddServerForm" ? (
      ""
     ) : (
      <label className="svr-form-label">
       Max number of users:
       <input
        className="svr-form-input"
        type="number"
        value={max_users}
        onChange={(e) => setMax_users(e.target.value)}
        placeholder="Max number of users"
        required
       />
      </label>
     )}
     {/* <p className="error-message">
       {errors.filter((err) => err.includes("Latitude"))}
      </p>
    {<p className="error-message">{bErrs?.lat}</p>}*/}
    </div>
    <label className="svr-form-label">
     Description:
     <textarea
      className="svr-form-input"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description"
      required
     />
     {/* <p className="error-message">
      {errors.filter((err) => err.includes("Description"))}
     </p> */}
     {/* {<p className="error-message">{bErrs?.description}</p>} */}
    </label>
    <button
     disabled={disabled}
     className={
      !disabled ? "svr-form-button" : "svr-form-button disabled-button"
     }
     type="submit"
    >
     {formType === "AddServerForm" ? "Create Server" : "Update your Server"}
    </button>
   </form>
  </div>
 );
};
export default ServerForm;
