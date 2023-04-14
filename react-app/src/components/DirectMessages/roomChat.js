
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./chat.css"
import Friends from '../Friends';

const socket = io.connect('http://localhost:5001');

function ChatRoom({ username, friendname, friend, user }) {
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');


  useEffect(() => {
    // Join the chat room when the component mounts
    socket.emit('join', { username, friendname});
    setRoomName(`${username}_${friendname}`);

    // Handle incoming messages
    socket.on('message', (data) => {
        console.log('SENT BACK',data.message);
        //dispatch new message to db -> make a fetch request to get latest messages, sort by date
        //update messages with response

        setMessages((messages) => [...messages, data.message]);
        // setMessages((messages) => [...messages]);
        console.log('UPDATEED MESSAGTE',messages)
    });

     async function fetchData() {
    const current_messages = await fetch(`/api/users/curr/messages/recipient/${friend.id}`,{
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify({userId: user.id})
    });
    // const current_messages2 = await fetch(`/api/users/curr/messages/recipient/${user.id}`);
    if (current_messages.ok) {
    const data = await current_messages.json();
    // const data2 = await current_messages2.json();
        console.log("here are the current messages:", data );
         setMessages(data);

    }
    }
      fetchData()



    // Leave the chat room when the component unmounts
    return () => {
      socket.emit('leave', { username, friendname });
    };
  }, []);

  const handleMessageSubmit = async (event) => {
    event.preventDefault();


    const newMessage = {content: messageText, userId: user.id}
    const response = await fetch(`/api/users/messages/new/${friend.id}`, {
      method: "POST",
      headers: {'Content-Type': 'Application/json'},
      body: JSON.stringify(newMessage)

    });

    if (response.ok) {
      const data = await response.json();
      console.log('NEW MESSAGE',data)


        socket.emit('message', { username, friendname, message:data });
        setMessageText('');
    }
   };

  const handleInputChange = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <>
    <Friends></Friends>
    <div className="chat-wrapper">
      <h1>Chat Room: {roomName}</h1>
      <div className="chat-history">
        {messages.map((message, index) => (
          <div id="message" key={index}>
            <div id="pfp-cont">
            <img src={message.sender.photo_url}></img>
            </div>
            <div id="text-info">
              <div id="name">
            <p>{message.sender.username}</p>
            <p>{message.time_stamp.slice(0,17)}</p>
            </div>
            <h3>{message.content}</h3>
            </div>
            </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input type="text" value={messageText} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
    </>
  );
}

export default ChatRoom;
