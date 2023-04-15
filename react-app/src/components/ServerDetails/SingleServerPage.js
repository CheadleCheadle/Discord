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
const SingleServerPage = () => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const dispatch = useDispatch()
  const { serverId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const servers = useSelector(state => state.servers.allServers);
  useEffect(() => {
    dispatch(getServerChannels(serverId))
      .then(() => setIsLoaded(true))
  }, [ dispatch, serverId ])

  const server = useSelector(state => state.servers.allServers[ serverId ])
  // const channelsArr = Object.values(server.channels)
  const channelsArr = Object.values(useSelector(state => state.channels.allChannels));

  return (
    <>
      {isLoaded && (
        <>
          <div className="svr-channel-wrapper">
            <div className="chnl-container">
              {channelsArr.map((channel) => (
                <NavLink key={channel.id} to={`/servers/${serverId}/channels/${channel.id}`} >
                  {channel.name} {channel.id}
                </NavLink>
              ))}
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
