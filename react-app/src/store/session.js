import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { normalizeFn } from "./channels";
import { thunkAddAServer, thunkLoadAllServers, thunkLoadCurrentServers } from "./servers";
import { socket } from "../components/DirectMessages/roomChat"
import { useSelector} from "react-redux";


const SET_USER = "session/SET_USER";
const ADD_USER_STATUS = "session/ADD_STATUS";
const REMOVE_USER_STATUS = "session/remove_user";
const REMOVE_USER = "session/REMOVE_USER";
const JOIN_SERVER = "session/JOIN_SERVER";
const NEW_DIRECT_MESSAGE = "session/user/directMessages/CREATE"
const NEW_SERVER = "session/user/NEW"
const GET_MEMBERSHIPS = "session/memberships";
const CREATE_MEMBERSHIP = "session/new/membership";
const DELETE_SERVER = "session/delete"
const EDIT_SERVER = "session/servers/edit"
const GET_ONLINE_USERS = "session/onlineUsers";
const UPDATE_MEMBERSHIP = "session/membership/update"
export const editServer = (server) => {
	return {
		type: EDIT_SERVER,
		server
	}
}
export const addUserStatus = (user) => {
	return {
		type: ADD_USER_STATUS,
		user
	}
}

export const removeUserStatus = (user) => {
	return {
		type: REMOVE_USER_STATUS,
		user
	}
}
export const deleteUserServer = (serverId) => {
	return {
		type: DELETE_SERVER,
		serverId
	}
}
export const newMembership = (membership) => {
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

const removeUser = (user) => ({
	type: REMOVE_USER,
	user
});

const joinServer = (userId, serverId, status, membershipId) => {
	return {
		type: JOIN_SERVER,
		userId,
		serverId,
		status,
		membershipId
	}
}

const getOnlineUsers = (users) => {
	return {
		type: GET_ONLINE_USERS,
		users
	}
}

export const updateMembership = (membership) => {
	return {
		type: UPDATE_MEMBERSHIP,
		membership
	}
}

export const thunkNewDirectMessage = (data) => async (dispatch) => {
	dispatch(newDirectMessageAction(data))
};

export const changeMembershipStatusThunk = (serverId, userId, membershipId) => async dispatch => {
	const response = await fetch(`/api/servers/${serverId}/membership`, {
		method: "POST",
		headers: {
			"Content-Type": "Application/json"
		},
		body: JSON.stringify({userId})
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(joinServer(data.userId, data.serverId, data.status, membershipId));
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
		console.log("This is the user!!!!!!", data);
		socket.emit('connecting', {user: data})
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

export const logout = (user) => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		socket.emit('disconnectingUser', {user})
		dispatch(removeUser(user));
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

const initialState = { user: null, activeUsers: {}, memberships: {} };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			console.log("THISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", action.payload)
			action.payload.channel_messages = normalizeFn(action.payload.channel_messages)
			action.payload.direct_messages = normalizeFn(action.payload.direct_messages)
			action.payload.friends = normalizeFn(action.payload.friends)
			action.payload.servers = normalizeFn(action.payload.servers)

			return { ...state, user: action.payload};
		case ADD_USER_STATUS: {
			return {
				...state, activeUsers: {...state.activeUsers, [action.user.id]: action.user}
			}
		}
		case REMOVE_USER_STATUS: {
			let newState = {
				...state,
				activeUsers: {...state.activeUsers}
			}
			delete newState.activeUsers[action.user.id];
			return newState;
		}
		case REMOVE_USER:
			let newState = {
				...state,
				user: null
			}
			return newState;

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
			memberships: {...state.memberships}
		}
		newState.memberships[action.membershipId].status = action.status;
		return newState;
	}
	case GET_ONLINE_USERS: {
		return {
			...state,
			onlineUsers: {...action.users}
		}
	}
	case UPDATE_MEMBERSHIP: {
		let newState = {
			...state,
			memberships: {...state.memberships}
		};
		newState.memberships[action.membership.id] = action.membership;
		return newState;
	}
		default:
			return state;
	}
}
