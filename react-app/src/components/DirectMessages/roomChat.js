import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ChatRoom({friend, user}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:5001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('custom-connect', {userId: user.id, other_user_id: friend.id });
    });

    newSocket.on('direct_message', (data) => {
      //setMessages((prevMessages) => [...prevMessages, data]);
      //console.log('Current messages between friends:',messages)
    });

    return () => {
      newSocket.disconnect();
    };
  }, [friend]);

  const handleSend = () => {
    socket.emit('direct_message', {
      content: message,
      room: `${user.id}-${friend.id}`,
    });
    //dispatch thunk to populate db with new message
      setMessages((prevMessages) => [...prevMessages, message])
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <p key={message.id}>{message.content}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatRoom;
