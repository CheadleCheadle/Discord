import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ChatRoom from "../DirectMessages/roomChat.js";
import { socket } from "../DirectMessages/roomChat.js";
import { getOnlineUsersThunk } from "../../store/session.js";
export default function FriendDisplay() {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  let { friendId } = params;
  friendId = parseInt(friendId);
  const friends = useSelector(state => state.session.user.friends)
  const onlineUsers = Object.values(useSelector(state => state.session.onlineUsers));
  console.log("here are the online users", onlineUsers);
  useEffect(() => {
    // dispatch(getOnlineUsersThunk())
    // socket.on('online_users', (data) => {
    //   dispatch(getOnlineUsersThunk(data.users))
    // })

    // return () => {
    //   socket.off('online_users');
    // }
  }, [])

  let friend = friends[ friendId ];
  useEffect(() => {
    friend = friends[ friendId ]
  }, [ friendId ])

  const user = useSelector(state => state.session.user)
  return (
    <>
    <ChatRoom  friend={friend} user={user}/>
    {/* <div>
      {onlineUsers.map((user, index) => (
        <div key={index}>{user.name}</div>
      ))}
    </div> */}
    </>
  )
}
