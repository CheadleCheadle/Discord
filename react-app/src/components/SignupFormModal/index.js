import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { login, signUp } from "../../store/session";
import "./SignupForm.css";
import { useHistory } from "react-router-dom";
import Button from "../Button";
import LoginFormModal from "../LoginFormModal";
import OpenModalButton from "../OpenModalButton";

function SignupFormModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [ email, setEmail ] = useState("");
	const [ username, setUsername ] = useState("");
	const [ firstname, setFirstName ] = useState("");
	const [ lastname, setLastName ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ confirmPassword, setConfirmPassword ] = useState("");
	const [ errors, setErrors ] = useState([]);
	const { closeModal } = useModal();

	const disableBool = () => {
		if (!email || !firstname || !username || !lastname || !password || !confirmPassword) return true
		if (password !== confirmPassword) return true;
		return false;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			console.log(username, email, password, firstname, lastname)
			const data = await dispatch(signUp(username, email, password, firstname, lastname));
			console.log("DATA", data)
			if (data.errors) {
				return setErrors(data.errors);
			}
			await dispatch(login(email, password))
			closeModal()
			history.push('/servers')
			return;
		} else {
			return setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	const disableButtonBool = disableBool()

	return (
		<div id='signup'>
			<h1 id="signup__title">Create An Account</h1>
			<form id='signup__form' onSubmit={handleSubmit}>
				<ul id='signup__error-list'>
					{errors?.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<label id='signup__label'>
					Email
				</label>
				<input
					className='signup__input'
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<label id='signup__label'>
					Username
				</label>
				<input
					className='signup__input'
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<label id='signup__label'>
					FirstName
				</label>
				<input
					className='signup__input'
					type="text"
					value={firstname}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
				<label id='signup__label'>
					LastName
				</label>
				<input
					className='signup__input'
					type="text"
					value={lastname}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
				<label id='signup__label'>
					Password
				</label>
				<input
					className='signup__input'
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<label id='signup__label'>
					Confirm Password
				</label>
				<input
					className='signup__input'
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
			</form>
			<Button
				disableButton={disableButtonBool}
				buttonStyle='btn--login'
				buttonSize='btn--wide'
				onClick={handleSubmit}
			>
				Sign Up
			</Button>
			<OpenModalButton
				buttonText={'Have An Account? Login Here'}
				modalCSSClass={'login-form-link'}
				modalComponent={<LoginFormModal />}
			/>
		</div>
	);
}

export default SignupFormModal;
