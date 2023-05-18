import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import { addUserStatus, authenticate, removeUserStatus } from "./store/session";
import AddServerForm from "./components/AddServerForm";
import MyServersPage from "./components/ServerDetails/MyServersPage";
import { thunkLoadAllServers } from "./store/servers";
import SplashPage from "./components/SplashPage";
import AllServersPage from "./components/ServerDetails/allServers";
import Friends from "./components/Friends";
import FriendDisplay from "./components/FriendDisplay";
import { socket } from "./components/DirectMessages/roomChat";
import EditChannel from "./components/ServerDetails/editChannel";


function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const [ isLoaded, setIsLoaded ] = useState(false);
  useEffect(() => {
    dispatch(thunkLoadAllServers())
      .then(() => dispatch(authenticate()))
      .then(() => setIsLoaded(true));

    socket.on('joined', (data) => {
      dispatch(authenticate());
    })
    socket.on('status_update', ({ user, active }) => {
      //dispatch actions to remove or
      if (active) {
        dispatch(addUserStatus(user));
      } else {
        dispatch(removeUserStatus(user));
      }
      console.log(`User ${user.id} is ${active ? 'active' : 'inactive'}`);
    })

  }, [ dispatch, isLoaded ]);

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <SplashPage isLoaded={isLoaded} />
          </Route>
          {!!sessionUser && (
            <Route exact path="/servers" component={MyServersPage} />
          )}
          {!!sessionUser && (
              <Route path='/servers/:serverId/channels/:channelId/edit' component={EditChannel} />
          )}
          {!!sessionUser && (
            <Route path='/servers/:serverId/channels/:channelId' component={MyServersPage} />
          )}
          {!!sessionUser && (
            <Route exact path="/servers/new" component={AddServerForm} />
          )}
          {!!sessionUser && (
            <Route path="/servers/:serverId" component={MyServersPage} />
          )}
          {!!sessionUser && (
            <Route exact path="/friends/:friendId" component={MyServersPage} />
          )}
          <Route>
            "404: Not Found"
          </Route>
        </Switch >
      )}
    </>
  );
}

export default App;
