import React, { useEffect, useState } from "react";
import Channel from "../ChannelDetails";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import { getServerChannels } from "../../store/channels";

const SingleServerPage = () => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const dispatch = useDispatch()
  const { serverId } = useParams();

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

            {/* <div className="svr-channel-msgs">
          <Channel channel={currentChannel} />
          </div>
          <div>
          {server?.users.map((user) => (
            <div key={user.id}>
            {user.username}
            {user.photo_url}
            </div>
            ))}
          </div> */}
          </div>
          <Switch>
            <Route path={`/servers/${serverId}/channels/:channelId`}>
              <Channel />
            </Route>
          </Switch>
        </>
      )}
    </>
  )
}

export default SingleServerPage
