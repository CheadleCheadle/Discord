import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { editUserImageThunk, editUserThunk, logout } from "../../store/session";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./main.css"
export default function EditUser() {
    const [active, setActive] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [image, setImage] = useState('');
    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout(sessionUser))
            .then(() => history.push('/'));
    };

    const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

    const handleLeave = () => {
        history.push('/servers');
    }

    const handleEdit = (e) => {
        e.preventDefault();
        console.log('image', image);
        if (image) {
            dispatch(editUserImageThunk(image, sessionUser.id, username, about))
            .then(() => {
                dispatch(editUserThunk(sessionUser.id, username, about))
            })
            .then(() => {
                history.push('/servers');
            })
        } else {
            console.log(sessionUser.id)
            dispatch(editUserThunk(sessionUser.id, username, about))
            .then(() => {
                history.push('/servers');
            })
        }

    }

    useEffect(() => {
        setAbout(sessionUser.about);
        setUsername(sessionUser.username);
    }, [])


    return (
        <div className="edit-channel">
            <section id="sect-1">
                <div id="channel-overview-details">
                    <div id="overview-cont">
                        <p>USER SETTINGS</p>
                    </div>
                    <div id="overview-cont">
                        <h4
                            id={active === "overview" ? "active-overview" : "overview-details"}>My Account</h4>
                    </div>
                    <div id="overview-cont">
                        <h4
                            onClick={(e) => handleLogout(e)}
                            id={active === "delete" ? "active-overview" : "overview-details"}>
                            Logout
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </h4>
                    </div>
                </div>

            </section>

            <section id="sect-2">
            <div id="account-cont">
                <div className="edit-overview-user">

                    <span id="my-account">
                        <h2>My Account</h2>
                    </span>
                    <div id="hero-photo">
                        <img src={sessionUser.photo_url}></img>
                        <label id="upload-image">
                            <p>{image.name}</p>
                            <FontAwesomeIcon icon={faImages} />
                            Upload Image
                            <input type="file" onChange={updateFile}></input>
                        </label>
                    </div>
                    </div>
                <div id="edit-user-form">
                    <span id="exit-edit">
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            id="leave" className="fa-2x"
                            onClick={handleLeave}
                            />
                    </span>
                    <form>
                        <label>Username</label>
                        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                        <label>About Me</label>
                        <textarea id="about-me" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                    </form>
                    <span id="save-changes-edit">
                        <div
                        onClick={handleEdit}
                        >Save Changes
                        </div>
                    </span>

                </div>
                </div>
            </section>


        </div>
    )
}
