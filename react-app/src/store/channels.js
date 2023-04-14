
const GET_ALL_CHANNELS = "channels/all";
const GET_ONE_CHANNEL = "channels/one";
const CREATE_CHANNEL = "channels/new";
const EDIT_CHANNEL = "channel/edit";
const DELETE_CHANNEL = "channel/delete";
const NEW_MESSAGE = "channel/message/new";
const ALL_MESSAGES = "channel/messages"
const UPDATE_SINGLE_CHANNEL_ID = "channel/singleChannelId/Update"

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

export const updateSingleChannelId = (channelId) => {
    return {
        type: UPDATE_SINGLE_CHANNEL_ID,
        channelId
    }
}

export const deleteChannel = (channelId) => {
    return {
        type: DELETE_CHANNEL,
        channelId
    }
}
export const newMessage = (message, channelId) => {
    return {
        type: NEW_MESSAGE,
        message,
        channelId
    }
}

export const allMessages = (payload) => {
    return {
        type: ALL_MESSAGES,
        payload
    }
}

export const thunkUpdateSingleChannelId = (channelId) => async (dispatch) => {
    dispatch(updateSingleChannelId(channelId))
    return
}

export const getServerChannels = (serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels`);

    if (response.ok) {
        const data = await response.json();
        const normalizeData = normalizeFn(data.channel)
        for (let i in normalizeData) {
            normalizeData[ i ].channel_messages = normalizeFn(normalizeData[ i ].channel_messages)
        }
        dispatch(loadServerChannels(normalizeData));
        return normalizeData;
    }

    return;
}

export const createChannelAction = (channel, serverId) => async (dispatch) => {
    const response = await fetch(`/api/servers/${serverId}/channels/new`, {
        method: "POST",
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(channel)
    });


    if (response.ok) {
        const data = await response.json();
        dispatch(createChannel(data));
        return data
    }
}

export const updateChannelAction = (channel) => async (dispatch) => {
    const response = await fetch(`api/channels/${channel.id}/edit`, {
        method: "PUT",
        headers: { 'Content-Type': 'Application/json' },
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
        headers: { 'Content-Type': 'Application/json' },
        body: null
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteChannel(channelId));
        return data;
    }
}

export const newChannelMessageAction = (message, channelId) => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}/messages/new`, {
        method: "POST",
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(message)
    })


    if (response.ok) {
        const data = await response.json();
        dispatch(newMessage(data, channelId));
        return data;
    }

}

export const allMessagesAction = (channelId) => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}/messages`)
    if (response.ok) {
        const data = await response.json();
        // const messages = data.length ? normalizeFn(data) : {}
        const payload = {
            data,
            channelId
        }
        const channelMessages = normalizeFn(data.channel_messages)
        data.channel_messages = channelMessages
        console.log('I WANT THISSSSSSSSSSS', data.channel_messages)
        dispatch(allMessages(payload))
        return channelId;
    }
}

export const normalizeFn = (data) => {
    const normalizeData = {};
    data.forEach((val) => normalizeData[ val.id ] = val);
    return normalizeData;
};




const initalState = { allChannels: {}, singleChannelId: null };

const channelReducer = (state = initalState, action) => {
    let newState = {};
    switch (action.type) {
        case CREATE_CHANNEL: {
            newState = { ...state };
            newState.allChannels = { ...state.allChannels };
            newState.allChannels[ action.channel.id ] = action.channel;
            newState.singleChannelId = action.channel.id;
            return newState;
        }
        case GET_ONE_CHANNEL: {
            newState = { ...state };
            newState.allChannels = { ...state.allChannels };
            newState.singleChannelId = action.channel.id;
            return newState;
        }
        case GET_ALL_CHANNELS: {
            newState = {
                ...state,
                allChannels: {
                    ...action.channels
                }
            };
            return newState;
        }
        case EDIT_CHANNEL: {
            console.log(action)
            newState = {
                ...state,
                allChannels: {
                    ...state.allChannels,
                    [ action.channel.id ]: { ...action.channel }
                }
            };
            return newState;
        }
        case DELETE_CHANNEL: {
            newState = {
                ...state,
                allChannels: {
                    ...state.allChannels
                }
            };
            newState.singleChannelId = null;
            delete newState.allChannels[ action.channelId ];
            return newState;
        }
        case NEW_MESSAGE: {
            console.log("STAAAAAAAAAAAAAAAAAAAAAAAATE", state)
            newState = {
                ...state,
                allChannels: {
                    ...state.allChannels,
                    [ action.channelId ]: {
                        ...state.allChannels[ action.channelId ],
                        channel_messages: {
                            ...state.allChannels[ action.channelId ].channel_messages,
                            [ action.message.id ]: {
                                ...action.message
                            }
                        }
                    }
                }
            }
            return newState;
        }
        case UPDATE_SINGLE_CHANNEL_ID: {
            newState = { ...state }
            newState.singleChannelId = action.channelId
            return newState
        }
        case ALL_MESSAGES: {
            console.log("ALL MESSAGES ACTION", action.payload)
            newState = {
                ...state,
                allChannels: {
                    ...state.allChannels,
                    [ action.payload.channelId ]: {
                        ...state.allChannels[ action.payload.channelId ],
                        channel_messages: { ...action.payload.data.channel_messages }

                    }
                }
            }
            return newState;
        }
        default:
            return state;
    }
}

export default channelReducer;
