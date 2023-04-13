import React from "react";
import AllServersNavbar from "./AllServersNavbar";
import { useSelector } from "react-redux";
import "./AllServers.css";
import { useModal } from "../../context/Modal";
import JoinServer from "./joinServer.js";
//Import join server form here so onclick calls the open modal with it...

const AllServersPage = () => {
    const servers = Object.values(useSelector(state => state.servers.allServers));
  const { setModalContent, setOnModalClose } = useModal();
    const handleClick = (server) => {
    //open modal to join new server will be pending
    setModalContent(<JoinServer server={server}/> )

    }
  return (
    <>
      <AllServersNavbar />

      <div className="svr-all-servers-container">
      {servers.map((server) => (
        <div className="svr-all-servers-info" key={server.id} onClick={() => handleClick(server)}>
            <h3>{server.name}</h3>
            <img src={server.icon_url}/>
          </div>
      ))}
      </div>
    </>
  )
}

export default AllServersPage
