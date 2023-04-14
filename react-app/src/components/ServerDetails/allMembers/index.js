import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


export default function Members() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();

     const members = useSelector(state => state.servers.allServers[state.servers.singleServerId].users);
     console.log("IM THE MEMBERS!")

     return (
        <>
        <div>
            {members.map((member) => (
                <div key={member.id}>
                    {member.username}
                    <div id="member-info">
                    <img src={member.photo_url}></img>
                    </div>
                </div>
            ))}
        </div>
        </>
     )
}
