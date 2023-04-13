import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from "react-router-dom";

export default function JoinServer({server}) {
 const dispatch = useDispatch();
 const history = useHistory();
 const { setModalContent, setOnModalClose } = useModal();
 const user = useSelector(state => state.session.user);
 const handleJoin = async () => {
    //send fetch post
    console.log(user.id);
    const response = await fetch(`/api/servers/join/${server.id}`, {
        method: "POST",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify({user, status: "pending"})
    });

    if (response.ok) {
        const data = await response.json();
        console.log(response);
        history.replace(`/servers/${server.id}`);
    }
     //redirect to new server
 }
return (
    <>
    <h1>Join {server.name}?</h1>
    <div onClick={handleJoin}>Join server </div>
    <div>Don't join </div>
    </>
)

}
