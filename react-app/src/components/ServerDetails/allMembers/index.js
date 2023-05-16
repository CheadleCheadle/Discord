import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./main.css"
import { getMembersThunk } from "../../../store/members";
import { changeMembershipStatusThunk } from "../../../store/session";


export default function Members() {
    const dispatch = useDispatch();
    const serverId = useSelector(state => state.servers.singleServerId);
    const [members, memberships] = useMembers(serverId);
    const [host, setHost] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    console.log("Here are the members", members);
    console.log("Here are the memberships", memberships);
    console.log("Data", host)
    useEffect(() => {
        dispatch(getMembersThunk(serverId))
        .then(() => {
            setIsLoaded(true)
        });
    }, [])

    const handleAccept = (member) => {
        let theMembership;
        memberships.forEach(membership => {
            if (membership.user_id === member.id && membership.status === "Pending") {
                theMembership = membership;
            }
        })
        console.log("THIS IS THE MEMBERSHIP ID!!!", theMembership);
        if (theMembership) {
            dispatch(changeMembershipStatusThunk(serverId, member.id, theMembership.id))
        }
    }

    const filteredHost = useMemo(() => {
        const filtered = members.filter(member => {
            for (let i = 0; i < memberships.length; i++) {
                const membership = memberships[i];
                if (+membership.user_id === +member.id && membership.status === "Host") {
                    return true;
                }
            }
        });
        return filtered;
    }, [members]);

    const filteredMembers = useMemo(() => {
        const filtered = members.filter(member => {
            for (let i = 0; i < memberships.length; i++) {
                const membership = memberships[i];
                if (+membership.user_id === +member.id && membership.status === "Member") {
                    return true;
                }
            }
        });
        return filtered;
    })

    const filteredPending = useMemo(() => {
        const filtered = members.filter(member => {
            for (let i = 0; i < memberships.length; i++) {
                const membership = memberships[i];
                if (+membership.user_id === +member.id && membership.status === "Pending") {
                    return true;
                }
            }
        });
        return filtered;
    })

    console.log("filtered host", filteredHost)
    console.log("filtered members", filteredMembers);
    console.log("filtered pending", filteredPending);

  return ( isLoaded &&
        <div className="members-cont">

        <span id="status">Host - 1</span>
        {filteredHost.map((member) => (
            <div id="members-info"key={member.id}>
            <div id ="mbr-image">
            <img src={member.photo_url}></img>
            </div>
            <p>{member.username}</p>
            </div>
        ))}
        {filteredMembers.length ? <span id="status">Members - {filteredMembers.length}</span> : null}
        {filteredMembers.map((member) => (
            <div id="members-info" key={member.id}>
            <div id="mbr-image">
            <img src={member.photo_url}></img>
            </div>
            <p>{member.username}</p>
            </div>
        ))}
        {filteredPending.length ? <span id="status">Pending - {filteredPending.length}</span> : null}
        {filteredPending.map((member) => (
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


    return [members, memberships];

}
