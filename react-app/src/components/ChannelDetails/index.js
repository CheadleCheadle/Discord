import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkUpdateSingleChannelId } from "../../store/channels.js";
import  { socket } from "../DirectMessages/roomChat.js";
import "./channel.css";
import { fetchChannelMessagesThunk, sendChannelMessage} from "../../store/channelmessages.js";
export default function Channel() {
 const dispatch = useDispatch();
 const { serverId, channelId } = useParams();
 const user = useSelector(state => state.session.user);
 const [isLoaded, setIsLoaded] = useState(false);
 const [message, setMessage] = useState("");
 const channel = useSelector((state) => state.channels.allChannels[channelId]);
 const channelMessagesObj = (useSelector(state => state.channelMessages));
 const channelMessages = Object.values(channelMessagesObj.messages)

 useEffect(() => {
  dispatch(thunkUpdateSingleChannelId(channelId))
  dispatch(fetchChannelMessagesThunk(channelId))
  .then(() => {
    setIsLoaded(true);
  })

  socket.emit("channel_join", {channelName: channel.name});

  //Handle incoming messages
  socket.on("new_channel_message", (data) => {
    console.log("New channel message", data);
    dispatch(sendChannelMessage(data));
  })
  // Leave the channel when component unmounts
  return () => {
    const charCode2 = channel.name;
    socket.emit("leave", {charCode2})
  }
 }, [dispatch, channelId]);




 const handleSubmit = (e) => {
  e.preventDefault();
  socket.emit("channel_message", {channel, message, userId:user.id});
  setMessage("")
 };

 return (
  <>
   {isLoaded && (
    <>
     <div className="chnl-messages-cont">
         {!channelMessages.length ? <h1>Be the first to send a message!</h1> : null}
      {channelMessages.map((message) => (
          <div id="all-msgs" key={message.id}>
        {message.content}
        <p>{message.time_stamp}</p>
       </div>
      ))}

      </div>
      <div className="chnl-form-cont">
       <form id="submit-form" onSubmit={handleSubmit}>
        <input id="enter-field"
         type="text"
         placeholder={`Message`}
         value={message}
         onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="Submit" />
       </form>
     </div>
    </>
   )}
  </>
 );
}
