import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { thunkAddAServer, thunkEditAServer } from "../../store/servers";
import { editServer } from "../../store/session";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import DeleteServerModal from "../DeleteServerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";


export default function EditServer() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(false);
    const { closeModal } = useModal();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [active, setActive] = useState(null);

    const server = useSelector(state => state.servers.allServers[state.servers.singleServerId]);


    const { setModalContent } = useModal();

    useEffect(() => {
        const tempErrors = {};

        if (name.length > 100) {
            tempErrors.name = "Name needs to be no more than 100 characters";
        }
        if (name === "") {
            tempErrors.name = "Name is required"
        }
        if (description === "") {
            tempErrors.description = "Description is required";
        }

        if (!tempErrors.length) {
            setDisabled(false)
        }
        setErrors(tempErrors);

    }, [name, description]);


    useEffect(() => {
        setName(server.name);
        setDescription(server.description);
        setIsLoaded(true);
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const updatedServer = {
            icon_url: server.icon_url,
            name,
            max_users: server.max_users,
            description,
            public_: server.public
        };

        if (!Object.values(errors).length) {
            dispatch(thunkEditAServer(updatedServer, server.id))
                .then((server) => {
                    dispatch(editServer(server))
                })
                .catch(async (res) => {
                    let data = res.json();
                })
            history.push(`/servers/${server.id}`)
        }

    }

    const handleClick = (arg) => {
        setActive(arg);
        if (arg === "delete") {
            setModalContent(
                <DeleteServerModal
                    serverId={server.id}
                />
            )
        }
    }

    const handleLeave = () => {
        history.push(`/servers/${server.id}`)
    }

    return (
        isLoaded &&
        <div className="edit-channel">
            <section id="sect-1">
                <div id="channel-overview-details">
                    <div id="overview-cont">
                        <p># {server.name}</p>
                    </div>
                    <div id="overview-cont">
                        <h4
                            onClick={() => handleClick("overview")}
                            id={active === "overview" ? "active-overview" : "overview-details"}>Overview</h4>
                    </div>
                    <div id="overview-cont">
                        <h4
                            onClick={() => handleClick("delete")}
                            id={active === "delete" ? "active-overview" : "overview-details"}>Delete Server</h4>
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
                        <label>SERVER NAME</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {isSubmitted && <p className="errors">{errors.name}</p>}
                        <label id="channel-topic">Server Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        {isSubmitted && <p className="errors">{errors.description}</p>}
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
