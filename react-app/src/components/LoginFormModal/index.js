import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { Redirect, useHistory } from "react-router-dom";
import Button from "../Button";
import "./LoginForm.css";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
  const history = useHistory()
  const dispatch = useDispatch();
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal()
      history.push("/servers")
    }
  };

  return (
    <div id='log-in'>
      <h1 id="log-in__title">Welcome Back!</h1>
      <h2 id='log-in__h2'>We're so excited to see you again!</h2>
      <form id='log-in__form' onSubmit={handleSubmit}>
        <ul id='log-in__error-list'>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label id='log-in__label'>
          EMAIL
        </label>
        <input
          className='log-in__input'
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label id='log-in__label'>
          PASSWORD
        </label>
        <input
          className='log-in__input'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </form>
      <Button
        disableButton={(!email || !password) ? true : false}
        buttonStyle='btn--login'
        buttonSize='btn--wide'
        onClick={handleSubmit}
      >
        Log In
      </Button>
      <OpenModalButton
        buttonText={'Or Register Here'}
        modalCSSClass={'login-form-link'}
        modalComponent={<SignupFormModal />}
      />
    </div>
  );
}

export default LoginFormModal;
