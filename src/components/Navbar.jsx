import React, { useState } from "react";
import { auth } from "../firebase";
import {
	signOut
} from "firebase/auth";
import "./Navbar.css";

export default function Navbar(props) {
	const [openModal, setOpenModal] = useState(true);
	const [logIn, setLogIn] = useState(false);
	const [addNew, setAddNew] = useState(false);

	const transferMesageSignUp = () => {
		setOpenModal(true);
		props.takeMessSignUp(openModal);
	};

	const LogOut = () => {
		signOut(auth).then(() => {
			console.log("signed out");
		}).catch((error) => {
			// An error happened.
		});
	}

	const transferMessageLogIn = () => {
		setLogIn(true);
		props.takeMessLogIn(logIn);
	}

	const transferMessageAddNewPost = () => {
		setAddNew(true);
		props.takeMessAddNewPost(addNew);
	}

	return (
		<div className="container">
			<div className="header">
				<div className="header__logo">
					<a href="/#">
						<img
							src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
							alt="Logo"
						/>
					</a>
				</div>
				<div className="header__search">
					<input type="text" placeholder="Search" />
					<i className="bx bx-search-alt-2"></i>
				</div>
				<div className="header__login">
					{
						props.user ? (
							<div className="user-container">
								<i class='bx bx-home-circle'></i>
								<i class='bx bx-chat'></i>
								<i class='bx bx-compass'></i>
								<button className="btn btn-upload" onClick={transferMessageAddNewPost}>
									<i className="far fa-plus-square"></i>
								</button>
								{
									props.user.displayName
								} &ensp;
								<button
									onClick={LogOut}
									className="btn btn-login"
								>
									Log out
								</button>

							</div>
						) : (
							<div>
								<button
									onClick={transferMessageLogIn}
									variant="contained"
									size="small"
									className="btn btn-login"
								>
									Log in
								</button>
								<button
									onClick={transferMesageSignUp}
									className="btn btn-sign-up"
								>
									Sign up
								</button>
							</div>
						)}
				</div>
			</div>
		</div>
	);
}