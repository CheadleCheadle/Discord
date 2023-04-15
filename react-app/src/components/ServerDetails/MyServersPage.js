import React, { useEffect, useState } from "react";
import AllServersNavbar from "./AllServersNavbar";
import { Route, Switch, useLocation } from "react-router-dom";
import SingleServerPage from "./SingleServerPage";
import Friends from "../Friends";
import FriendDisplay from "../FriendDisplay";
import ServerMenuBox from "../ServerMenuBox";
import { useSelector } from "react-redux";

const MyServersPage = () => {
  const sessionUser = useSelector(state => state.session.user);
  const serversObj = useSelector(state => state.servers.allServers);
  const servers = Object.values(serversObj)
  const location = useLocation();
  const [ showFriends, setShowFriends] = useState(false)

  useEffect(() => {
    if (location.pathname.slice(0, 8) === '/friends' || location.pathname === '/servers') setShowFriends(true)
    else setShowFriends(false)
  }, [ location.pathname ]);
  return (
    <>
      <AllServersNavbar></AllServersNavbar>
      <div>

        {showFriends&& (
          <>

        <Friends></Friends>
        </>
        )}
      </div>
      <Switch>
        <Route path={'/servers/:serverId'}>
          <SingleServerPage />
        </Route>
        <Route path={"/friends/:friendId"} component={FriendDisplay} />
      </Switch>
    </>
  )
}

export default MyServersPage
