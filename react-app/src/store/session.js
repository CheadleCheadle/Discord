import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { normalizeFn } from "./channels";
import { thunkAddAServer, thunkLoadAllServers, thunkLoadCurrentServers } from "./servers";

// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const JOIN_SERVER = "session/JOIN_SERVER";
const NEW_DIRECT_MESSAGE = "session/user/directMessages/CREATE"
const NEW_SERVER = "session/user/NEW"
const GET_MEMBERSHIPS = "session/memberships";
const CREATE_MEMBERSHIP = "session/new/membership";
const DELETE_SERVER = "session/delete"
const EDIT_SERVER = "session/servers/edit"
const GET_ONLINE_USERS = "session/onlineUsers";
export const editServer = (server) => {
	return {
		type: EDIT_SERVER,
		server
	}
}
export const deleteUserServer = (serverId) => {
	return {
		type: DELETE_SERVER,
		serverId
	}
}
export const newMembership = (membership) => {
	console.log("IM THE NEW MEMBERSHIP FOR BOTH MEMBERSHIPS")
	return {
		type: CREATE_MEMBERSHIP,
		membership
	}
}
const getMemberships = (memberships) => {
	return {
		type: GET_MEMBERSHIPS,
		memberships
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

const joinServer = (userId, serverId, status) => {
	return {
		type: JOIN_SERVER,
		userId,
		serverId,
		status
	}
}

const getOnlineUsers = (users) => {
	return {
		type: GET_ONLINE_USERS,
		users
	}
}

export const thunkNewDirectMessage = (data) => async (dispatch) => {
	dispatch(newDirectMessageAction(data))
};

export const changeMembershipStatusThunk = (serverId, userId) => async dispatch => {
	const response = await fetch(`/api/servers/${serverId}/membership`, {
		method: "POST",
		headers: {
			"Content-Type": "Application/json"
		},
		body: JSON.stringify({userId})
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(joinServer(data.userId, data.serverId, data.status));
		return data;
	}
}

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
		await dispatch(setUser(data));
		await dispatch(getMembershipsThunk());
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

export const signUp = (username, email, password, firstname, lastname) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
			firstname,
			lastname
		}),
	});

	if (response.ok) {
		const data = await response.json();
		await dispatch(setUser(data));
		await dispatch(getMembershipsThunk());
		return data
	}
};

export const joinServerThunk = (server) => async (dispatch) => {
	const response = await fetch(`/api/servers/${server.id}/membership`);
	if (response.ok) {
		const data = await response.json();
		dispatch(getMembershipsThunk());
		return data;
	}
}

export const getMembershipsThunk = () => async (dispatch) => {
	const response = await fetch(`/api/memberships/curr`);
	const memberships = await response.json();
	console.log("HERE ARE THE MEMBERSHIPS", memberships);
	dispatch(getMemberships(memberships));
}

export const newMembershipThunk = (serverId) => async (dispatch) => {
	const response = await fetch(`/api/servers/${serverId}/memebership`)
	if (response.ok) {
		const membership = await response.json();
		dispatch(newMembership(membership));
		return membership;
	}
}

export const getOnlineUsersThunk = () => async (dispatch) => {
	const response = await fetch(`/api/users/online`);
	if (response.ok) {
		const data = await response.json();
		console.log("Im a user", data);
		// const users = normalizeFn(data);
		dispatch(getOnlineUsers(data))
		return data;
	}
}

const initialState = { user: null, onlineUsers: {}, memberships: {} };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			console.log("THISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", action.payload)
			action.payload.channel_messages = normalizeFn(action.payload.channel_messages)
			action.payload.direct_messages = normalizeFn(action.payload.direct_messages)
			action.payload.friends = normalizeFn(action.payload.friends)
			action.payload.servers = normalizeFn(action.payload.servers)
			return { ...state, user: action.payload };
		case REMOVE_USER:
			return { user: null };

		case NEW_SERVER: {
			let newState = { ...state };
			newState.servers = { ...state.user.servers, }

			return {
				...state,
				user: { ...state.user, servers: { ...state.user.servers, [ action.server.id ]: action.server } }
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
		case GET_MEMBERSHIPS: {
			return {
				...state,
				memberships: action.memberships
			}
		}
		case CREATE_MEMBERSHIP: {
			// let newState =  {
			// 	...state,
			// 	user: {...state.user. servers: {...state.user.servers,
			// 		 [action.membership.serverId]: {...state.user.servers[action.membership.serverId],
			// 			memberships: {...state.user.servers[action.membership.userId], [action.membership.userId]: action.membership}},
			// 	memberships: { ...state.memberships, [ action.membership.serverId ]: action.membership }}
			// }
			// return newState;
			// console.log("THIS IS THE MEMBERSHIP INSIDE OF THE REDUCER", action.membership);
			// console.log("ERROR CAUSER", state.user.servers);
			// return {
			// 	...state,
			// 	user: {...state.user,
			// 		 servers: {...state.user.servers, [action.membership.serverId] : {...state.user.servers[action.membership.serverId],
			// 			memberships: {...state.user.servers[action.membership.serverId].memberships, [action.membership.userId]: {...action.membership}}
			// 		}},
			// 	},
			// 	memberships: {...state.memberships, [action.membership.serverId]: {...action.membership}}
			// }
			return {
				...state,
				memberships: {...state.memberships, [action.membership.id]: action.membership}
			}
		}
		case DELETE_SERVER: {
			let newState = {
				...state,
				user: {...state.user, servers: {...state.user.servers}},
				memberships: {...state.memberships}
			};
			delete newState.memberships[action.serverId];
			delete newState.user.servers[action.serverId];
			return newState;

		}
		case EDIT_SERVER : {
			let newState =  {
				...state,
				user: {...state.user, servers: {...state.user.servers}}
			}
			console.log("SERVERID", action.server.id);
			newState.user.servers[action.server.id] = action.server;
			return newState;
		}
		case JOIN_SERVER: {
			let newState = {
				...state,
				user: {...state.user, servers: {...state.user.servers,
					 memberships: {...state.user.servers[action.serverId].memberships}
					}
			}
		}
		newState.user.servers[action.serverId].memberships[action.userId].status = action.status
	}
	case GET_ONLINE_USERS: {
		return {
			...state,
			onlineUsers: {...action.users}
		}
	}
		default:
			return state;
	}
}
