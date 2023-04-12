import NavBarServer from "./NavBarServer";
import AddChannelModal from "./AddChannelModal/index";
import OpenModalMenuItem from "./OpenModalButton/";
import Server from "../components/ServerDetails/index.js";
import { useHistory } from "react-router-dom";
function NavBarServerList({ servers }) {
 const history = useHistory();
 const loadServer = (server) => {
  history.push(`/servers/${server.id}`);
 };
 return (
  <>
   {servers.map((server) => {
    return (
     <div key={server.id} onClick={() => loadServer(server)}>
      <NavBarServer server={server} />
     </div>
    );
   })}
   <div className="svr-channel-nav-bar-container">
    <div></div>
   </div>
  </>
 );
}

export default NavBarServerList;
