import { logout } from "../../store/session";
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
import { faHashtag, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { useModal } from "../../context/Modal";
import UserInfo from "../UserInfoModal";
const SingleServerPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  let { serverId } = useParams();
  const [active, setActive] = useState(null);
  serverId = parseInt(serverId);
  const [room, setRoom] = useState('');

  const server = useSelector(state => state.servers.allServers[serverId])
  const singleChannelId = parseInt((useSelector(state => state.channels.singleChannelId)));

  const peerConnectionRef = useRef(null);
  const audioRef = useRef(null);


  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const userServers = useSelector((state) => state.session.user.servers);
  //For redirecting user when they aren't a member of a server...
  if (isNaN(+serverId) || !userServers[serverId]) {
    history.replace("/servers");
  }


  const { setModalContent, setOnModalClose } = useModal();



  const roomName = String(serverId);
  const sessionUser = useSelector((state) => state.session.user);

  const servers = useSelector((state) => state.servers.allServers);

  const textChannels = Object.values(
    useSelector((state) => state.channels.allChannels)
  ).filter(channel => channel.com_type === "text");

  const voiceChannels = Object.values(
    useSelector((state) => state.channels.allChannels)
  ).filter(channel => channel.com_type === "voice");




  useEffect(() => {
    setActive(singleChannelId)
  }, [textChannels, voiceChannels])

    const handleTrackEvent = (event) => {
    // Receive and play the incoming audio track from the remote peer
    audioRef.current.srcObject = event.streams[0];
  };


  const handleStartStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current.srcObject = stream;

      // Create a new peer connection
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add the audio track to the peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle incoming audio from the remote peer
      peerConnection.ontrack = handleTrackEvent;

      // Set up the offer answer flow
      socket.on('offer', handleOffer);

      // Join the chat room
      socket.emit('joinRoom', room);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

    const handleOffer = async (offer) => {
    try {
      // Set the received offer as the remote description
      await peerConnectionRef.current.setRemoteDescription(offer);

      // Create an answer to the offer
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      // Send the answer to the server
      socket.emit('answer', answer);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

    const handleStopStreaming = () => {
    const stream = audioRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    }

    audioRef.current.srcObject = null;

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

  };

  const handleClick = (channel, type) => {
    setActive(channel.id)
    dispatch(thunkUpdateSingleChannelId(channel.id))
    history.push(`/servers/${serverId}/channels/${channel.id}`)
    setRoom(channel.name);

    if (type === "voice") {
      handleStartStreaming(channel);
    } else {
      handleStopStreaming();
    }

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
  }, [dispatch, serverId]);

  useEffect(() => {

    if (server.channels[singleChannelId] && isLoaded) {
      dispatch(thunkUpdateSingleChannelId(singleChannelId))
      setActive(singleChannelId)
      history.push(`/servers/${serverId}/channels/${singleChannelId}`);
    } else if (isLoaded) {

      const keys = Object.keys(server.channels);
      dispatch(thunkUpdateSingleChannelId(parseInt(keys[0])))
      setActive(parseInt(keys[0]));
      history.push(`/servers/${serverId}/channels/${parseInt(keys[0])}`)
    }
  }, [server, isLoaded])

   const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout(sessionUser))
      .then(() => history.push('/'));

  };

    const handleUser = () => {
    setModalContent(<UserInfo user={sessionUser} />)
  }




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
                {textChannels.map((channel) => (
                  <div key={channel.id}
                    className={active === channel.id ? "chnl-container-item-active" : "chnl-container-item"}
                    onClick={() => handleClick(channel, "text")}
                  >
                    <FontAwesomeIcon icon={faHashtag} />
                    <div className="chnl-name"
                    >{channel.name}
                    </div>
                      {sessionUser.id === server.owner_id ? <div id="edit-cog">
                        <FontAwesomeIcon
                          onClick={(e) => editChannel(channel, e)}
                          icon={faGear} size="sm" />
                      </div> : null}
                  </div>
                ))}
              </div>
              <span id="addAChannel">
                <p>VOICE CHANNELS</p>
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
                {voiceChannels.map((channel) => (
                  <div key={channel.id}
                    className={active === channel.id ? "chnl-container-item-active" : "chnl-container-item"}
                    onClick={() => handleClick(channel, "voice")}
                  >

                    <FontAwesomeIcon icon={faVolumeHigh} />
                    <div className="chnl-name"
                    >{channel.name}
                    </div>
                      {sessionUser.id === server.owner_id ? <div id="edit-cog">
                        <FontAwesomeIcon
                          onClick={(e) => editChannel(channel, e)}
                          icon={faGear} size="sm" />
                      </div> : null}
                  </div>
                ))}
              </div>

                  <div>
                    <audio ref={audioRef} autoPlay />
                  </div>

            </div>
              <div className="user-info-nav">
                <div onClick={() =>handleUser()}className="user-info">
                  <div id="pfp-cont">
                    <img src={sessionUser.photo_url}></img>
                  </div>

                  <div>
                    <span id="user-username">
                      <h4>{sessionUser.username}</h4>
                      <p>{sessionUser.username} #{sessionUser.code}</p>
                    </span>
                  </div>
                </div>
                <div className="pointer" onClick={handleLogout}>Logout</div>
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
