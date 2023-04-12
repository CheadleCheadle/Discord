const GET_ALL_CHANNELS = "channels/all";
const GET_ONE_CHANNEL = "channels/one";
const CREATE_CHANNEL = "channels/new";
const EDIT_CHANNEL = "channel/edit";
const DELETE_CHANNEL = "channel/delete";

export const loadServerChannels = (channels) => {
    return {
        type: GET_ALL_CHANNELS,
        channels
    }

}
export const loadServerChannel = (channel) => {
    return {
        type: GET_ONE_CHANNEL,
        channel
    }
}
export const createChannel = (channel) => {
    return {
        type: CREATE_CHANNEL,
        channel
    }
}
export const updateChannel = (channel) => {
    return {
        type: EDIT_CHANNEL,
        channel
    }
}

export const deleteChannel = (channelId) => {
    return {
        type: DELETE_CHANNEL,
        channelId
    }
}

export const getServerChannels = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels`);

    if (response.ok) {
        const data = await response.json();
        dispatch(loadServerChannels(data));
        return data;
    }
}

export const createChannelAction = (channel, serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/new`, {
        method: "POST",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(channel)
    });

    console.log("THIS IS THE RESPONSE", response);

    if (response.ok) {
      const data = await response.json();
        dispatch(createChannel(data));
        return data
    }
}

export const updateChannelAction = (channel) => async (dispatch) => {
    const response = await fetch(`api/channels/${channel.id}/edit`, {
        method: "PUT",
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify(channel)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateChannel(data));
        return data;
    }
}

export const deleteChannelAction = (channelId) => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}`, {
        method: "DELETE",
        headers: {'Content-Type': 'Application/json'},
        body: null
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteChannel(channelId));
        return data;
    }
}

const initalState = { allChannels: {}, singleChannelId: null};

const channelReducer = (state = initalState, action) => {
    let newState = {};
    switch(action.type) {
        case CREATE_CHANNEL: {
            newState = {...state};
            newState.allChannels = {...state.allChannels};
            newState.allChannels[action.channel.id] = action.channel;
            newState.singleChannelId = action.channel.id;
            return newState;
        }
        case GET_ONE_CHANNEL: {
            newState = {...state};
            newState.allChannels = {...state.allChannels};
            newState.singleChannelId = action.channel.id;
            return newState;
        }
        case GET_ALL_CHANNELS: {
            newState = {...state};
            newState.allChannels = {...state.allChannels};
            newState.singleChannelId = null;
            action.channels.channels.forEach((channel) => {
              newState.allChannels[channel.id] = channel;
            })
            return newState;
        }
        case EDIT_CHANNEL: {
            newState = {...state};
            newState.allChannels = {...state.allChannels};
            newState.singleChannelId = action.channel.id;
            newState.allChannels[action.channel.id] = action.channel
            return newState;
        }
        case DELETE_CHANNEL: {
            newState = {...state};
            newState.allChannels = {...state.allChannels};
            newState.singleChannelId = null;
            delete newState.allChannels[action.channelId];
            return newState;

        }
        default:
            return state;
    }
}

export default channelReducer;
