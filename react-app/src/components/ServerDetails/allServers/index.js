import React from "react";
import AllServersNavbar from "../AllServersNavbar";
import { useSelector } from "react-redux";
import "./AllServers.css";
import { useModal } from "../../../context/Modal";
import JoinServer from "../joinServer.js";
//Import join server form here so onclick calls the open modal with it...
import "./main.css"
const AllServersPage = () => {
  const servers = Object.values(useSelector(state => state.servers.allServers));
  // const userServers = useSelector(state => state.session.user.servers)
  const currentServers = useSelector(state => state.session.user.servers);
  console.log('CURRENT', currentServers);
  // for (let i = 0; i < currentServers.length; i++) {
  //   const myServer = currentServers[i];
  //   const server = servers[i]

  //   if (server.id === server.id) {
  //     delete servers[i];
  //   }

  // }
  // console.log('after', servers);
  const { setModalContent, setOnModalClose } = useModal();
  const handleClick = (server) => {
    //open modal to join new server will be pending
    setModalContent(<JoinServer server={server} />)

  }
  return (
    <>
      <AllServersNavbar />
      <div className="svr-all-servers-container">
        {servers.map((server) => (
          <div className="svr-all-servers-info" key={server.id} onClick={() => handleClick(server)}>
            <div className="all-svr-image-cont">
              <img src={server.icon_url}></img>
            </div>

              <div id="desc-members">
            <span id="server-description">{server.description}</span>
            <div id="join-desc" >
            <span>
              <p>{server.users.length} Members</p>
            </span>
            </div>
            <div id ="button-container">
              <button onClick={() => handleClick(server)}>Join!</button>
              </div>
              </div>

          </div>

        ))}
      </div>
    </>
  )
}

export default AllServersPage
