import React, { useEffect, useState } from "react";
import Channel from "../ChannelDetails";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import { getServerChannels } from "../../store/channels";
import Members from "./allMembers";
import ServerMenuBox from "../ServerMenuBox";
import Friends from "../Friends";
import "./Server.css"
const SingleServerPage = () => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const dispatch = useDispatch()
  const { serverId } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const servers = useSelector(state => state.servers.allServers);
  console.log('servers-------------', servers);
  useEffect(() => {
    dispatch(getServerChannels(serverId))
      .then(() => setIsLoaded(true))
  }, [ dispatch, serverId ])

  const server = useSelector(state => state.servers.allServers[ serverId ])
  const channelsArr = Object.values(server.channels)

  return (
    <>
      {isLoaded && (
        <>

          <div className="svr-channel-wrapper">
            <div>
              {channelsArr.map((channel) => (
                <NavLink to={`/servers/${serverId}/channels/${channel.id}`} >
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
          <div className="members-wrapper">
          <Members></Members>
          </div>
        </>
      )}
    </>
  )
}

export default SingleServerPage
