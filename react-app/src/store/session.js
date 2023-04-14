import { normalizeFn } from "./channels";

// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const JOIN_SERVER = "session/JOIN_SERVER";
const NEW_DIRECT_MESSAGE = "session/user/directMessages/CREATE"
const NEW_SERVER = "session/user/NEW"
const DELETE_SERVERS = "session/user/DELETE"

export const deleteServers = (serverId) => {
	return {
		type: DELETE_SERVERS,
		serverId
	}
}
export const newUserServer = (server) => {
	return {
		type: NEW_SERVER,
		server
	}
}
const newDirectMessageAction = (data) => {
	return {
		type: NEW_DIRECT_MESSAGE,
		payload: data
	}
}

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const joinServer = (userId, server) => {
	return {
		type: JOIN_SERVER,
		userId,
		server,
	}
}

export const thunkNewDirectMessage = (data) => async (dispatch) => {
	console.log("MESSAGE", data)
	dispatch(newDirectMessageAction(data))
};


const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return [ "An error occurred. Please try again." ];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (username, email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return [ "An error occurred. Please try again." ];
	}
};

export const joinServerThunk = (serverId, user) => async (dispatch) => {
	const response = await fetch(`/api/servers/join/${serverId}`, {
		method: "POST",
		headers: { "Content-Type": "Application/json" },
		body: JSON.stringify({ user, status: "pending" })
	});

	if (response.ok) {
		const data = await response.json();
		console.log(response);
		dispatch(joinServer(user.id, data));
	}
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			action.payload.channel_messages = normalizeFn(action.payload.channel_messages)
			action.payload.direct_messages = normalizeFn(action.payload.direct_messages)
			action.payload.friends = normalizeFn(action.payload.friends)
			action.payload.servers = normalizeFn(action.payload.servers)
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		case JOIN_SERVER: {
			let newState = { ...state };
			newState.user = { ...state.user };
			newState.channel_messages = { ...state.user.channel_messages };
			newState.direct_messages = { ...state.user.direct_messages };
			newState.friends = { ...state.user.friends }
			newState.servers = { ...state.user.servers, [ action.userId ]: action.server };
			return newState;
		}
		case NEW_SERVER: {
			let newState = {...state};
			newState.servers = {...state.user.servers, }

			return {
				...state,
				user: {...state.user, servers: {...state.user.servers, [action.server.id]: action.server} }
			};

		}
		case NEW_DIRECT_MESSAGE:
			return {
				...state,
				user: {
					...state.user,
					direct_messages: {
						...state.user.direct_messages,
						[ action.payload.id ]: { ...action.payload }
					}
				}
			}
		case DELETE_SERVERS: {
			 let newState = {
				...state,
				user: {
					...state.user,
					servers: {...state.user.servers}
				}

			}
			delete newState.user.servers[action.serverId]
			return newState;
		}
		default:
			return state;
	}
}
