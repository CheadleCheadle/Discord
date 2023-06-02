import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./main.css"
export default function EditUser() {
    const [active, setActive] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
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
                <div className="edit-overview">
                    <span id="overview-close">
                        <h2>My Account</h2>
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            id="leave" className="fa-2x"
                        />
                    </span>
                    <div id="hero-photo">
                        <img src={sessionUser.photo_url}></img>
                        <label id="upload-image">
                            <FontAwesomeIcon icon={faImages} />
                            Upload Image
                            <input type="file" onChange={updateFile}></input>
                        </label>
                    </div>
                    <form>

                    </form>
                    <span id="save-changes">
                        <div
                        >Save Changes</div>
                    </span>

                </div>
            </section>


        </div>
    )
}
