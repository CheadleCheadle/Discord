import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./Server.css";
import { loadServerChannel, loadServerChannels} from "../../store/channels.js"
export default function Server({sessionUser}) {
    const history = useHistory();
    const dispatch = useDispatch();
    //allServers[state.servers.SingleServer.id]
    const server = useSelector(state => state.servers.allServers[1]);
    console.log("current server", server)
    let currentChannel = useSelector(state => state.channels.allChannels[state.channels.singleChannelId]);
    console.log("Here is the currentChannel1", currentChannel);

    const loadChannel = (channel) => {
        dispatch(loadServerChannel(channel))
        currentChannel = channel

    console.log("Here is the currentChannel2", currentChannel);
    }

    useEffect(() => {
        dispatch(loadServerChannels({channels:server.channels}))
    dispatch(loadServerChannel(server.channels[0]))

    }, [server])
    return (

        <>
        <div className="svr-channel-wrapper">
            <div>
            {server?.channels.map((channel) => ( 
                <div key={channel.id} onClick={() => loadChannel(channel)}>
                    {channel.name}
                </div>
        ))}
            </div>
            <div>
            {currentChannel.channel_messages.map((message) => (
                <div key={message.id}>
                {message.content}
                </div>
            ))}
            </div>

            <div>

            </div>

        </div>
        </>




    )

}
