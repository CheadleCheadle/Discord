import { useSelector, useDispatch} from "react-redux"
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { updateChannelAction } from "../../store/channels";
import { updateSingleChannelId } from "../../store/channels";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getServerChannels } from "../../store/channels";
import DeleteEditChannel from "./DeleteEditChannel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
export default function EditChannel() {
    let { channelId: currentChannelId, serverId } = useParams();
    currentChannelId = parseInt(currentChannelId);
    const channel = useSelector(state => state.channels.allChannels[currentChannelId]);
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    let [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded ] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [active, setActive] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (!Object.values(errors).length) {
            const updatedChannel = {
                name,
                topic,
                max_users: channel.max_users,
                type: channel.type
            }
            dispatch(updateChannelAction(updatedChannel, currentChannelId));
            history.push(`/servers/${serverId}/channels/${channel.id}`)
        }
    }


    const { setModalContent, setOnModalClose } = useModal();

    const handleClick = (arg) => {
        setActive(arg);
        if (arg === "delete") {
            setModalContent(
            <DeleteEditChannel
             channelId={channel.id}
             serverId={serverId}
            ></DeleteEditChannel>
            )
        }
    }

    const handleLeave = () => {
        history.push(`/servers/${serverId}/channels/${channel.id}`)
    }

    useEffect(() => {
        if (!channel) {
            dispatch(getServerChannels(serverId))
        }
        dispatch(updateSingleChannelId(currentChannelId))

        if (channel) {
        setName(channel.name);
        setTopic(channel.topic);
        setIsLoaded(true);
        }
    }, [channel])

    useEffect(() => {

            const tempErrors = {};
            if (name === "") {
                tempErrors.name = "Please Provide a name";
            }
            if (topic === "") {
                tempErrors.topic = "Please Provide a topic";
            }
            setErrors(tempErrors);

    }, [name, topic, isSubmitted])

    return ( isLoaded &&
        <div className="edit-channel">
            <section id="sect-1">
            <div id="channel-overview-details">
                <div id="overview-cont">
                    <p># {channel.name} {channel.topic}</p>
                </div>
            <div id="overview-cont">
            <h4
            onClick={() => handleClick("overview")}
            id={active === "overview" ? "active-overview" : "overview-details"}>Overview</h4>
            </div>
            <div id="overview-cont">
            <h4
            onClick={() => handleClick("delete")}
            id={active === "delete" ? "active-overview" : "overview-details"}>Delete Channel</h4>
            </div>
            </div>
            </section>
            <section id="sect-2">
            <div className="edit-overview">
                <span id="overview-close">
                <h2>Overview</h2>
                <FontAwesomeIcon
                icon={faCircleXmark}
                id="leave" className="fa-2x"
                onClick={() => {
                    handleLeave();
                }}
                 />
                </span>
                <form>
                    <label>CHANNEL NAME</label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                    {isSubmitted && <p className="errors">{errors.name}</p>}
                    <label id="channel-topic">Channel Topic</label>
                    <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                    placeholder="Let everyone know how to use this channel!"
                    />
                    {isSubmitted && <p className="errors">{errors.topic}</p>}
                </form>
                <span id="save-changes">
                    <div
                    onClick={(e) => handleSubmit(e)}
                    >Save Changes</div>
                    </span>
            </div>
            </section>
        </div>
    )



}
