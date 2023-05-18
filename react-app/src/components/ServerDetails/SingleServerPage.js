// export default SingleServerPage;
import React, { useEffect, useState } from "react";
import Channel from "../ChannelDetails";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import { getServerChannels, updateSingleChannelId } from "../../store/channels";
import Members from "./allMembers";
import OpenModalMenuItem from "../OpenModalButton";
import AddChannelModal from "../AddChannelModal";
import DeleteEditChannel from "./DeleteEditChannel";
import OpenModalButton from "../OpenModalButton";
import ServerMenuBox from "../ServerMenuBox";
import Friends from "../Friends";
import "./Server.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { loadOneServerId } from "../../store/servers";
import { fetchAllMembersThunk, getMembersThunk } from "../../store/members";
import { socket } from "../DirectMessages/roomChat";
const SingleServerPage = () => {
 const [isLoaded, setIsLoaded] = useState(false);
 let { serverId } = useParams();
 serverId = parseInt(serverId);
 const history = useHistory();
 const dispatch = useDispatch();
 const user = useSelector(state => state.session.user);
 const userServers = useSelector((state) => state.session.user.servers);
 //For redirecting user when they aren't a member of a server...
 if (isNaN(+serverId) || !userServers[serverId]) {
  history.replace("/servers");
 }

  const roomName = String(serverId);
 const sessionUser = useSelector((state) => state.session.user);

 const servers = useSelector((state) => state.servers.allServers);

 const channelsArr = Object.values(
  useSelector((state) => state.channels.allChannels)
 );

 useEffect(() => {
  console.log("This is the serverId", serverId, typeof serverId);
  dispatch(getServerChannels(serverId))
   .then(dispatch(loadOneServerId(serverId)))
   .then(dispatch(fetchAllMembersThunk(serverId)))
   .then(() => setIsLoaded(true));

    socket.emit("join_server_room", {roomName, user});
 }, [dispatch, serverId]);

 return (
  <>
   {isLoaded && (
    <>
     <div className="svr-channel-wrapper">
      <div className="svr-menu-box">
       <div className="svr-dropdown-btn-menu-box">
        <ServerMenuBox servers={servers} user={sessionUser} />
       </div>
       <div className="chnl-container">
        {channelsArr.map((channel) => (
         <div key={channel.id} className="chnl-container-item">
          <div>#️{channel.type}</div>
          <NavLink
           key={channel.id}
           to={`/servers/${serverId}/channels/${channel.id}`}
           style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
           }}
          >
           <div className="chnl-name">{channel.name}</div>
          </NavLink>
          <OpenModalButton
           buttonText="Delete"
           modalCSSClass="single-svr-chnl-delete-btn"
           modalComponent={
            <DeleteEditChannel
             channelId={channel.id}
             serverId={serverId}
            ></DeleteEditChannel>
           }
          />
          <OpenModalButton
           edit={true}
           channelId={channel.id}
           buttonText="Edit"
           modalCSSClass="single-svr-chnl-edit-btn"
           modalComponent={<AddChannelModal channel={channel} flag={true} />}
          />
         </div>
        ))}
       </div>
      </div>
              <div className="user-info">
                <span id="user-info-pfp">
                  <img src={sessionUser.photo_url}></img>
                </span>

                <div>
                  <span id="user-username">
                    <h4>{sessionUser.username}</h4>
                    <p>{sessionUser.username}#{sessionUser.code}</p>
                  </span>
                </div>
              </div>
     </div>
     <Switch>
      <Route path={`/servers/:serverId/channels/:channelId`}>
       <Channel />
      </Route>
     </Switch>
     <Members isLoaded={isLoaded}></Members>
    </>
   )}
  </>
 );
};

export default SingleServerPage;
