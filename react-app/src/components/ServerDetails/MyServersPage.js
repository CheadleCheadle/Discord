import React, { useEffect, useState } from "react";
import AllServersNavbar from "./AllServersNavbar";
import { Route, Switch, useLocation } from "react-router-dom";
import SingleServerPage from "./SingleServerPage";
import Friends from "../Friends";
import FriendDisplay from "../FriendDisplay";
import ServerMenuBox from "../ServerMenuBox";
import { useDispatch, useSelector } from "react-redux";
import { getMembershipsThunk } from "../../store/session";
import AllServersPage from "./allServers";
import { logout } from "../../store/session";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const MyServersPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const serversObj = useSelector(state => state.servers.allServers);
  const servers = Object.values(serversObj)
  const location = useLocation();
  const [showFriends, setShowFriends] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(getMembershipsThunk())
      .then(() => setIsLoaded(true))
  }, [dispatch])

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout(sessionUser))
      .then(() => history.push('/'));

  };

  useEffect(() => {
    if (location.pathname.slice(0, 8) === '/friends' || location.pathname === '/servers') setShowFriends(true)
    else setShowFriends(false)
  }, [location.pathname]);
  return (
    <>
      {isLoaded && (
        <>
          <AllServersNavbar></AllServersNavbar>
          <div className="friends-column">
            {showFriends && (
              <Friends></Friends>
            )}
            {showFriends && <div className="user-info">
              <span id="user-info-pfp">
                <img src={sessionUser.photo_url}></img>
              </span>

              <div>
                <span id="user-username">
                  <h4>{sessionUser.username}</h4>
                  <p>{sessionUser.username}#{sessionUser.code}</p>
                </span>
              </div>
                <p onClick={handleLogout}>Logout</p>
            </div>}
          </div>
          <Switch>
            <Route path={'/servers/:serverId'}>
              <SingleServerPage />

            </Route>
            <Route path={"/friends/:friendId"} component={FriendDisplay} />
            <Route exact path={"/servers"} component={AllServersPage} />
          </Switch>

        </>
      )}
    </>
  )
}

export default MyServersPage
