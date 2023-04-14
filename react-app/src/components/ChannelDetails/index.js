import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { allMessages, allMessagesAction, newChannelMessageAction } from "../../store/channels.js";
// import { allMessagesAction } from "../../store/channels.js";
import { update } from "lodash";
import { thunkUpdateSingleChannelId } from "../../store/channels.js";
export default function Channel() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();
    const [ isLoaded, setIsLoaded ] = useState(false);
    useEffect(() => {
        dispatch(thunkUpdateSingleChannelId(channelId))
            .then(() => setIsLoaded(true))
    }, [ dispatch, channelId ])

    const channel = useSelector(state => state.channels.allChannels[ channelId ])
    const channelMessages = Object.values(channel.channel_messages)
    const [ message, setMessage ] = useState("");
    // const [ startMessageFetch, setStartMessageFetch ] = useState(false)
    // const channels = useSelector(state => state.channels);
    // const channelId = channels.SingleChannelId;
    // if (channel.id) setStartMessageFetch(true)
    //const channelId = useSelector(state => state.channels.SingleChannelId);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = {
            channelId,
            content: message
        };
        dispatch(newChannelMessageAction(newMessage, channelId));
    }
    // setReRenderMe(true);
    // const memoizedDispatch = useMemo(() => {
    // }, [dispatch])

    // useEffect(() => {
    //     memoizedDispatch(allMessageAction(channel.id))
    // }, [memoizedDispatch]);
    // }, dispatch)


    // const dispatchFunc = useCallback(() => {
    //     if (startMessageFetch) dispatch(allMessagesAction(channel.id));
    // }, [ dispatch ])

    // useEffect(() => {
    //     const updateMessages = setInterval(() => {
    //         dispatchFunc();
    //         console.log('Im updating')
    //     }, 3000)
    //     return () => {
    //         clearTimeout(updateMessages);

    //     };
    // }, [ dispatchFunc ])

    return (
        <>
            {isLoaded && (
                <>
                    <div>
                        {channelMessages.map((message) => (
                            <div key={message.id}>
                                {message.content}

                            </div>
                        ))}
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder={`Message`} value={message} onChange={(e) => setMessage(e.target.value)} />
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </>
            )}
        </>
    )

}
