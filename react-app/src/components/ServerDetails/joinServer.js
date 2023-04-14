import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from "react-router-dom";
import { joinServerThunk } from "../../store/session";
export default function JoinServer({server}) {
 const dispatch = useDispatch();
 const history = useHistory();
 const { setModalContent, setOnModalClose } = useModal();
 const user = useSelector(state => state.session.user);
 const handleJoin =  () => {
    dispatch(joinServerThunk(server.id, user));
    history.replace(`/servers`)
 }
return (
    <>
    <h1>Join {server.name}?</h1>
    <div onClick={handleJoin}>Join server </div>
    <div>Don't join </div>
    </>
)

}
