import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./main.css"
import { fetchAllMembersThunk, getMembersThunk, newPending } from "../../../store/members";
import { changeMembershipStatusThunk, newMembership } from "../../../store/session";
import { socket } from "../../DirectMessages/roomChat";
import { newMember } from "../../../store/members";

export default function Members() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const serverId = useSelector(state => state.servers.singleServerId);
    const [ isLoaded, setIsLoaded ] = useState(false);
    const host = useSelector(state => state.members.host);
    const members = Object.values(useSelector(state => state.members.members));
    const pending = Object.values(useSelector(state => state.members.pending));
    const memberships = Object.values(useSelector(state => state.session.memberships));
    const roomName = String(serverId);
    useEffect(() => {
        setIsLoaded(true);

        socket.on('join_message', (data) => {
            console.log(data);
        })

        socket.on('new_member', (data) => {
            dispatch(newMembership(data.membership));
            dispatch(newPending(data.user));
        });
    }, [ dispatch ])

    const handleAccept = (member) => {
        let theMembership;
        memberships.forEach(membership => {
            if (membership.user_id === member.id && membership.status === "Pending") {
                theMembership = membership;
            }
        })
        if (theMembership) {
            dispatch(newMember(member));
            dispatch(changeMembershipStatusThunk(serverId, member.id, theMembership.id))
                .then(() => {
                    let updatedMembership;
                    memberships.forEach(membership => {
                        if (membership.user_id === member.id && membership.status === "Member") {
                            updatedMembership = membership;
                        }
                    })
                    socket.emit('server_joined', { membership: updatedMembership, roomName });
                })

        }
    }

    // const handlePending = () => {
    //     return (

    //         {pending.length ? <span id="status">Pending - {pending.length}</span> : null}
    //         {pending.map((member) => (
    //             <div id="members-info" key={member.id}>
    //             <div id="mbr-image">
    //             <img src={member.photo_url}></img>
    //             </div>
    //             <p>{member.username}</p>
    //             <button onClick={() => handleAccept(member)} id="accept-button">Accept?</button>
    //             </div>
    //         ))}
    //     )
    // }



    return (isLoaded &&
        <div className="members-cont">

            <span id="status">MEMBERS - {members.length + 1}</span>
            <div id="members-info" key={host.id}>
                <div id="mbr-image">
                    <img src={host.photo_url}></img>
                </div>
                <p>{host.username}</p>
            </div>

            {members.length ? <span id="status">Members - {members.length}</span> : null}
            {members.map((member) => (
                <div id="members-info" key={member.id}>
                    <div id="mbr-image">
                        <img src={member.photo_url}></img>
                    </div>
                    <p>{member.username}</p>
                </div>
            ))}
            {pending.length && host.id === user.id ? <span id="status">Pending - {pending.length}</span> : null}
            {host.id === user.id && pending.map((member) => (
                <div id="members-info" key={member.id}>
                    <div id="mbr-image">
                        <img src={member.photo_url}></img>
                    </div>
                    <p>{member.username}</p>
                    <button onClick={() => handleAccept(member)} id="accept-button">Accept?</button>
                </div>
            ))}

        </div>

    );
}

function useMembers(serverId) {
    const members = Object.values(useSelector(state => state.members.members));

    //Filter the memberships to those only within current server
    const memberships = Object.values(useSelector(state => state.session.memberships))
        .filter(membership => membership.server_id === +serverId);


    return [ members, memberships ];

}
