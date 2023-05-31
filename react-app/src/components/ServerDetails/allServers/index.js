import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Button";
import { getMembershipsThunk, updateMembership, newMembership } from "../../../store/session";
import { useRef } from "react";
import "./AllServers.css";
import "./main.css"
import { joinServerThunk } from "../../../store/session";
import { socket } from "../../DirectMessages/roomChat";
import { getMembersThunk } from "../../../store/members";
import { thunkLoadAllServers } from "../../../store/servers";
import Loading from "../../loading";
const AllServersPage = () => {
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch()
  const servers = Object.values(useSelector(state => state.servers.allServers));

  const memberships = useSelector(state => state.session.memberships);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const serverElement = useRef();
  const joinServer = (server) => {
    const roomName = String(server.id);
    socket.emit('join_server_room', {roomName, user});
    socket.emit('join_server', {serverId: server.id, userId: user.id, roomName});

  };



  useEffect(() => {
     socket.on('joined', (data) => {
       dispatch(updateMembership(data));
     });
      socket.on('join_message', (data) => {
        })

      socket.on('new_member', (data) => {
        dispatch(newMembership(data.membership));
      })
  }, [])

  const RenderStatusButton = ({server}) => {
    const membershipsArray = Object.values(memberships);
    for (let i = 0; i < membershipsArray.length; i++) {
      const membership = membershipsArray[i];
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

  if (!isLoaded) {
    return (
      <Loading />
    )
  }
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
                  <div id="server-members-count">
                  <div id="server-dot">
                  </div>
                  <p>{server.users.length === 1 ? `${server.users.length} Member` : `${server.users.length} Members`}</p>
                  </div>
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
