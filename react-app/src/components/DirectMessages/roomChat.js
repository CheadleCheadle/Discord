// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// function ChatRoom({friend, user}) {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io.connect('http://localhost:5001');
//     setSocket(newSocket);

//     newSocket.on('chat', () => {
//       newSocket.emit('connect', {userId: user.id, other_user_id: friend.id });
//     });

//     newSocket.on('direct_message', (data) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//       console.log('Current messages between friends:',messages)
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [user]);

//   const handleSend = (e) => {
//     e.preventDefault();
//     socket.emit('direct_message', {
//       content: message,
//       room: `${user.id}-${friend.id}`,
//     });
//     //dispatch thunk to populate db with new message
//     //   setMessages([...messages, message])
//     //   console.log('all messages', messages)
//     setMessage('');
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((message) => (
//           <p key={message.id}>{message.content}</p>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={handleSend}>Send</button>
//     </div>
//   );
// }

// export default ChatRoom;


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5001');

function ChatRoom({ username, friendname }) {
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  console.log("username", username, "friendname", friendname)

  useEffect(() => {
    // Join the chat room when the component mounts
    socket.emit('join', { username, friendname });
    setRoomName(`${username}_${friendname}`);

    // Handle incoming messages
    socket.on('message', (data) => {
        console.log(data.message);
        console.log(messages)
        setMessages((messages) => [...messages, data.message]);
    });

    // Leave the chat room when the component unmounts
    return () => {
      socket.emit('leave', { username, friendname });
    };
  }, []);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    // const newMessage = { message: messageText };
    socket.emit('message', { username, friendname, message: messageText });
    // setMessages( [...messages, newMessage]);
    setMessageText('');
  };

  const handleInputChange = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <div>
      <h1>Chat Room: {roomName}</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
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
