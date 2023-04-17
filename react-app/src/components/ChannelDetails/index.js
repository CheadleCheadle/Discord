import { useParams } from "react-router-dom"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { allMessages, newChannelMessageAction, thunkGetAllMessages } from "../../store/channels.js";
// import { allMessagesAction } from "../../store/channels.js";
import { update } from "lodash";
import { thunkUpdateSingleChannelId } from "../../store/channels.js";
import "./channel.css"
export default function Channel() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();
    // const channelId = useSelector(state => state.channels.SingleChannelId);
    const [ isLoaded, setIsLoaded ] = useState(false);
    const channelId2 = useSelector(state => state.channels.SingleChannelId);
    useEffect(() => {
        dispatch(thunkUpdateSingleChannelId(channelId))
            .then(() => setIsLoaded(true))
    }, [ dispatch, channelId ])

    const channel = useSelector(state => state.channels.allChannels[ channelId ])
    //Conditional is needed because a newly created channel doesn't have messages
    if (!channel.channel_messages) {
        channel.channel_messages = {};
    }
    const channelMessages = Object.values(channel.channel_messages)

    const [ message, setMessage ] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = {
            channelId,
            content: message
        };
        dispatch(newChannelMessageAction(newMessage, channelId));
    }


    return (
        <>
            {isLoaded && (
                <>
                    <div className="chnl-messages-cont">
                        {channelMessages.map((message) => (
                            <div id="all-msgs" key={message.id}>
                                <p>{message.content}</p>
                            </div>
                        ))}

                        <div className="chnl-form-cont">
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder={`Message`} value={message} onChange={(e) => setMessage(e.target.value)} />
                                <input type="submit" value="Submit" />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )

}
