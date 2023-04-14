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
  const [ serverMenuBoxBool, setServerMenuBoxBool ] = useState(false)

  useEffect(() => {
    if (location.pathname.slice(0, 8) === '/friends') setServerMenuBoxBool(false)
    else setServerMenuBoxBool(true)
  }, [ location ]);
  return (
    <>
      <AllServersNavbar></AllServersNavbar>
      <div>
        {serverMenuBoxBool && (
          <div className="svr-menu-box">
            <ServerMenuBox servers={servers} user={sessionUser} />
          </div>
        )}
        <Friends></Friends>
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
