import {useParams} from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function Server({sessionUser}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const server = useSelector(state => state.servers[state.servers.singleServerId]);

    return (

        <>
        <div>
            <div>
            </div>

            <div>

            </div>

            <div>

            </div>

        </div>
        </>




    )

}
