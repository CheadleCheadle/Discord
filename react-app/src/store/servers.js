const LOAD_ALL_SERVERS = "servers/LOAD_ALL_SERVER";


export const loadAllServers = (servers) => {
    return {
    type: LOAD_ALL_SERVERS,
    servers
    }
}
export const thunkLoadAllServers = () => async (dispatch) => {
 console.log("A inside thunkLoadAllServers before fetch ");
 const response = await fetch("/api/servers/");
console.log('heres the response',response);
 if (response.ok) {
  const servers = await response.json();

  console.log("B inside thunkLoadAllServers servers: ", servers);
  if (servers.errors) {
   console.log("C inside thunkLoadAllServers servers.errors: ", servers.errors);
   return;
  }
  return dispatch(loadAllServers(servers));
 }
};

const initialState = { allServers: {}, singleServerId: null };

const serverReducer = (state = initialState, action) => {
 //console.log("Inside serverReducer: ", action.type);
 let newState = {};
 switch (action.type) {
  case LOAD_ALL_SERVERS:
   newState = {
    ...state,
    allServers: {},
   };
   action.servers.servers.forEach((server) => {
    newState.allServers[server.id] = server;
   });
   return newState;

  // case ADD_SERVER:
  //  return { user: null };
  default:
   return state;
 }
};
export default serverReducer;
