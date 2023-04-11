import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal.js";


export default function AddChannelModal() {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [maxUsers, setMaxUsers] = useState(0);
    const [topic, setTopic] = useState("");
    let [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        validateBody()
        //add dispatch to session action with new channel obj
    }

    const handleDisable = () => {
      if (name === "") return true;
      if (type === "") return true;
      if (maxUsers <= 0) return true;
      if (topic === "") return true;
    }

    const validateBody = () => {
        const tempErrors = [];
        if (name === "") {
            tempErrors.push("Please Provide a name"):
        }
        if (type === "") {
          tempErrors.push("Please Provide a type");
        }
        if (maxUsers <= 0) {
          tempErrors.push("Please Provide a maximum amount of users")
        }
        if (topic === "") {
          tempErrors.push("Please Provide a topic")
        }
        return setErrors(...errors, ...tempErrors)
    }


    return (
    <h1>New Channel</h1>
    <form>
        <label>
        <input
            placeholder="Name"
            type="text"
            value={name}
            onChange={() => setName(e.target.value)}
            required
        />
        </label>
        <label>
        <input
            placeholder="Type"
            type="text"
            value={type}
            onChange={() => setType(e.target.value)}
            required
        />
        </label>
        <label>
        <input
            placeholder="Max Users"
            type="text"
            value={maxUsers}
            onChange={() => setMaxUsers(e.target.value)}
            required
        />
        </label>
        <label>
        <input
            placeholder="Topic"
            type="text"
            value={topic}
            onChange={() => setTopic(e.target.value)}
            required
        />
        </label>
    </form>
    
    )


}
