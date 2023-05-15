import { normalizeFn } from "./channels";

const GET_ALL_MEMBERS = "/members/all";


const getMembers = (members) => {
    return {
        type: GET_ALL_MEMBERS,
        members
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

const initialState = { members: {}, singleMemberId: null };

const memberReducer = (state = initialState, action) => {

    let newState = {};

    switch(action.type) {
        case GET_ALL_MEMBERS: {
            newState = {
                ...state,
                members: {...action.members}
            }
            return newState;
        }
        default:
            return state;
    }

}

export default memberReducer;
