const CREATE_SERVER = "channels/new";

export const createChannel = (channel) => {
    return {
        type: CREATE_SERVER,
        channel
    }
}


export const createChannelAction = (channel) => async (dispatch) => {
    const response = await fetch(`/api/`)

}
