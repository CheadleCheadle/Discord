import React, { useEffect, useState } from "react";
import AllServersNavbar from "./AllServersNavbar";
import { NavLink, Route, Switch } from "react-router-dom";
import AddServerForm from "../AddServerForm";
import Server from ".";
const MyServersPage = () => {

  return (
    <>
      <AllServersNavbar></AllServersNavbar>
    </>
  )
}

export default MyServersPage
