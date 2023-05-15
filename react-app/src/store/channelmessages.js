import { normalizeFn } from "./channels";

const GET_ALL_CHANNEL_MESSAGES = "channelmessages/all";
const SEND_CHANNEL_MESSAGE = "channelmessages/send";

const getChannelMessages = (messages) => {
    return {
        type: GET_ALL_CHANNEL_MESSAGES,
        messages
    }
}

export const sendChannelMessage = (message) => {
    return {
        type: SEND_CHANNEL_MESSAGE,
        message
    }
};


export const fetchChannelMessagesThunk = (channelId) => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}`);

    if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        const messages = normalizeFn(data.channel.channel_messages);
        dispatch(getChannelMessages(messages));
        return messages;
    }
}

export const sendChannelMessageThunk = (message, channelId) => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}/messages/new`, {
        method: "POST",
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify(message)
    })


    if (response.ok) {
        const data = await response.json();
        dispatch(sendChannelMessage(data));
        return data;
    }

}



const initialState = { messages: {} };

const channelMessageReducer = (state = initialState, action) => {

    switch(action.type) {
        case GET_ALL_CHANNEL_MESSAGES: {
            return {
                ...state,
                messages: { ...action.messages}
            }
        };
        case SEND_CHANNEL_MESSAGE: {
            return {
                ...state,
                messages: {...state.messages, [action.message.id]: action.message}
            }
        }
        default:
            return state;
    }
}

export default channelMessageReducer;
