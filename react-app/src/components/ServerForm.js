import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../context/Modal";
import { useHistory, useParams } from "react-router-dom";
import { thunkAddAServer, thunkEditAServer } from "../store/servers";
import { editServer } from "../store/session";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
const ServerForm = ({ formType, server }) => {
 const dispatch = useDispatch();
 const [icon_url, setIcon_url] = useState("");
 const [public_, setPublic_] = useState("True");
 const [name, setName] = useState("");
 const [max_users, setMax_users] = useState();
 const [description, setDescription] = useState("");
 const [disabled, setDisabled] = useState(false);
 const [isSubmitted, setIsSubmitted] = useState(false);
 const [errors, setErrors] = useState({});
 const { closeModal } = useModal();
 const history = useHistory();

 let return_servers = useSelector((state) => state.servers);
 let servers = return_servers.allServers;


 useEffect(() => {
  let errs = {};

  if (name.length > 100)
   errs.name = "Name needs to be less than 100 characters";
  if (name === "") {
    errs.name = "Name is Required"
  }
  if (icon_url === "") {
    errs.url = "Icon is required";
  }
  if (description === "") {
    errs.description = "Description is required";
  }
  if (errs.length === 0) setDisabled(false);
  setErrors(errs);
 }, [name, public_, max_users, icon_url, description]);

 const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitted(true);

  if (formType === "AddServerForm") {
   const newServer = {
    icon_url: icon_url,
    name: name,
    max_users: 100,
    description: description,
   };

   let public_value = public_ === "True" ? true : false;
   newServer.public_ = public_value;
   if (!Object.values(errors).length) {
     dispatch(thunkAddAServer(newServer)).then((server) => {
     closeModal();
      });
  }
  }

  if (formType === "EditServerForm") {

   const theServer = {
    icon_url: icon_url,
    name: name,
    max_users: parseInt(max_users),
    description: description,
   };

   let public_value = public_ === "True" ? true : false;
   theServer.public_ = public_value;

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

    <div id="create-server-msg">
      <div id="create-server-msg-cont">
      <h2>Customize your server</h2>
        <div
        onClick={() => closeModal()}
        id="exit">
        <FontAwesomeIcon
        icon={faX} />
        </div>
      </div>
      <p>Give your server a personality with a name and an icon. You can always change it later.</p>
    </div>
   <form className="svr-server-form">
    <div className="where-text"></div>
    {isSubmitted && <p className="errors">{errors.name}</p>}
    <label className="svr-form-label">
     <p>SERVER NAME</p>
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
    {isSubmitted && <p className="errors">{errors.url}</p>}
     <label className="svr-form-label">
      <p>ICON IMAGE</p>
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
    {isSubmitted && <p className="errors">{errors.description}</p>}
    <label className="svr-form-label">
      <p>DESCRIPTION</p>
     <textarea
     id="server-description"
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
   </form>
    <span id="button-server-cont">
    <button
     disabled={disabled}
     onClick={handleSubmit}
     className={
      !errors.length ? "svr-form-button" : "svr-form-button disabled-button"
     }
     type="submit"
    >
     {formType === "AddServerForm" ? "Create" : "Update your Server"}
    </button>
    </span>
  </div>
 );
};
export default ServerForm;
