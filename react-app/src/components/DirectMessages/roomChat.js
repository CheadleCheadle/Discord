import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./chat.css"
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessagesThunk, sendMessage } from '../../store/directmessages';

export const socket = io.connect('http://localhost:5001');

function ChatRoom({ friend, user }) {
    const dispatch = useDispatch();

    const [ roomName, setRoomName ] = useState("");
    const [ messageText, setMessageText ] = useState("");
    const [ isLoaded, setIsLoaded ] = useState(false);
    const [ inputDisableBool, setInputDisableBool ] = useState(true);

    const friendname = friend.username;
    const username = user.username;
    const messagesObject = useSelector(state => state.messages);
    const messages = Object.values(messagesObject.messages);

    useEffect(() => {
        if (!messageText) setInputDisableBool(true);
        else setInputDisableBool(false);
    }, [ messageText ])

    const charCode = (username, friendname) => {
        let sum = 0;
        let unique = username.concat(friendname)
        for (let i = 0; i < unique.length; i++) { sum += unique.charCodeAt(i) }
        return sum;
    }

    useEffect(() => {
        dispatch(fetchMessagesThunk(friend.id))
            .then(() => setIsLoaded(true))
        // Join the chat room when the component mounts

        // Generates a unique roomname out of the current user's name and friend's name.
        const charCode2 = charCode(username, friendname)
        setRoomName(charCode2);
        socket.emit("join", { username, friendname, charCode2 });

        // Handle incoming messages
        socket.on("new_message", (data) => {
            // Upon recieving a message a dispatch is made to update the store.
            dispatch(sendMessage(data));
        });

        // Leave the chat room when the component unmounts
        return () => {

            const charCode2 = charCode(username, friendname)
            socket.emit("leave", { charCode2 });
        };
    }, [ friendname ]);

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        const charCode2 = charCode(username, friendname)
        socket.emit("message", { userId: user.id, friendId: friend.id, username, friendname, message: messageText, charCode2 })
        setMessageText("");
    };

    const handleInputChange = (event) => {
        setMessageText(event.target.value);
    };

    return (
        <div className='chatroom'>
            {isLoaded && (
                <div className='column full'>
                    <div className='top-nav'>
                        <i class="fa-solid fa-user"></i>
                        <div className='message-roomname'>
                            {friendname[ 0 ].toUpperCase() + friendname.slice(1)}
                        </div>
                    </div>
                    <div className="chat-wrapper">
                        <div className="chat-history">
                            <div id="chat-start-section">
                                <i class="fa-solid fa-user chat-messages-icon"></i>
                                <h1>
                                    {friendname[ 0 ].toUpperCase() + friendname.slice(1)}
                                </h1>
                                <p>
                                    This is the beginning of your chat with {friendname[ 0 ].toUpperCase() + friendname.slice(1)}
                                </p>
                            </div>
                            {messages.map((message) => (
                                <div id="message">
                                    <div id="pfp-cont">
                                        <i class="fa-solid fa-user" style={message.sender.username === username ? { background: "var(--primary-blurple)" } : { background: "orange" }}></i>
                                    </div>
                                    <div id="text-info">
                                        <div id="name">
                                            <div>{message.sender.username}</div>
                                            <div className='message-date'>{message.time_stamp.slice(0, 17)}</div>
                                        </div>
                                        <div className='message-content'>{message.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <form className='message-input-bar' onSubmit={handleMessageSubmit}>
                        <input id='message-input' type="text" value={messageText} onChange={handleInputChange} />
                        <button id="send-button" disabled={inputDisableBool} type="submit">Send</button>
                    </form>
                </div>
            )
            }
        </div >
    );
}

export default ChatRoom;
