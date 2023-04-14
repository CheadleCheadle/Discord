import React from "react";
import { useSelector } from "react-redux";
import AllServersNavbar from "./AllServersNavbar";
import { Route, Switch } from "react-router-dom";
import SingleServerPage from "./SingleServerPage";
import Friends from "../Friends";
import ServerMenuBox from "../ServerMenuBox";
import Members from "./allMembers";
const MyServersPage = () => {
    const sessionUser = useSelector(state => state.session.user);
  const servers = useSelector(state => state.servers.allServers);

  return (
    <>
      <AllServersNavbar></AllServersNavbar>
      <div className="svr-channel-column">
        <div className="svr-menu-box">
          <ServerMenuBox servers={servers} user={sessionUser} />
        </div>
      <Friends></Friends>
    {/* <Members></Members> */}
      </div>
      <Switch>
        <Route path={'/servers/:serverId/'}>
          <SingleServerPage />
        </Route>

      </Switch>
    </>
  )
}

export default MyServersPage
