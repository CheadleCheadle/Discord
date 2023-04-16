import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { updateSingleChannelId } from '../../store/channels';
import "./modal.css";
function OpenModalButton({
 modalComponent, // component to render inside the modal
 buttonText, // text of the button that opens the modal
 modalCSSClass,
 onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
 onModalClose,
 edit,
 channelId         // optional: callback function that will be called once the modal is closed
}) {
  const dispatch = useDispatch();
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
    if (edit) dispatch(updateSingleChannelId(channelId))
  };

 return (
  <button
   className={modalCSSClass ? modalCSSClass : "modal-button"}
   onClick={onClick}
  >
   {buttonText}
  </button>
 );
}

export default OpenModalButton;
