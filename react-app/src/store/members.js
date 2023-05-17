import { normalizeFn } from "./channels";

const GET_ALL_MEMBERS = "/members/all";
const GET_HOST = "members/host";
const GET_MEMBERS = "/members";
const GET_PENDING = "/pending";
const NEW_PENDING = "/pending/new";
const NEW_MEMBER = "/member/new";

const getMembers = (members) => {
    return {
        type: GET_ALL_MEMBERS,
        members
    }
}
const getHost = (host) => {
    return {
        type: GET_HOST,
        host
    }
}

const getTheMembers = (members) => {
    return {
        type: GET_MEMBERS,
        members
    }
}

const getPending = (pending) => {
    return {
        type: GET_PENDING,
        pending
    }
}

export const newPending = (pending) => {
    return {
        type: NEW_PENDING,
        pending
    }
}

export const newMember = (member) => {
    return {
        type: NEW_MEMBER,
        member
    }
}


// Thunk to fetch all members for a server.
export const getMembersThunk = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}`);
    if (response.ok) {
        const server = await response.json();
        const members = normalizeFn(server.users);
        dispatch(getMembers(members));
        return members;
    }
}

//Thunk to fetch host, members, and pending users for a server.
export const fetchAllMembersThunk = (serverId) => async (dispatch) => {
    const hostResponse = await fetch(`/api/memberships/host/${serverId}`);
    const membersResponse = await fetch(`/api/memberships/members/${serverId}`);
    const pendingResponse = await fetch(`/api/memberships/pending/${serverId}`);

    if (hostResponse.ok && membersResponse.ok && pendingResponse.ok) {
        const host = await hostResponse.json();
        const members = await membersResponse.json();
        const pending = await pendingResponse.json();
        dispatch(getHost(host))
        dispatch(getTheMembers(normalizeFn(members)))
        dispatch(getPending(normalizeFn(pending)));


    }
}

const initialState = { allMembers: {}, host: {}, members: {}, pending: {},  singleMemberId: null };

const memberReducer = (state = initialState, action) => {

    let newState = {};

    switch(action.type) {
        case GET_ALL_MEMBERS: {
            newState = {
                ...state,
                allMembers: {...action.members}
            }
            return newState;
        }
        case GET_HOST: {
            newState = {
                ...state,
                host: {...action.host}
            }
            return newState;
        }
        case GET_MEMBERS: {
            newState = {
                ...state,
                members: {...action.members}
            }
            return newState;
        }
        case GET_PENDING: {
            newState = {
                ...state,
                pending: {...action.pending}
            }
            return newState;
        }
        case NEW_PENDING: {
            newState = {
                ...state,
                pending: {...state.pending, [action.pending.id]: action.pending}
            }
            return newState;
        }
        case NEW_MEMBER: {
            newState = {
                ...state,
                pending: {...state.pending},
                members: {...state.members, [action.member.id]: action.member}
            };
            delete newState.pending[action.member.id];
            return newState;
        }
        default:
            return state;
    }

}

export default memberReducer;
