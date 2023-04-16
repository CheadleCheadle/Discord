import React, { useEffect, useState } from "react";
import AllServersNavbar from "../AllServersNavbar";
import { useDispatch, useSelector } from "react-redux";
import "./AllServers.css";
import { useModal } from "../../../context/Modal";
import JoinServer from "../joinServer.js";

//Import join server form here so onclick calls the open modal with it...
import "./main.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getMembershipsThunk, newMembershipThunk } from "../../../store/session";
import ServerForm from "../../ServerForm";
const AllServersPage = () => {
  const dispatch = useDispatch()
  const [ isLoaded, setIsLoaded ] = useState(false);
  const servers = Object.values(useSelector(state => state.servers.allServers));
  const myServers = useSelector(state => state.session.user.servers);
  const memberships = useSelector(state => state.session.memberships);
  const { setModalContent, setOnModalClose } = useModal();
  const history = useHistory();
  const handleJoinedServers = (server) => {
    for (let x in myServers) {
      if (server.id === +x) return true
    }
    return false;
  }

  const renderConditionally = (server) => {
    console.log("My Memberships",memberships);
    console.log("My servers:", myServers)
    console.log(server.id);
    if (memberships[server.id]) {

      console.log("WORKs", memberships[server.id])
      if (memberships[server.id].status !== "Pending") {
      return (
      <button onClick={() => handleGoToServer(server.id)}>Go to server!</button>
      )
      } else {
        return (
          <p>Pending...</p>
          )
        }
      } else {
        return (
        <button onClick={() => handleClick(server)}>Join!</button>
      )
    }
  }
  // renderConditionally();
  const handleGoToServer = (serverId) => {
    setModalContent(null);
    history.push(`/servers/${serverId}`);
  }
  const handleClick = (server) => {
    //open modal to join new server will be pending
    setModalContent(<JoinServer server={server} />)

  }

  useEffect(() => {
    dispatch(getMembershipsThunk());
  },[])

  return (
    <>
      {/* <AllServersNavbar /> */}
      <div className="svr-all-servers-container">
        {servers.map((server) => (
          <div className="svr-all-servers-info" key={server.id}>
            <div className="all-svr-image-cont">
              <img src={server.icon_url}></img>
            </div>

            <div id="desc-members">
              <span id="server-description">{server.description}</span>
              <div id="join-desc" >

                <p>🟢{server.users.length} Members</p>

                <div id="button-container">
                  {renderConditionally(server)}
                </div>
              </div>
            </div>

          </div>

        ))}
      </div>
    </>
  )
}

export default AllServersPage
