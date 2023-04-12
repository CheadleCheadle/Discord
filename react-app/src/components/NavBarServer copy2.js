import {
 ContextMenuTrigger,
 ContextMenu,
 ContextMenuItem,
} from "rctx-contextmenu";

function NavBarServer({ server }) {
 let divStyle = {
  backgroundImage: "url(" + server.icon_url + ")",
 };
 //  console.log("divStyle: ", divStyle);
 return (
  <>
   <div
    className="svr-ctx-container"
    // style={divStyle}
    //data-tooltip={server.name}
   >
    <ContextMenuTrigger id="my-context-menu">
     <div
      className="svr-ctx-box"
      style={divStyle}
      data-tooltip={server.name}
     ></div>
    </ContextMenuTrigger>

    <ContextMenu id="my-context-menu-1" hideOnLeave={false}>
     <ContextMenuItem disabled={true}>Menu Item 1</ContextMenuItem>
     <ContextMenuItem>Menu Item 2</ContextMenuItem>
     <ContextMenuItem>Menu Item 3</ContextMenuItem>
     <ContextMenuItem>Menu Item 4</ContextMenuItem>
    </ContextMenu>
   </div>
  </>
 );
}

export default NavBarServer;
