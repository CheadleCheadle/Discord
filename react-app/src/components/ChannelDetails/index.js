import {useParams} from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory} from "react-router-dom";
import { newChannelMessageAction } from "../../store/channels.js";
export default function Channel({channel}) {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    console.log("Channel:", channel)
    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = {
            channelId: channel.id,
            content: message
        };
        dispatch(newChannelMessageAction(newMessage, channel.id));
    }


    return (
        <>
        <div>
        {channel?.channel_messages.map((message) => (
            <div key={message.id}>
            {message.content}
            </div>
        ))}
        </div>
            <div>
                <form onSubmit={handleSubmit}>
                  <input type="text" placeholder={`Message`} value={message} onChange={(e) => setMessage(e.target.value)}/>
                  <input type="submit" value = "Submit"/>
                </form>
            </div>
        </>
    )

}
