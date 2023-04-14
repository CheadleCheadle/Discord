import React from 'react';
import './Button.css';
// import { useModal } from '../../context/Modal';

const STYLES = [
  'btn--primary',
  'btn--demo',
];
const SIZES = [
  'btn--medium'
];


const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  disableButton,
  value,
  // modalComponent,
  // onModalClose
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[ 0 ];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[ 0 ];



  return (
    <div className='btn-mobile'>
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
        disabled={disableButton || false}
        value={value}
      >
        {children}
      </button>
    </div>
  )
}

export default Button;
