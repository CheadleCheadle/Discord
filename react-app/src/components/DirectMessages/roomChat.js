import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./chat.css"
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessagesThunk, sendMessage} from '../../store/directmessages';

export const socket = io.connect('http://localhost:5001');

function ChatRoom({friend, user }) {
    const dispatch = useDispatch();

    const [roomName, setRoomName] = useState("");
    const [messageText, setMessageText] = useState("");
    const [isLoaded, setIsLoaded] = useState(false)
    const friendname = friend.username;
    const username = user.username;
    const messagesObject = useSelector(state => state.messages);
    const messages = Object.values(messagesObject.messages);


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
        socket.emit("join", { username, friendname, charCode2});

        // Handle incoming messages
        socket.on("new_message", (data) => {
            // Upon recieving a message a dispatch is made to update the store.
            dispatch(sendMessage(data));
        });

        // Leave the chat room when the component unmounts
        return () => {

            const charCode2 = charCode(username, friendname)
            socket.emit("leave", {charCode2 });
        };
    }, [friendname]);

    const handleMessageSubmit = (event) => {
        event.preventDefault();
        const charCode2 = charCode(username, friendname)
        socket.emit("message", { userId: user.id, friendId: friend.id, username, friendname, message: messageText, charCode2})
        setMessageText("");
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
