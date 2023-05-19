import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal.js";
import { createChannelAction, thunkUpdateSingleChannelId } from "../../store/channels";
import { updateChannelAction } from "../../store/channels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faX, faHashtag, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import "./AddChannel.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js";
export default function AddChannelModal({ channel, flag }) {
  const dispatch = useDispatch();
  const serverId = useSelector((state) => state.servers.singleServerId);
  const [name, setName] = useState("");
  let [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [active, setActive] = useState("");
  const history = useHistory();
  const currentChannelId = useSelector(state => state.channels.singleChannelId);

  const handleIsActive = (str) => {
    setActive(str);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newChannel = {
      server_id: serverId,
      name,
      type: "Public",
      max_users: 10,
      topic: "A topic"
    };
    const returnedChannel = await dispatch(createChannelAction(newChannel, serverId));
    dispatch(thunkUpdateSingleChannelId(returnedChannel.id))
    history.push(`/servers/${serverId}/channels/${returnedChannel.id}`)
    closeModal();

  };

  const handleDisable = () => {
    if (name === "") return true;
  };
  useEffect(() => {
    const tempErrors = {};
    if (name === "") {
      tempErrors.name = "please provide a name";
    }
    return setErrors(tempErrors);
  }, [name]);

  return (
    <>
    <div id="svr-channel-form-cont">


    <div className="svr-channel-form-container">

      <div id="create-channel-msg">
        <span>
          Create Channel
          <p>in Text Channels</p>
        </span>
        <div
        onClick={() => closeModal()}
        id="exit">
        <FontAwesomeIcon
        icon={faX} />
        </div>
      </div>
      <div id="channel-type">
        <h3>CHANNEL TYPE</h3>

        <div
          onClick={() => handleIsActive("text")}
          className={active === "text" ? "active-channel-type" : "channel-type"}>
          <div className="channel-type-icon">
            <FontAwesomeIcon icon={faHashtag} className="fa-lg" />
          </div>
          <span className="channel-type-option">
            Text
            <p>Send messages, images, and puns</p>
          </span>

        </div>
        <div
          onClick={() => handleIsActive("voice")}
          className={active === "voice" ? "active-channel-type" : "channel-type"}>
          <div className="channel-type-icon">
            <FontAwesomeIcon icon={faVolumeHigh} className="fa-lg" />
          </div>
          <span className="channel-type-option">
            Voice
            <p>Hang out together with voice chat</p>
          </span>

        </div>

      </div>
      <h3 id="channel-name">CHANNEL NAME</h3>
      <form className="svr-channel-form" onSubmit={handleSubmit}>
        <label className="channel-label">
          <div id="font-cont">
            <FontAwesomeIcon icon={faHashtag} className="fa-sm" />
          </div>
          <input
            className="svr-channel-form-input"
            placeholder="new-channel"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </form>
    </div>

      <div id="create-channel-buttons">

      <div id="buttons-cont">
        <div
        id="cancel"
        onClick={() => closeModal()}>
        Cancel
        </div>

        <div
        id={Object.values(errors).length ? "submit-channel-inactive": "submit-channel"}
        onClick={ Object.values(errors).length ? null : (e) => { handleSubmit(e) }}
        >Create Channel
        </div>

        </div>

      </div>
      </div>
      </>
  );
}
