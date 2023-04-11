import NavBarServer from "./NavBarServer";

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
  </>
 );
}

export default NavBarServerList;
