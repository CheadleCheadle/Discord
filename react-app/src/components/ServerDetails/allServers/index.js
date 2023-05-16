import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Button";
import { getMembershipsThunk, newMembershipThunk } from "../../../store/session";
import { useRef } from "react";
import "./AllServers.css";
import "./main.css"
import { joinServerThunk } from "../../../store/session";
import { thunkAddAServer } from "../../../store/servers";

const AllServersPage = () => {
  const dispatch = useDispatch()
  const servers = Object.values(useSelector(state => state.servers.allServers));
  const memberships = useSelector(state => state.session.memberships);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const serverElement = useRef();
  const joinServer = (server) => {
			// window.location.reload()
     dispatch(joinServerThunk(server));
  };

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
                    <Button
                      buttonSize={'btn--demo'}
                      disableButton={memberships[ server.id ] ? true : false}
                      onClick={memberships[ server.id ] ? null : () => joinServer(server)}
                    >
                      {memberships[ server.id ] ? memberships[ server.id ].status : 'Join Server'}
                    </Button>
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
