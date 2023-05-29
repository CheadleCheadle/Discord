# Discord

Create Servers, Channels, Direct Messages and more! Built using Python and React.js.
## Contributors
* https://github.com/usr1l
* https://github.com/ChunyiKoo
* https://github.com/CheadleCheadle
[Discord!][live]

[Features | Redux Store][wiki-features]

[API Routes][wiki-routes]

[Database Schema][wiki-db-schema]

[live]: https://discord-wa36.onrender.com
[wiki-routes]:https://github.com/CheadleCheadle/Discord/wiki/API-Routes
[wiki-features]:https://github.com/CheadleCheadle/Discord/wiki/Redux-Store-Shape-&-Feature-List
[wiki-db-schema]:https://github.com/CheadleCheadle/Discord/wiki/Database-Design

## Main Features

This clone aims to hit all the core functionality of Discord including real time communication with web-sockets, servers, channels and more!

## WebSocket Implementation
```
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
      setMessages((messages) => [ ...messages, data.message ]);
    });

    // Leave the chat room when the component unmounts
    return () => {

      const charCode2 = charCode(username, friendname)
      socket.emit("leave", { username, friendname, charCode2 });
    };
  }, [ friendname ]);
end
```
(full websocket implementation can be found in /components/DirectMessages)

## Technologies Used

-  React.js
-  Redux for state management
-  Uses RESTful convention
-  Flask
-  SQLAlchemy
-  WTforms
-  PostgreSQL
-  SocketIO

## To-do
 * Implement create and delete for friendships
 * Implement search for servers and users
 * Implement server roles
 
 ## To launch the application locally:
 * Clone the repository
 * Open the root folder and type "pipenv install" to install dependencies
 * Open the frontend folder called 'react-app' and type "npm install"
 * In the root folder, type "pipenv run flask run" to start the flask server on localhost:5000
 * Inside the 'react-app' folder type "npm start" to start the react frontend server on localhost:3000
 * The application should now be running!
## Screenshot
![new](https://user-images.githubusercontent.com/108553712/232428796-732b1da7-079c-4595-8e2c-e3b27355d90c.PNG)![discord](https://github.com/CheadleCheadle/Discord/assets/108553712/ec392f80-6471-4698-a0a3-b4d353e40d82)
![server](https://github.com/CheadleCheadle/Discord/assets/108553712/9605b29f-d0cc-471b-9056-32ae05f0617c)

If you wish to stop using the application, you can close it by hitting ctrl + c inside of both the root and frontend folders.
