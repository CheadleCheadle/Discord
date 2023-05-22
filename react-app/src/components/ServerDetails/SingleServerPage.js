// export default SingleServerPage;
import React, { useEffect, useState } from "react";
import Channel from "../ChannelDetails";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import { getServerChannels, updateSingleChannelId } from "../../store/channels";
import { thunkUpdateSingleChannelId } from "../../store/channels.js";
import { fetchChannelMessagesThunk } from "../../store/channelmessages.js";
import Members from "./allMembers";
import OpenModalMenuItem from "../OpenModalButton";
import AddChannelModal from "../AddChannelModal";
import DeleteEditChannel from "./DeleteEditChannel";
import OpenModalButton from "../OpenModalButton";
import ServerMenuBox from "../ServerMenuBox";
import Friends from "../Friends";
import "./Server.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { loadOneServerId } from "../../store/servers";
import { fetchAllMembersThunk, getMembersThunk } from "../../store/members";
import { socket } from "../DirectMessages/roomChat";
import { logout } from "../../store/session";

const SingleServerPage = () => {
  const [ isLoaded, setIsLoaded ] = useState(false);
  let { serverId } = useParams();
  const [ active, setActive ] = useState(null);
  serverId = parseInt(serverId);
  const server = useSelector(state => state.servers.allServers[ serverId ])
  const singleChannelId = parseInt((useSelector(state => state.channels.singleChannelId)));

  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const userServers = useSelector((state) => state.session.user.servers);
  //For redirecting user when they aren't a member of a server...
  if (isNaN(+serverId) || !userServers[ serverId ]) {
    history.replace("/servers");
  }

  const roomName = String(serverId);
  const sessionUser = useSelector((state) => state.session.user);

  const servers = useSelector((state) => state.servers.allServers);

  const channelsArr = Object.values(
    useSelector((state) => state.channels.allChannels)
  );

  useEffect(() => {
    setActive(singleChannelId)
  }, [ channelsArr ])

  const handleClick = (channel) => {
    setActive(channel.id)
    dispatch(thunkUpdateSingleChannelId(channel.id))
    history.push(`/servers/${serverId}/channels/${channel.id}`)
  }

  const editChannel = (channel, e) => {
    e.stopPropagation()
    history.push(`/servers/${serverId}/channels/${channel.id}/edit`)
  }

  useEffect(() => {
    dispatch(getServerChannels(serverId))
      .then(dispatch(loadOneServerId(serverId)))
      .then(dispatch(fetchAllMembersThunk(serverId)))
      .then(() => setIsLoaded(true));

    socket.emit("join_server_room", { roomName, user });
  }, [ dispatch, serverId ]);

  useEffect(() => {
    if (server.channels[ singleChannelId ] && isLoaded) {
      dispatch(thunkUpdateSingleChannelId(singleChannelId))
      setActive(singleChannelId)
      history.push(`/servers/${serverId}/channels/${singleChannelId}`);
    } else if (isLoaded) {
      const keys = Object.keys(server.channels);
      dispatch(thunkUpdateSingleChannelId(parseInt(keys[ 0 ])))
      setActive(parseInt(keys[ 0 ]));
      history.push(`/servers/${serverId}/channels/${parseInt(keys[ 0 ])}`)
    }
  }, [ server, isLoaded ])

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout(sessionUser))
      .then(() => history.push('/'));

  };

  return (
    <>
      {isLoaded && (
        <>
          <div className="svr-channel-wrapper">
            <div id="svr-channels">
              <div className="svr-menu-box">
                <div className="svr-dropdown-btn-menu-box">
                  <ServerMenuBox servers={servers} user={sessionUser} />
                </div>
              </div>

              <span id="addAChannel">
                <p>TEXT CHANNELS</p>
                {sessionUser.id === server.owner_id ? <OpenModalButton
                  modalCSSClass="add-channel-display-none"
                  buttonText={
                    <FontAwesomeIcon icon={faPlus} id="plus-icon" className="fa-sm" />
                  }
                  modalComponent={<AddChannelModal />}
                /> : null}
              </span>

              <div
                className="chnl-container"
              >
                {channelsArr.map((channel) => (
                  <div key={channel.id}
                    className={active === channel.id ? "chnl-container-item-active" : "chnl-container-item"}
                    onClick={() => handleClick(channel)}
                  >
                    <p>#</p>
                    <div className="chnl-name"
                    >{channel.name}
                      {sessionUser.id === server.owner_id ? <div id="edit-cog">
                        <FontAwesomeIcon
                          onClick={(e) => editChannel(channel, e)}
                          icon={faGear} size="sm" />
                      </div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="user-info-nav">
              <div className="user-info">
                <span id="user-info-pfp">
                  <img src={sessionUser.photo_url}></img>
                </span>

                <div>
                  <span id="user-username">
                    <h4>{sessionUser.username}</h4>
                    <p>{sessionUser.username} #{sessionUser.code}</p>
                  </span>
                </div>
              </div>
              <p className="pointer" onClick={handleLogout}>Logout</p>
            </div>
          </div>
          <Switch>
            <Route path={`/servers/:serverId/channels/:channelId`}>
              <Channel />
            </Route>
          </Switch>
          {/* <Members isLoaded={isLoaded}></Members> */}
        </>
      )}
    </>
  );
};

export default SingleServerPage;
