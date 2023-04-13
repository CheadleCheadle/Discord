
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io.connect('http://localhost:5000');

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
        console.log(data.message);
        console.log(messages)
        //dispatch new message to db -> make a fetch request to get latest messages, sort by date
        //update messages with response

        setMessages((messages) => [...messages, {content:data.message}]);
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
    socket.emit('message', { username, friendname, message: messageText });
    setMessageText('');

    const newMessage = {content: messageText, userId: user.id}
    const response = await fetch(`/api/users/messages/new/${friend.id}`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(newMessage)

    });

    if (response.ok) {
        const data = await response.json();
        console.log(data)
    }

   };

  const handleInputChange = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <div>
      <h1>Chat Room: {roomName}</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message.content}</div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input type="text" value={messageText} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
