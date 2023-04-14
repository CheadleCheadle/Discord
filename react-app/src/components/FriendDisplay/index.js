import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ChatRoom from "../DirectMessages/roomChat.js";
import AllServersNavbar from "../ServerDetails/AllServersNavbar.js";

export default function FriendDisplay() {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  let { friendId } = params;
  friendId = parseInt(friendId);

  const friends = useSelector(state => state.session.user.friends)
  let friend;
  useEffect(() => {
    friend = friends[ friendId ]
  }, [ friendId ])
  friend = friends[ friendId ]
  const user = useSelector(state => state.session.user)
  console.log("FRIENDDDDDDDDDDDDDDDDDDDD", friend)
  return (
    <ChatRoom friendname={friend.username} friend={friend} user={user} username={user.username} />
  )
}
