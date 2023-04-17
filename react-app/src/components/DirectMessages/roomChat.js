// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import "./chat.css"
// import Friends from '../Friends';
// import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
// import { useDispatch } from 'react-redux';

// const socket = io.connect('http://localhost:5001');

// function ChatRoom({ username, friendname, friend, user }) {
//   const [ roomName, setRoomName ] = useState("");
//   const [ messages, setMessages ] = useState([]);
//   const [ messageText, setMessageText ] = useState("");
//   const [ isLoaded, setIsLoaded ] = useState(false)
//   const dispatch = useDispatch();
//   // const location = useLocation()
//   // async function fetchData() {
//   //   const current_messages = await fetch(
//   //     `/api/users/curr/messages/recipient/${friend.id}`,
//   //     {
//   //       method: "POST",
//   //       headers: { "Content-Type": "Application/json" },
//   //       body: JSON.stringify({ userId: user.id }),
//   //     }
//   //   );
//   //   if (current_messages.ok) {
//   //     const data = await current_messages.json();
//   //     setMessages(data);
//   //   }
//   // }

//   const fetchMessagesThunk = (userId) => async (dispatch) => {
//     const current_messages2 = await fetch(`/api/users/curr/messages/recipient/${userId}`);
//     const res = await current_messages2.json()
//     return res
//   }

//   const sendMessagesThunk = () => async (dispatch) => {
//     const newMessage = { content: messageText, userId: user.id };
//     const response = await fetch(`/api/users/messages/new/${friend.id}`, {
//       method: "POST",
//       headers: { "Content-Type": "Application/json" },
//       body: JSON.stringify(newMessage),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       const charCode2 = charCode(username, friendname)
//       console.log("STEP ONE 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", data)
//       socket.emit("message", { username, friendname, message: data, charCode2 });
//       setMessageText("");
//     }
//   }

//   const charCode = (username, friendname) => {
//     let sum = 0;
//     let unique = username.concat(friendname)
//     for (let i = 0; i < unique.length; i++) { sum += unique.charCodeAt(i) }
//     return sum;
//   }

//   useEffect(() => {
//     dispatch(fetchMessagesThunk(friend.id))
//       .then((res) => setMessages(res))
//       .then(() => setIsLoaded(true))
//     // Join the chat room when the component mounts
//     const charCode2 = charCode(username, friendname)
//     setRoomName(charCode2);
//     socket.emit("join", { username, friendname, charCode2 });

//     // Handle incoming messages
//     socket.on("new_message", (data) => {
//       console.log("THIS IS STEP 3333333333333333333333333333333333333333333333333333333", data)
//       setMessages((messages) => [ ...messages, data.message ]);
//     });

//     // Leave the chat room when the component unmounts
//     return () => {

//       const charCode2 = charCode(username, friendname)
//       socket.emit("leave", { username, friendname, charCode2 });
//     };
//   }, [ friendname ]);

//   const handleMessageSubmit = (event) => {
//     event.preventDefault();
//     dispatch(sendMessagesThunk());
//   };

//   const handleInputChange = (event) => {
//     setMessageText(event.target.value);
//   };

//   return (
//     <>
//       {isLoaded && (
//         <div className="chat-wrapper">
//           <h1>Chat Room: {roomName}</h1>
//           <div className="chat-history">
//             {messages.map((message) => (
//               <div id="message">
//                 <div id="pfp-cont">
//                   <img src={message.sender.photo_url}></img>
//                 </div>
//                 <div id="text-info">
//                   <div id="name">
//                     <p>{message.sender.username}</p>
//                     <p>{message.time_stamp.slice(0, 17)}</p>
//                   </div>
//                   <h3>{message.content}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleMessageSubmit}>
//             <input type="text" value={messageText} onChange={handleInputChange} />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// }

// export default ChatRoom;
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./chat.css"
import Friends from '../Friends';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';

const socket = io.connect('http://localhost:5001');

function ChatRoom({ username, friendname, friend, user }) {
  const [ roomName, setRoomName ] = useState("");
  const [ messages, setMessages ] = useState([]);
  const [ messageText, setMessageText ] = useState("");
  const [ isLoaded, setIsLoaded ] = useState(false)
  const dispatch = useDispatch();
  // const location = useLocation()
  // async function fetchData() {
  //   const current_messages = await fetch(
  //     `/api/users/curr/messages/recipient/${friend.id}`,
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "Application/json" },
  //       body: JSON.stringify({ userId: user.id }),
  //     }
  //   );
  //   if (current_messages.ok) {
  //     const data = await current_messages.json();
  //     setMessages(data);
  //   }
  // }

  const fetchMessagesThunk = (userId) => async (dispatch) => {
    const current_messages2 = await fetch(`/api/users/curr/messages/recipient/${userId}`);
    const res = await current_messages2.json()
    return res
  }

  const sendMessagesThunk = () => async (dispatch) => {
    const newMessage = { content: messageText, userId: user.id };
    const response = await fetch(`/api/users/messages/new/${friend.id}`, {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(newMessage),
    });
    if (response.ok) {
      const data = await response.json();
      const charCode2 = charCode(username, friendname)
      console.log("STEP ONE 111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", data)
      socket.emit("message", { username, friendname, message: data, charCode2 });
      setMessageText("");
    }
  }

  const charCode = (username, friendname) => {
    let sum = 0;
    let unique = username.concat(friendname)
    for (let i = 0; i < unique.length; i++) { sum += unique.charCodeAt(i) }
    return sum;
  }

  useEffect(() => {
    dispatch(fetchMessagesThunk(friend.id))
      .then((res) => setMessages(res))
      .then(() => setIsLoaded(true))
    // Join the chat room when the component mounts
    const charCode2 = charCode(username, friendname)
    setRoomName(charCode2);
    socket.emit("join", { username, friendname, charCode2 });

    // Handle incoming messages
    socket.on("new_message", (data) => {
      console.log("THIS IS STEP 3333333333333333333333333333333333333333333333333333333", data)
      setMessages((messages) => [ ...messages, data.message ]);
    });

    // Leave the chat room when the component unmounts
    return () => {

      const charCode2 = charCode(username, friendname)
      socket.emit("leave", { username, friendname, charCode2 });
    };
  }, [ friendname ]);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    dispatch(sendMessagesThunk());
  };

  const handleInputChange = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <>
      {isLoaded && (
        <div className="chat-wrapper">
          <h1>Chat Room: {roomName}</h1>
          <div className="chat-history">
            {messages.map((message) => (
              <div id="message">
                <div id="pfp-cont">
                  <img src={message.sender.photo_url}></img>
                </div>
                <div id="text-info">
                  <div id="name">
                    <p>{message.sender.username}</p>
                    <p>{message.time_stamp.slice(0, 17)}</p>
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
      )}
    </>
  );
}

export default ChatRoom;
