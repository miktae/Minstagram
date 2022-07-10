import React, { useState, useEffect } from "react";
import {
	Outlet,
	NavLink,
	useResolvedPath,
	useMatch,
	Link,
} from "react-router-dom";
import { auth, storage, db } from "../firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
	signOut,
	sendPasswordResetEmail,
} from "firebase/auth";
import {
	addDoc,
	serverTimestamp,
	collection,
	where,
	onSnapshot,
	query,
	getDocs,
} from "firebase/firestore";
import {
	ref,
	uploadBytesResumable,
	getDownloadURL
} from "firebase/storage";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Input } from '@material-ui/core';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import ModalReminder from './ModalReminder';
import "./Navbar.css";
import { async } from "@firebase/util";
import { Avatar } from "@mui/material";

const getModalStyle = () => {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 300,
		minHeight: 300,
		fontSize: "1rem",
		textAlign: "center",
		borderRadius: "12px",
		backgroundColor: theme.palette.background.paper,
		border: "2px solid transparent",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2.6, 4, 3),
	},
}));

const CustomLink = (props) => {
	let resolved = useResolvedPath(props.to)
	let match = useMatch({ path: resolved.pathname, end: true })
	return (
		<NavLink to={props.to}>
			<i className={match ? 'bx bxs-' + props.iconName
				: 'bx bx-' + props.iconName}>
				{props.children}
			</i>
		</NavLink>
	);
}

export default function Navbar() {
	const [openLogInModal, setOpenLogInModal] = useState(false); // Check open modal
	const [openSignUpModal, setOpenSignUpModal] = useState(false)
	const [openForgotPasswordModal,
		setOpenForgotPasswordModal] = useState(false)
	const [openNextSignUp, setOpenNextSignUp] = useState(false)
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [user, setUser] = useState(null);
	const [search, setSearch] = useState('');
	const [searchIcon, setSearchIcon] = useState(true);
	const [searchDatas, setSearchDatas] = useState([])
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [openModalUpload, setOpenModalUpload] = useState(false);
	const [userSettings, setUserSettings] = useState(false);
	const [file, setFile] = useState(null);
	const [avatarfile, setAvatarFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [caption, setCaption] = useState("");
	const [imgDownloadUrl, setImgDownloadUrl] = useState("");
	const [value, onChange] = useState(new Date());
	// const postsCollectionRef = collection(db, "posts");

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// user has logged in...
				setUser(user);
				// console.log(user);
			}
			else {
				// user has logged out...
				setUser(null);
			}
		});
	}, [user, username]);

	const handleSignUp = (event) => {
		event.preventDefault();
		if (email === "" || password === "" || username === "") {
			alert("Please fill in all fields");
		}
		if (password.length < 8) {
			alert("Password must be at least 8 characters");
		}
		if (avatarfile === null) {
			alert("Please upload an avatar");
		}
		if (new Date().getFullYear() - value.getFullYear() < 16) {
			alert("You must be 16 years or older to sign up");
		}

		const storageRef = ref(storage, `files/${avatarfile.name}`);
		const uploadTask = uploadBytesResumable(storageRef, avatarfile);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const prog = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(prog);
			},
			(error) => console.log(error),
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((avatarURL) => {
					createUserWithEmailAndPassword(auth, email, password)
						.then((userCredential) => {
							// Signed up
							// user = userCredential.user;
							// update profile
							updateProfile(auth.currentUser, {
								displayName: username,
								photoURL: avatarURL,
							})
							// Add user to database
							addDoc(db, "users", {
								email: email,
								username: username,
								avatarURL: avatarURL,
								createdAt: serverTimestamp(),
							})
						})
						.catch((error) => {
							const errorCode = error.code;
							const errorMessage = error.message;
							console.log(errorCode, errorMessage);
							// ..
						});
				});
			}
		);
		setOpenSignUpModal(false);
	}

	const handleNextSignup = (e) => {
		e.preventDefault();
		setOpenNextSignUp(true);
	}

	const handleAvatarChange = (e) => {
		setAvatarFile(e.target.files[0]);
	}

	const handleSignIn = (event) => {
		event.preventDefault();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				alert(errorCode, errorMessage);
			});
		setOpenLogInModal(false);
	}

	const handleForgot = (event) => {
		event.preventDefault();
		sendPasswordResetEmail(auth, email)
			.then(() => {
				alert("Password reset email sent");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				alert(errorCode, errorMessage);
			});
		setOpenForgotPasswordModal(false);
	}

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	}

	const handleUploadForm = (event) => {
		event.preventDefault();
		console.log(file);
		uploadFiles(file);
	};

	const uploadFiles = (file) => {
		if (!file) return null;
		const storageRef = ref(storage, `files/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		const postsCollectionRef = collection(db,
			auth.currentUser.displayName + "'s_posts");
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const prog = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(prog);
			},
			(error) => console.log(error),
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImgDownloadUrl(downloadURL);
					addDoc(postsCollectionRef, {
						avatarSrc: './assets/avatar/avatar.jpg',
						timestamp: serverTimestamp(),
						caption,
						imageSrc: downloadURL,
						username: user.displayName,
					})
				});
				setOpenModalUpload(false);
			}
		);
	};

	const LogOut = () => {
		signOut(auth).then(() => {
			console.log("signed out");
		}).catch((error) => {
			// An error happened.
		});
	}

	const handleOpenLoginModal = () => {
		setOpenLogInModal(true);
	}

	const handleOpenSignUpModal = () => {
		setOpenSignUpModal(true);
	}

	const Search = (e) => {
		e.preventDefault();
		const usersCollectionRef = collection(db, "users");
		// console.log(q);
		const q = query(usersCollectionRef, where("userName", "==", search));
		onSnapshot(q, (snapshot) => {
			console.log(search);
			// console.log(snapshot.docs.map(doc => ({
			// 	...doc.data() 
			// })));
			setSearchDatas(snapshot.docs.map(doc => ({
				...doc.data(),
			})))
		})
		console.log(searchDatas);
	}

	return (
		<>
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
						<div className="header__search-input">
							{
								searchIcon &&
								<i className="bx bx-search-alt-2"></i>
							}
							<input type="text" placeholder="Search"
								onChange={(e) => {
									setSearch(e.target.value)
								}}
								onKeyUp={Search}
								onFocus={() => {
									setSearchIcon(false)
								}}
								onBlur={() => {
									setSearchIcon(true)
								}}
							/>
						</div>
						<div className="header__search-list"
							style={searchDatas.length ? { display: "block" }
								: { display: "none" }}>
							<ul className="header__search-ul">
								{
									searchDatas.map((data, index) => {
										return (
											<li key={index}>
												<a href={`/profile/${data.userName}`}>
													<Avatar src={data.avatarSrc}
														alt="avatar" />
													&nbsp;&nbsp;
													<span>
														{data.userName}
													</span>
												</a>
											</li>											
										)
									}
									)
								}
							</ul>
						</div>
					</div>
					<div className="header__login">
						{
							user ? (
								<div className="user-container">
									<CustomLink to="/Minstagram/"
										iconName="home-circle">
									</CustomLink>
									<CustomLink to="/Minstagram/inbox"
										iconName="chat">
									</CustomLink>
									<button className="btn btn-upload" onClick={() => setOpenModalUpload(true)}>
										<i className="far fa-plus-square"></i>
									</button>
									<CustomLink to="/Minstagram/explore"
										iconName="compass">
									</CustomLink>
									<div onClick={() => setUserSettings(!userSettings)}>
										{

											user.photoURL ?
												<img className="user-avatar"
													src={user.photoURL} alt="avatar" /> :
												user.displayName

										}</div> &ensp;
									{
										userSettings &&
										<div className="user-settings">
											<div>Profile</div>
											<div>Saved</div>
											<div>Settings</div>
											<div>Switch Account</div>
										</div>
									}
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
										onClick={handleOpenLoginModal}
										variant="contained"
										size="small"
										className="btn btn-login"
									>
										Log in
									</button>
									<button
										onClick={handleOpenSignUpModal}
										className="btn btn-sign-up"
									>
										Sign up
									</button>
								</div>
							)}
					</div>
				</div>
				{/* Modal sign up */}
				<Modal open={openSignUpModal} onClose={() => setOpenSignUpModal(false)}>
					<div style={modalStyle} className={classes.paper}>
						<form className="form__signup">
							<img className="form__logo"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Logo"
							/>
							{
								openNextSignUp ? <>
									<div className="form__group">
										<label htmlFor="avatar">
											Avatar:
										</label>
										<input
											className="form__field"
											type="file"
											onChange={handleAvatarChange}
										/>
									</div>
									<div className="form__group">
										<label htmlFor="birthday">Birthday:</label>
										<DatePicker onChange={onChange} value={value} />
									</div>
									<button className="btn btn-back" style={{
										marginTop: "0.6rem"
									}}
										onClick={() => setOpenNextSignUp(false)}>Back</button>
									&nbsp;&nbsp;
									<button className="btn btn-login" style={{
										marginTop: "0.6rem"
									}}
										onClick={handleSignUp}>Sign Up</button>
								</> :
									<>
										<div className="form__group" style={{ marginTop: "1rem" }}>
											<Input className="form__field" placeholder="Username"
												type="text" value={username} onChange={
													(e) => setUsername(e.target.value)
												} />
										</div>
										<div className="form__group">
											<Input className="form__field" placeholder="Email"
												type="email" value={email} onChange={
													(e) => setEmail(e.target.value)
												} />
										</div>
										<div className="form__group">
											<Input className="form__field" placeholder="Password"
												type="password"
												autoComplete=""
												value={password} onChange={
													(e) => setPassword(e.target.value)}
											/>
										</div>
										<button className="btn btn-login" style={{
											marginTop: "0.6rem"
										}}
											onClick={handleNextSignup}>Next</button>
									</>
							}
						</form>
					</div>
				</Modal>
				{/* Modal log in */}
				<Modal open={openLogInModal} onClose={() => setOpenLogInModal(false)}>
					<div style={modalStyle} className={classes.paper}>
						<form className="form__login">
							<img className="form__logo"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Logo"
							/>
							<div className="form__group">
								<Input className="form__field" placeholder="Email"
									type="text" value={email}
									onChange={(e) => setEmail(e.target.value)} />
							</div>
							<div className="form__group">
								<Input className="form__field"
									placeholder="Password" type="password"
									value={password} onChange={(e) => setPassword(e.target.value)} />
							</div>
							<div className="form__forgot">
								<Link to="/Minstagram/"
									onClick={() => {
										setOpenForgotPasswordModal(true)
										setOpenLogInModal(false)
									}}
								>
									Forgot Password
								</Link>
							</div><button className="btn btn-login"
								onClick={handleSignIn}>Log In</button>
						</form>
					</div>
				</Modal>
				{/* Modal forgot password */}
				<Modal open={openForgotPasswordModal}
					onClose={() => setOpenForgotPasswordModal(false)}>
					<div style={modalStyle} className={classes.paper}>
						<form className="form__login">
							<img className="form__logo"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Logo"
							/>
							<div className="form__group">
								<Input className="form__field" placeholder="Email"
									type="text" value={email}
									onChange={(e) => setEmail(e.target.value)} />
							</div>
							<button className="btn btn-login"
								onClick={handleForgot}>Send Password Reset Email
							</button>
						</form>
					</div>
				</Modal>
				{/* Modal upload */}
				<Modal open={openModalUpload} onClose={() => setOpenModalUpload(false)}>
					<div style={modalStyle} className={classes.paper}>
						<form onSubmit={handleUploadForm} className="form__signup">
							<img className="form__logo"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Logo"
							/>
							<div className="form__group">
								<progress value={progress} max="100" />
							</div>
							<div className="form__group">
								<img src={imgDownloadUrl} />
								<Input
									className="form__field"
									placeholder="Enter a caption"
									type="text"
									value={caption}
									onChange={(e) => setCaption(e.target.value)}
								/>
							</div>
							<div className="form__group">
								<input
									className="form__field"
									type="file"
									onChange={handleFileChange}
								/>
							</div>
							<button type="submit" className="btn btn-login" >
								Upload
							</button>
						</form>
					</div>
				</Modal>
			</div>
			{user ? <Outlet /> : <ModalReminder />}
		</>
	);
}
