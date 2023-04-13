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

    const friends = useSelector(state => state.session.user.friends)
    const otherFriends = useSelector(state => state.session.user.friends_of_me)
    const allFriends = normalizeFn([...friends, ...otherFriends]);
    const friend = allFriends[friendId]
    const user = useSelector(state => state.session.user)
    console.log("Im the current user", user)
    const [ message, setMessage ] = useState("");

    return (
        <>
        <div>
            {friend.username}
        </div>
        {/* <Chat friend={friend}/> */}
        <ChatRoom friendname={friend.username} username={user.username}/>

        </>
    )

}
