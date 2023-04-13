import NavBarServer from "./NavBarServer";

function NavBarServerList({ servers }) {
 //  console.log("NavBarServerList servers: ", servers);
 return (
  <>
   {servers.map((server) => {
    return (
     <div key={server.id} className="svr-nav-menu-item svr-dropdown-parent">
      {/* {console.log("before NavBarServer server: ", server)} */}
      <NavBarServer serverId={server.id} />
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
