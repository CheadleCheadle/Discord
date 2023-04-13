const LOAD_ALL_SERVERS = "servers/LOAD_ALL_SERVER";
//const LOAD_ONE_SERVER = "servers/LOAD_ONE_SERVER";
//const ADD_A_SERVER = "servers/ADD_A_SERVER";
const DELETE_A_SERVER = "servers/DELETE_A_SERVER";
const EDIT_A_SERVER = "servers/EDIT_A_SERVER";

export const loadAllServers = (servers) => {
 return {
  type: LOAD_ALL_SERVERS,
  servers,
 };
};

// export const loadOneServer = (server) => {
//  return {
//   type: LOAD_ONE_SERVER,
//   server,
//  };
// };

// export const addAServer = (server) => {
//  return {
//   type: ADD_A_SERVER,
//   server,
//  };
// };
export const deleteAServer = (id) => {
 return {
  type: DELETE_A_SERVER,
  id,
 };
};
export const editAServer = (server) => {
 return {
  type: EDIT_A_SERVER,
  server,
 };
};
//read all
export const thunkLoadAllServers = () => async (dispatch) => {
 console.log("A inside thunkLoadAllServers before fetch ");
 const response = await fetch("/api/servers/");
 console.log("heres the response", response);
 if (response.ok) {
  const servers = await response.json();
  console.log("B inside thunkLoadAllServers servers: ", servers);
  dispatch(loadAllServers(servers));

  return servers;
 } else return response;

 // if (servers.errors) {
 //  //  console.log("C inside thunkLoadAllServers servers.errors: ", servers.errors);
 //  return servers.errors;
 // }
};

//*read one
export const thunkLoadOneServer = (id) => async (dispatch) => {
 const response = await fetch(`/api/spots/${id}`);
 const server = await response.json();
 dispatch(editAServer(server));
 return server;
};

//*add one
export const thunkAddAServer = (data) => async (dispatch) => {
 console.log("reducer thunkAddAServer data:", data);
 let server;
 const response = await fetch("/api/servers/new", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
 });
 console.log("B thunkAddAServer response.json():", response.json());
 if (response.ok) {
  server = await response.json();
  dispatch(editAServer(server));

  // console.log("reducer createASpot spot:", spot);
  return server;
 } else {
  return response;
 }
};

//*delete one
export const thunkDeleteAServer = (id) => async (dispatch) => {
 //  console.log("reducer thunkAddAServer data:", data);
 let message;
 const response = await fetch(`/api/servers/${id}`, {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: null,
 });

 if (response.ok) {
  message = await response.json();
  dispatch(deleteAServer(id));

  // console.log("reducer createASpot spot:", spot);
  return message;
 } else {
  return response;
 }
};

//*modify one
export const thunkEditAServer = (data, id) => async (dispatch) => {
 console.log("A thunkEditAServer data:", data);
 let server;
 const response = await fetch(`/api/servers/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "Application/json" },
  body: JSON.stringify(data),
 });
 if (response.ok) {
  server = await response.json();
  dispatch(editAServer(server));

  // console.log("reducer createASpot spot:", spot);
  return server;
 } else {
  return response;
 }
};

const initialState = {
 allServers: {},
 singleServer: null,
};

//*reducer
const serverReducer = (state = initialState, action) => {
 //console.log("Inside serverReducer: ", action.type);
 let newState = {};
 switch (action.type) {
  case LOAD_ALL_SERVERS:
   newState = {
    ...state,
    allServers: {},
    singleServer: state.singleServer,
    //id of the single server
   };
   action.servers.servers.forEach((server) => {
    newState.allServers[server.id] = server;
   });
   return newState;

  // case LOAD_ONE_SERVER:
  //  newState = {
  //   ...state,
  //   allServers: { ...state.allServers },
  //   singleServer: action.server.id,
  //  };
  //  newState.allServers[action.server.id] = action.server;
  //  return newState;

  // case ADD_A_SERVER:
  //  newState = {
  //   ...state,
  //   allServers: { ...state.allServers },
  //   singleServer: action.server.id,
  //  };
  //  newState.allServers[action.server.id] = action.server;
  //  return newState;

  case DELETE_A_SERVER:
   newState = {
    ...state,
    allServers: { ...state.allServers },
    singleServer: null,
   };
   delete newState.allServers[action.id];
   return newState;

  case EDIT_A_SERVER:
   newState = {
    ...state,
    allServers: { ...state.allServers },
    singleServer: action.server.id,
   };
   newState.allServers[action.server.id] = action.server;
   return newState;

  default:
   return state;
 }
};
export default serverReducer;
