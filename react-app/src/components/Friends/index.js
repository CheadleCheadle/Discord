import React from "react";
import { useParams, Route, Switch, NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import "./friends.css";
export default function Friends() {
    const friends = useSelector(state => state.session.user.friends);

    return (
        <>
            <div className="svr-friends-list">
                <h3>DIRECT MESSAGES</h3>
                {Object.values(friends).map((friend) => (
                    <NavLink to={`/friends/${friend.id}`}>
                        <div key={friend.id}>
                            <div className="usr-box">
                                <div id="usr-img">
                                    <img src={friend.photo_url}></img>
                                </div>
                                <div id="usr-name">
                                    <p>{friend.username}</p>
                                </div>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </>
    )
}
