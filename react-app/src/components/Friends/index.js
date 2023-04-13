import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./friends.css";
export default function Friends() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const friends = useSelector(state => state.session.user.friends);
    const otherFriends = useSelector(state => state.session.user.friends_of_me)
    const allFriends = [...friends, ...otherFriends];
    console.log("Im the friends", allFriends)
    const handleFriend = (friend) => {
        //redirect to new route that will be defined in app.js
        console.log(friend)
        history.push(`/friends/${friend.id}`);
    }

    return (
        <div className="svr-friends-list">
        {allFriends.map((friend) => (
        <div key={friend.id} onClick={() => handleFriend(friend)}>
        {friend.username}
        </div>
        )
        )}
        </div>



    )
}
