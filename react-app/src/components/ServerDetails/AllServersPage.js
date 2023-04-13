import React from "react";
import AllServersNavbar from "./AllServersNavbar";
import { useSelector } from "react-redux";

const AllServersPage = () => {
    const servers = Object.values(useSelector(state => state.servers.allServers));
    console.log("here are the servers",servers)
    const handleClick = (server) => {
    //open modal to join new server will be pending
    }
  return (
    <>
      <AllServersNavbar />

      {servers.map((server) => {
        <div key={server.id}>{server.name}</div>
      })}
    </>
  )
}

export default AllServersPage
