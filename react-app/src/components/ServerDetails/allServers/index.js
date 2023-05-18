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
const AllServersPage = () => {
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch()
  const servers = Object.values(useSelector(state => state.servers.allServers));

  const memberships = useSelector(state => state.session.memberships);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const serverElement = useRef();
  const joinServer = (server) => {
    // dispatch(joinServerThunk(server));
    const roomName = String(server.id);
    console.log("THIS IS THE ROOM NAME", roomName);
    socket.emit('join_server_room', {roomName, user});
    socket.emit('join_server', {serverId: server.id, userId: user.id, roomName});
    //May need to change so it updates the status of that membership or whatever...

    // dispatch(getMembershipsThunk());
  };



  useEffect(() => {
     socket.on('joined', (data) => {
       console.log("I was accepted just now!", data);
       dispatch(updateMembership(data));
       //Should update membership with the new status...
       //Will need to pass data along with the websocket,
       //Then dispatch an action to update the membership
     });
      socket.on('join_message', (data) => {
            console.log(data);
        })

      socket.on('new_member', (data) => {
        console.log("This is for allServers data", data);
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
