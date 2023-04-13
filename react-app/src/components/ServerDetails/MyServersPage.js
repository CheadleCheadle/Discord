import React, { useEffect, useState } from "react";
import AllServersNavbar from "./AllServersNavbar";
import { NavLink, Route, Switch } from "react-router-dom";
import AddServerForm from "../AddServerForm";
import Server from ".";
import SingleServerPage from "./SingleServerPage";
import Channel from "../ChannelDetails";
const MyServersPage = (myServers) => {

  return (
    <>
      <AllServersNavbar></AllServersNavbar>
      <Switch>
        <Route path={'/servers/:serverId/'}>
          <SingleServerPage />
        </Route>
      </Switch>
    </>
  )
}

export default MyServersPage
