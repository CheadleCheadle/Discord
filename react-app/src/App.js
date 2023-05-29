import React, { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import { addUserStatus, authenticate, removeUserStatus } from "./store/session";
import AddServerForm from "./components/AddServerForm";
import MyServersPage from "./components/ServerDetails/MyServersPage";
import { thunkLoadAllServers } from "./store/servers";
// import SplashPage from "./components/SplashPage";
import AllServersPage from "./components/ServerDetails/allServers";
import Friends from "./components/Friends";
import FriendDisplay from "./components/FriendDisplay";
import { socket } from "./components/DirectMessages/roomChat";
import EditChannel from "./components/ServerDetails/editChannel";
import EditServer from "./components/ServerDetails/editServer";
import Loading from "./components/loading";


function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const [ isLoaded, setIsLoaded ] = useState(false);

  const SplashPage = lazy(() => import('./components/SplashPage'));
  // const MyServersPage = lazy(() => import('./components/ServerDetails/MyServersPage'));
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
    })

  }, [ dispatch, isLoaded ]);

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <Suspense fallback={<Loading />}>
            <SplashPage isLoaded={isLoaded} />
            </Suspense>
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
            <Route path='/servers/:serverId/edit' component={EditServer} />
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
