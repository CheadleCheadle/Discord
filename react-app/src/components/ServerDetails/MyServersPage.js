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

const MyServersPage = () => {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user);
  const serversObj = useSelector(state => state.servers.allServers);
  const servers = Object.values(serversObj)
  const location = useLocation();
  const [ showFriends, setShowFriends ] = useState(false)
  const [ isLoaded, setIsLoaded ] = useState(false)

  useEffect(() => {
    dispatch(getMembershipsThunk())
      .then(() => setIsLoaded(true))
  }, [ dispatch ])

  useEffect(() => {
    if (location.pathname.slice(0, 8) === '/friends' || location.pathname === '/servers') setShowFriends(true)
    else setShowFriends(false)
  }, [ location.pathname ]);
  return (
    <>
      {isLoaded && (
        <>
          <AllServersNavbar></AllServersNavbar>
          <div className="friends-column">
            {showFriends && (
              <Friends></Friends>
            )}
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
