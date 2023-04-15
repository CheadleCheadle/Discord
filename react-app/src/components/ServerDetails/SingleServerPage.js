import React, { useEffect, useState } from "react";
import Channel from "../ChannelDetails";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import { getServerChannels } from "../../store/channels";
import Members from "./allMembers";
import OpenModalMenuItem from "../OpenModalButton";
import AddChannelModal from "../AddChannelModal";
import ServerMenuBox from "../ServerMenuBox";
import Friends from "../Friends";
import "./Server.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { loadOneServerId } from "../../store/servers";
const SingleServerPage = () => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const { serverId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const userServers = useSelector(state => state.session.user.servers);
  //For redirecting user when they aren't a member of a server...
  if (isNaN(+serverId) || !userServers[serverId]) {
    history.replace("/servers")
}

  const sessionUser = useSelector(state => state.session.user);

  const servers = useSelector(state => state.servers.allServers);


  const channelsArr = Object.values(useSelector(state => state.channels.allChannels));

  useEffect(() => {
    dispatch(getServerChannels(serverId))
    .then(dispatch(loadOneServerId(serverId)))
    .then(() => setIsLoaded(true))
  }, [ dispatch, serverId ])


  return (
    <>
      {isLoaded && (
        <>
          <div className="svr-channel-wrapper">
        <div className="svr-menu-box">
            <ServerMenuBox servers={servers} user={sessionUser} />
            <div className="chnl-container">

              {channelsArr.map((channel) => (
                <NavLink key={channel.id} to={`/servers/${serverId}/channels/${channel.id}`} >
                  {channel.name} {channel.id}
                </NavLink>
              ))}
            </div>
          </div>
              </div>
          <Switch>
            <Route path={`/servers/:serverId/channels/:channelId`}>
              <Channel />
            </Route>
          </Switch>
                {/* Button for opening the modal to create a channel. May need to be moved */}
        {/* <OpenModalMenuItem
        itemText="New Channel"
        modalComponent={<AddChannelModal />}
        /> */}
          <div className="members-wrapper">
          <Members></Members>
          </div>
        </>
      )}
    </>
  )
}


export default SingleServerPage
