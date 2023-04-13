import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Chat from "../DirectMessages/Chat.js";
import ChatRoom from "../DirectMessages/roomChat.js";
export default function FriendDisplay() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    let {friendId} = params;
    friendId = parseInt(friendId);

const normalizeFn = (data) => {
    const normalizeData = {};
    data.forEach((val) => normalizeData[ val.id ] = val);
    return normalizeData;
};

    const friends = normalizeFn(useSelector(state => state.session.user.friends))
    const friend = friends[friendId]
    const user = useSelector(state => state.session.user)
    console.log("Im the current user", user)
    const [ message, setMessage ] = useState("");

    return (
        <>
        <div>
            {friend.username}
        </div>
        {/* <Chat friend={friend}/> */}
        <ChatRoom friend={friend} user={user}/>

        </>
    )

}
