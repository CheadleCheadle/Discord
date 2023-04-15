import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./friends.css";
export default function Friends() {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.session.user.friends);

    console.log(friends);
    const handleFriend = (friend) => {
        //redirect to new route that will be defined in app.js
        console.log(friend);
        history.push(`/friends/${friend.id}`);
    };

    return (
        <>
            <div className="svr-friends-list">
                <div className="drt-msg">
                    <div className="drt-usr-msg-box drt-msg-light-color ">DIRECT MESSAGES</div>

                    {Object.values(friends).map((friend) => (
                        <div
                            className="drt-msg-container"
                            key={friend.id}
                            onClick={() => handleFriend(friend)}
                        >
                            <div className="drt-usr-msg-box">
                                <div id="usr-img">
                                    <img src={friend.photo_url}></img>
                                </div>

                                <div id="usr-name">
                                    <p>{friend.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
