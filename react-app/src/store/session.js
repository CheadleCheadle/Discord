import { normalizeFn } from "./channels";

// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const JOIN_SERVER = "session/JOIN_SERVER";
const NEW_DIRECT_MESSAGE = "session/user/directMessages/CREATE"
const NEW_SERVER = "session/user/NEW"
const GET_MEMBERSHIPS = "session/memberships";
const CREATE_MEMBERSHIP = "session/new/membership";

const newMembership = (membership) => {
	return {
		type:CREATE_MEMBERSHIP,
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

const joinServer = (userId, server) => {
	return {
		type: JOIN_SERVER,
		userId,
		server,
	}
}

export const thunkNewDirectMessage = (data) => async (dispatch) => {
	dispatch(newDirectMessageAction(data))
};



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
		dispatch(getMembershipsThunk());
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
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		return data
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
		console.log("IM THE MEMBERSHIP", data);
		dispatch(newMembership(data));
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
	if (response.ok){
		const membership = await response.json();
		dispatch(newMembership(membership));
		return membership;
	}
	}

const initialState = { user: null, memberships: {} };

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
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
			return {
				...state,
				memberships: {...state.memberships, [action.membership.serverId]: action.membership}
			}
		}
		default:
			return state;
	}
}
