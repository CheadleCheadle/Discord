import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../context/Modal";
import { useHistory, useParams } from "react-router-dom";
import { thunkAddAServer, thunkEditAServer } from "../store/servers";
import { joinServerThunk } from "../store/session";

const ServerForm = ({ formType, server }) => {
 const dispatch = useDispatch();
 const [icon_url, setIcon_url] = useState("");
 const [public_, setPublic_] = useState("false");
 const [name, setName] = useState("");
 const [max_users, setMax_users] = useState("");
 const [description, setDescription] = useState("");

 const [bErrs, setBErrs] = useState([]);
 const { closeModal } = useModal();
 const history = useHistory();

 let servers = useSelector((state) => state.servers.allServers);
 const user = useSelector(state => state.session.user);
 console.log("state.servers.all, server", servers, server);

 const handleSubmit = (e) => {
  e.preventDefault();

  setBErrs([]);

  if (formType === "AddServerForm") {
   const newServer = {
    icon_url: icon_url,
    public_: public_ == "true" ? "True" : "False",
    name: name,
    max_users: 100,
    description: description,
   };
   return dispatch(thunkAddAServer(newServer))
    .then((server) => {
     console.log("new server", server);
     history.push(`/servers/${server.id}`);
     closeModal();
    })
  }

  if (formType === "EditServerForm") {
   setIcon_url(server.icon_url);
   setPublic_(server.public);
   setName(server.name);
   setDescription(server.description);
   setMax_users(server.max_users);
   console.log("EditServerForm");
   return dispatch(thunkEditAServer(server))
    .then((server) => {
     console.log("this");
     console.log(server);
     history.push(`api/servers/`);
     closeModal();
    })
    .catch(async (res) => {
     let data = res.json();
     console.log("update server data", data);
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
     {bErrs?.name === "SequelizeValidationError" &&
      bErrs?.errors.map((error, idx) => <li key={idx}>{error.message}</li>)}
     {/* {bErrs?map((error, idx) => (
            <li className="error-message" key={idx}>
              {error}
            </li>
          ))} */}
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
       value="true"
       name="public_"
       checked={public_ === "true" ? "checked" : ""}
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
       value="false"
       name="public_"
       checked={public_ === "false" ? "checked" : ""}
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
       type="text"
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
    <button className={"svr-form-button"} type="submit">
     {formType === "AddServerForm" ? "Create Server" : "Update your Server"}
    </button>
   </form>
  </div>
 );
};
export default ServerForm;
