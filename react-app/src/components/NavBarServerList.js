import NavBarServer from "./NavBarServer";

function NavBarServerList({ servers }) {
 return (
  <>
   {servers.map((server) => {
    return (
     <div key={server.id} className="svr-nav-menu-item svr-dropdown-parent">
      <NavBarServer server={server} />
     </div>
    );
   })}
  </>
 );
}

export default NavBarServerList;
