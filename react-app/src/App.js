import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AddServerForm from "./components/AddServerForm";
import AddChannelModal from "./components/AddChannelModal/index.js";
import MyServersPage from "./components/ServerDetails/MyServersPage";
import Server from "./components/ServerDetails/index";
import { thunkLoadAllServers } from "./store/servers";
import SplashPage from "./components/SplashPage.js";
import NavBarServerList from "./components/NavBarServerList";
import AllServersNavbar from "./components/ServerDetails/AllServersNavbar";
import AllServersPage from "./components/ServerDetails/AllServersPage";
import Friends from "./components/Friends";
import FriendDisplay from "./components/FriendDisplay";


function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const [ isLoaded, setIsLoaded ] = useState(false);
  useEffect(() => {
    dispatch(authenticate())
      .then(() => dispatch(thunkLoadAllServers()))
      .then(() => setIsLoaded(true));
  }, [ dispatch ]);

  const servers = useSelector(state => state.servers.allServers);
  const serversArr = servers ? Object.keys(servers) : [];
  // {!!sessionUser && (          )}
  // {!!sessionUser && (          )}
  // {!!sessionUser && (          )}

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
            <Route path={"/servers/all"} component={AllServersPage} />
          )}
          {!!sessionUser && (
            <Route exact path="/servers/new" component={AddServerForm} />
          )}
          {!!sessionUser && (
            <Route path="/servers/:serverId">
              <Server sessionUser={sessionUser} />
            </Route>
          )}
          {!!sessionUser && (
            <Route exact path="/friends">
              <Friends></Friends>
            </Route>
          )}
          {!!sessionUser && (
            <Route exact path="/friends/:friendId">
              <FriendDisplay></FriendDisplay>
            </Route>
          )}
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route >
            "404: Not Found"
          </Route>
        </Switch >
      )}
    </>
  );
}

export default App;
