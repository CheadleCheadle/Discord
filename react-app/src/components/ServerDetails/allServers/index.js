import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Button";
import { getMembershipsThunk, newMembershipThunk } from "../../../store/session";
import { useRef } from "react";
import "./AllServers.css";
import "./main.css"
import { joinServerThunk } from "../../../store/session";
import { thunkAddAServer } from "../../../store/servers";
import { normalizeFn } from "../../../store/channels";
const AllServersPage = () => {
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch()
  const servers = Object.values(useSelector(state => state.servers.allServers));
  // const memberships = Object.values(useSelector(state => state.session.memberships))
  // .filter(membership => membership.user_id === user.id);
  const memberships = useSelector(state => state.session.memberships);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const serverElement = useRef();
  const joinServer = (server) => {
    dispatch(joinServerThunk(server));
  };

  const RenderStatusButton = ({server}) => {
    const membershipsArray = Object.values(memberships);
    console.log("my memberships", membershipsArray);
    // for (let membership of Object.values(memberships)) {

    //   console.log("current membership", membership)
    //   if (membership.server_id === server.id && membership.user_id === user.id) {
    //     return (
    //       <span>{membership.status}</span>
    //     )
    //   } else {
    //     return (
    //       <Button
    //       buttonSize={'btn--demo'}
    //       onClick={() => joinServer(server)}
    //       >
    //         Click me
    //       </Button>
    //     )
    //   }
    // }
    for (let i = 0; i < membershipsArray.length; i++) {
      const membership = membershipsArray[i];
      console.log(membership);
      if (membership.server_id === server.id && membership.user_id === user.id) {
         return (
          <span>{membership.status}</span>
        )
      }
    }
    return (
      <Button
      buttonSize={'btn--demo'}
      onClick={() => joinServer(server)}
      >
        Join
      </Button>
    )
  }

  useEffect(() => {
    dispatch(getMembershipsThunk())
      .then(() => setIsLoaded(true));
  }, [ dispatch ]);

  return (
    <>
      {isLoaded && (
        <div className="svr-all-servers-container">
          {servers.map((server) => (
            <div className="svr-all-servers-info" key={server.id} data-id={server.id} ref={serverElement}>
              <div className="all-svr-image-cont">
                <img src={server.icon_url}></img>
              </div>
              <div id="desc-members">
                <span id="server-description">{server.description}</span>
                <div id="join-desc" >
                  <p>🟢{server.users.length} Members</p>
                  <div id="button-container">
                  <RenderStatusButton server={server}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AllServersPage
