import React from "react";
import AllServersNavbar from "./AllServersNavbar";
import { Route, Switch } from "react-router-dom";
import SingleServerPage from "./SingleServerPage";
import Friends from "../Friends";
const MyServersPage = () => {
  return (
    <>
      <AllServersNavbar></AllServersNavbar>
      <Friends></Friends>
      <Switch>
        <Route path={'/servers/:serverId/'}>
          <SingleServerPage />
        </Route>

      </Switch>
    </>
  )
}

export default MyServersPage
