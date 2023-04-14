import NavBarServer from "./NavBarServer";
import AddChannelModal from "./AddChannelModal/index";
import OpenModalMenuItem from "./OpenModalButton/";
import Server from "../components/ServerDetails/index.js";
import { NavLink, useHistory } from "react-router-dom";
import "./Navigation/Navigation.css"
import { useSelector, useDispatch} from "react-redux";
import { loadOneServerId } from "../store/servers";
function NavBarServerList() {
  const serversObj = useSelector(state => state.session.user.servers)
  const servers = Object.values(serversObj)
  const history = useHistory();
  const dispatch = useDispatch();
  const handleClick = (server) => {
    dispatch(loadOneServerId(server.id));
    console.log('im being clikcedj')
  }
  return (
    <>
      {servers.map((server) => (
        <NavLink key={server.name} to={`/servers/${server.id}`}>
          <div onClick={() => handleClick(server)}key={server.id} className="svr-nav-menu-item svr-dropdown-parent">
            <NavBarServer server={server} />
          </div>
        </NavLink >
      ))}
      <div className="svr-channel-nav-bar-container">
        <div></div>
      </div>
    </>
  );
}

export default NavBarServerList;
