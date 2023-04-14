import { normalizeFn } from "./channels";

const LOAD_ALL_SERVERS = "servers/LOAD_ALL_SERVER";
const LOAD_ONE_SERVER = "servers/LOAD_ONE_SERVER";
const ADD_A_SERVER = "servers/ADD_A_SERVER";
const DELETE_A_SERVER = "servers/DELETE_A_SERVER";
const EDIT_A_SERVER = "servers/EDIT_A_SERVER";
const LOAD_ONE_SERVER_ID = "servers/ONE";
export const loadOneServerId =(serverId) => {
    return {
      type: LOAD_ONE_SERVER_ID,
      serverId
    }
}
export const loadAllServers = (servers) => {
  return {
    type: LOAD_ALL_SERVERS,
    servers,
  };
};

export const loadOneServer = (server) => {
  return {
    type: LOAD_ONE_SERVER,
    server,
  };
};

export const addAServer = (server) => {
  return {
    type: ADD_A_SERVER,
    server,
  };
};
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
export const thunkLoadAllServers = () => async (dispatch) => {
  const response = await fetch("/api/servers/");
  if (response.ok) {
    const servers = await response.json();
    const serversNormalized = normalizeFn(servers.servers)
    for (let serverId in serversNormalized) {
      const channels = serversNormalized[ serverId ].channels
      serversNormalized[ serverId ].channels = normalizeFn(channels)
      for (const channelId in serversNormalized[ serverId ].channels) {
        const messages = serversNormalized[ serverId ].channels[ channelId ].channel_messages
        serversNormalized[ serverId ].channels[ channelId ].channel_messages = normalizeFn(messages)
      }
    }
    dispatch(loadAllServers(serversNormalized));
    return serversNormalized
  };
  return
}

export const thunkLoadOneServer = (id) => async (dispatch) => {
  const response = await fetch(`/api/spots/${id}`);
  const server = await response.json();
  dispatch(loadOneServer(server));
};

export const thunkAddAServer = (data) => async (dispatch) => {
  console.log("reducer thunkAddAServer data:", data);
  let server;
  const response = await fetch("/api/servers/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    server = await response.json();
    dispatch(addAServer(server));

    // console.log("reducer createASpot spot:", spot);
    return server;
  } else {
    return response;
  }
};

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
    dispatch(deleteAServer(+id));

    // console.log("reducer createASpot spot:", spot);
    return message;
  } else {
    return response;
  }
};

export const thunkEditAServer = (data, id) => async (dispatch) => {
  //  console.log("reducer thunkAddAServer data:", data);
  let server;
  const response = await fetch(`/api/servers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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

const initialState = { allServers: {}, singleServerId: null};

const serverReducer = (state = initialState, action) => {
  //console.log("Inside serverReducer: ", action.type);
  let newState = {};
  switch (action.type) {
    case LOAD_ONE_SERVER_ID: {
      newState = {
        ...state,
        singleServerId: action.serverId
      }
      return newState;
    }
    case LOAD_ALL_SERVERS:
      newState = {
        ...state,
        allServers: { ...action.servers },
      };
      return newState;
    case LOAD_ONE_SERVER:
      newState = {
        ...state,
        allServers: {},
      };
      newState.allServers[ action.server.id ] = action.server;
      return newState;

    case ADD_A_SERVER:
      newState = {
        ...state,
        allServers: { ...state.allServers },
      };
      newState.allServers[ action.server.id ] = action.server;
      return newState;

    case DELETE_A_SERVER:
      newState = {
        ...state,
        allServers: { ...state.allServers },
      };
      delete newState.allServers[ action.id ];
      return newState;

    case EDIT_A_SERVER:
      newState = {
        ...state,
        allServers: { ...state.allServers },
      };
      newState.allServers[ action.server.id ] = action.server;
      return newState;

    default:
      return state;
  }
};
export default serverReducer;
