import NavBarServer from "./NavBarServer";
import AddChannelModal from "./AddChannelModal/index";
import OpenModalMenuItem from "./OpenModalButton/";
function NavBarServerList({ servers }) {
 return (
  <>
   {servers.map((server) => {
    return (
     <div key={server.id}>
      <NavBarServer server={server} />
     </div>
    );
   })}
     <OpenModalMenuItem 
        itemText="New Channel"
        modalComponent={<AddChannelModal />}
     />
  </>
 );
}

export default NavBarServerList;
