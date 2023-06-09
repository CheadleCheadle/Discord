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
    const activeUsers = useSelector(state => state.session.activeUsers);

    const handleFriend = (friend) => {
        history.push(`/friends/${friend.id}`);
    };

    const isActive = (friend) => {
        if (activeUsers[ friend.id ]) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <>
            <div className="svr-friends-list">
                <div className="drt-msg">
                    <div className="direct-messages-list">
                        <h3 id="direct-msg-label">Direct Messages</h3>
                    </div>
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
                            <span id={isActive(friend) ? "active-friend": "inactive-friend"}>{isActive(friend) ? "Online" : "Offline"}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
