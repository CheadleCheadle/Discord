import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { deleteChannelAction } from "../../../store/channels";
export default function DeleteEditChannel({channelId, serverId}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

    const handleDelete = () => {
        history.replace(`/servers/${serverId}`);
        dispatch(deleteChannelAction(channelId))
        .then(() => {
            closeModal()
        })
    }

    return (
        <div className="svr-delete-server-form-container">
        <div>
            <h3>Confirm Delete</h3>
        </div>
        <div>
            <p>Are you sure you want to remove this channel?</p>
        </div>


        <button onClick={() => handleDelete()} className="svr-delete-server-button">Yes (Delete Channel)</button>
        <button className="svr-cancel-delete-server-button">No (Keepy Channel)</button>
        </div>
    )

}
