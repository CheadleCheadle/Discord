import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkUpdateSingleChannelId } from "../../store/channels.js";
import { socket } from "../DirectMessages/roomChat.js";
import "./channel.css";
import { fetchChannelMessagesThunk, sendChannelMessage } from "../../store/channelmessages.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import Members from "../ServerDetails/allMembers/index.js";
export default function Channel() {
  const dispatch = useDispatch();
  //  let { serverId, channelId } = useParams();
  const channelId = useSelector(state => state.channels.singleChannelId);
  console.log("THIS IS THE CHANNELID", channelId, typeof channelId)

  const user = useSelector(state => state.session.user);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ message, setMessage ] = useState("");
  const [ inputDisableBool, setInputDisableBool ] = useState(true);
  const channel = useSelector((state) => state.channels.allChannels[ channelId ]);
  const channelMessagesObj = (useSelector(state => state.channelMessages));
  const channelMessages = Object.values(channelMessagesObj.messages)
  console.log("CHANNLE MESSAGES", channelMessages);
  const messageContainer = useRef(null);

  useEffect(() => {
    if (!message) setInputDisableBool(true);
    else setInputDisableBool(false);
  }, [ message ])


  useEffect(() => {
    //Handle Scroll Position
    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }
  })
  useEffect(() => {
    dispatch(fetchChannelMessagesThunk(channelId))
      .then(() => {
        setIsLoaded(true);
      })

    if (channel) {

      socket.emit("channel_join", { channelName: channel.name });
      //Handle incoming messages
      socket.on("new_channel_message", (data) => {
        const dateConversion = new Date(data.time_stamp)
        const options = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};
        data.time_stamp = dateConversion.toLocaleDateString(undefined, options);
        console.log("THIS DADWADWA", data.time_stamp);
        dispatch(sendChannelMessage(data));
      })
      // Leave the channel when component unmounts
      return () => {
        const charCode2 = channel.name;
        socket.emit("leave", { charCode2 })
      }
    }
  }, [ dispatch, channelId, channel ]);



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("This is the message!", message);
    // message.time_stamp = message.time_stamp.toString();
    socket.emit("channel_message", { channel, message, userId: user.id });
    setMessage("")
  };

  const handleMessageDate = (strDate) => {
    const localDate = new Date(strDate)
    const today = new Date();
    const date = new Date(localDate);
    let  hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      const stringMinutes = "0" + String(minutes)
      minutes = stringMinutes;
    }
    let period = '';
    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        hours -= 12;
      }
    } else {
      period = 'AM';
      if (hours === 0) {
        hours = 12;
      }
    }
    if (date.getDate() === today.getDate()
      && date.getMonth() === today.getMonth()
      && date.getFullYear() === today.getFullYear()
    ) {
      return `Today at ${hours}:${minutes} ${period}`
    } else {
      return date;
    }
  }

  return (
    <div className='chatroom'>
      {isLoaded && (
        <>
          <div className='top-nav'>
            <FontAwesomeIcon icon={faHashtag} className="fa-lg" />
            <div className='message-roomname'>
              {channel?.name}
            </div>
          </div>
          <div className="row full">
            <div className='column channel-full '>
              <div
              ref={messageContainer}
              className="chat-wrapper">
                <div
                  className="chat-history">
                  <div id="chat-start-section">
                    <FontAwesomeIcon icon={faHashtag} className="fa-lg chat-messages-icon" />
                    <h1>
                      {channel?.name}
                    </h1>
                    <p>
                      This is the start of the {channel?.name} channel
                    </p>
                  </div>
                  {!channelMessages.length ? <h1>Be the first to send a message!</h1> : null}
                  {channelMessages.map((message) => (
                    <div id="message" key={message.id}>
                      <div id="pfp-cont">
                        <img src={message.sender.photo_url}></img>
                      </div>
                      <div id="text-info">
                        <div id="name">
                          {/* <div>{console.log(message), "MESSAGE"}</div> */}
                          <div className='message-date'>{handleMessageDate(message.time_stamp)}</div>
                        </div>
                        <div className='message-content'>{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form className='message-input-bar' onSubmit={handleSubmit}>
                <input id='message-input'
                  type="text"
                  placeholder={`Message`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button disabled={inputDisableBool} id="send-button" type="submit" value="Submit" >Send</button>
              </form>
            </div>
            <Members isLoaded={isLoaded}></Members>
          </div>
        </>
      )}
    </div>
  );
}
