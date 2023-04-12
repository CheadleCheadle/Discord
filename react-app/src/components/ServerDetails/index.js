import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory} from "react-router-dom";
import "./Server.css";
import { loadServerChannel, loadServerChannels} from "../../store/channels.js"
import { thunkLoadAllServers } from "../../store/servers";
export default function Server({sessionUser}) {
    const history = useHistory();
    const params = useParams();
    const dispatch = useDispatch();
    let {serverId} = params;
    serverId = parseInt(serverId);
    //allServers[state.servers.SingleServer.id]
    const server = useSelector(state => state.servers.allServers[serverId]);
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
    //Make sure in the future to make sure that this dispatch fires somewhere else. Probs in nav files
    useEffect(() => {
        dispatch(thunkLoadAllServers());
    }, [])
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
            {currentChannel?.channel_messages.map((message) => (
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
