import { normalizeFn } from "./channels";

const GET_ALL_MESSAGES = "directmessages/all";
const SEND_MESSAGE = "directmessages/send";

const getMessages = (messages) => {
    return {
        type: GET_ALL_MESSAGES,
        messages
    };
}

const sendMessage = (message) => {
    return {
        type: SEND_MESSAGE,
        message
    }
}

export const sendMessageThunk = (userId, friendId, content) => async (dispatch) => {
    const newMessage = { content, userId};
    const response = await fetch(`/api/users/messages/new/${friendId}`, {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(newMessage)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(sendMessage(data));
        return data;
    }
}

export const fetchMessages = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/curr/messages/recipient/${userId}`);

    if (response.ok) {
        const data = await response.json();
        const messages = normalizeFn(data);
        dispatch(getMessages(messages));
        return messages;
    }
}


const initialState = { messages: {} };

const messageReducer = (state = initialState, action) => {
    let newState = {};

    switch (action.type) {
        case GET_ALL_MESSAGES: {
            return {
                ...state,
                messages: { ...action.messages }
            }
        };
        case SEND_MESSAGE: {
            return {
                ...state,
                messsages: {...state.messages, [action.message.id]: action.message}
            }
        }
        default:
            return state;
    }
}

export default messageReducer;
