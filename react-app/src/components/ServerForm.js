import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../context/Modal";
import { useHistory, useParams } from "react-router-dom";
import { thunkAddAServer, thunkEditAServer } from "../store/servers";

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

 const handleSubmit = (e) => {
  e.preventDefault();

  setBErrs([]);

  if (formType === "AddServerForm") {
   const newServer = {
    icon_url: icon_url,
    public_: public_ == "true" ? "True" : "False",
    name: name,
    max_users: max_users,
    description: description,
   };
   console.log("AddServerForm");
   return dispatch(thunkAddAServer(newServer)).then((server) => {
    console.log("this");
    console.log(server);
    history.push(`api/servers/`);
    closeModal();
   });
   // .catch((res) => {
   //   console.log(res)
   // });
  }

  if (formType === "EditServerForm") {
   setIcon_url(server.icon_url);
   setPublic_(server.public);
   setName(server.name);
   setDescription(server.description);
   setMax_users(server.max_users);
   console.log("EditServerForm");
   return dispatch(thunkEditAServer(server)).then((server) => {
    console.log("this");
    console.log(server);
    history.push(`api/servers/`);
    closeModal();
   });
   // .catch((res) => {
   //   console.log(res)
   // });
  }
 };

 return (
  <div className="new-spot-form-container">
   <h2>
    {formType === "AddServerForm"
     ? "Create a new Server"
     : "Update your Server"}
   </h2>

   <form className="new-spot-form" onSubmit={handleSubmit}>
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
    <label className="small-text">
     Name
     <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
     />
    </label>
    <label>
     <input
      type="radio"
      value="true"
      name="public_"
      checked={public_ === "true" ? "checked" : ""}
      onChange={(e) => setPublic_(e.target.value)}
     />
     Public
    </label>
    <label>
     <input
      type="radio"
      value="false"
      name="public_"
      checked={public_ === "false" ? "checked" : ""}
      onChange={(e) => setPublic_(e.target.value)}
     />
     Private
    </label>
    {/* <p className="error-message">
      {errors.filter((err) => err.includes("Street"))}
     </p>
     {<p className="error-message">{bErrs?.street}</p>} */}

    <div className="city-state">
     <label className="city-label small-text">
      Icon URL
      <input
       type="text"
       value={icon_url}
       onChange={(e) => setIcon_url(e.target.value)}
       placeholder="Icon URL"
      />
      {/* <p className="error-message">
       {errors.filter((err) => err.includes("City"))}
      </p>
      {<p className="error-message">{bErrs?.city}</p>} */}
     </label>
    </div>
    <div className="Lat-Lng">
     <label className="lat-label small-text">
      Max number of users
      <input
       type="number"
       value={max_users}
       onChange={(e) => setMax_users(e.target.value)}
       placeholder="Max number of users"
      />
      {/* <p className="error-message">
       {errors.filter((err) => err.includes("Latitude"))}
      </p>
    {<p className="error-message">{bErrs?.lat}</p>}*/}
     </label>
    </div>

    <label className="small-text">
     <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description"
     />
     {/* <p className="error-message">
      {errors.filter((err) => err.includes("Description"))}
     </p> */}
     {/* {<p className="error-message">{bErrs?.description}</p>} */}
    </label>

    <button className={"signup-form-submit-button"} type="submit">
     {formType === "NewSpotsForm" ? "Create Server" : "Update your Server"}
    </button>
   </form>
  </div>
 );
};
export default ServerForm;
