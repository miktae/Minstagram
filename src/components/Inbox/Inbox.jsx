import React, { useState } from 'react'
import {
  Outlet,
  useParams,
} from "react-router-dom";
import { auth } from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./Inbox.css";
import UserItem from './UserItem';
import { Avatar, Input } from '@material-ui/core';

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

function Inbox() {
  let { user } = useParams();
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openLogInModal, setOpenLogInModal] = useState(false);
  const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
				console.log(errorCode, errorMessage);
			});
		setOpenLogInModal(false);
	}

  const handleSendMessage = (user) => {
    setOpenSendModal(true);
  }

  return (
    <div className="Chat">
      <div className="Chat-frame">
        <div className="Chat-user-view">
          <div className="Chat-username">
            <div className="Chat-select"
            onClick={() => setOpenLogInModal(true)}>
              <select name="Chat-user" id="Chat-user-name">      
                  <option value={ auth.currentUser.uid}>
                     {auth.currentUser.displayName} 
                </option>
              </select>
            </div>
            <div className="Chat-edit">
              <i className='bx bx-edit'
              ></i>
            </div>
          </div>
          <div className="Chat-user-list">
            <UserItem name='My cloud'
             to="/Minstagram/inbox/mycloud"/>
            <UserItem />
          </div>
        </div>
        {
          !user ?
            <div className="Chat-user-message">
              <svg aria-label="Direct" className="_8-yf5 "
                color="#262626" fill="#262626" height="96"
                role="img" viewBox="0 0 96 96" width="96">
                <circle cx="48" cy="48" fill="none" r="47"
                  stroke="currentColor" strokeLinecap="round"
                  strokeLinejoin="round" strokeWidth="2"></circle>
                <line fill="none" stroke="currentColor"
                  strokeLinejoin="round" strokeWidth="2"
                  x1="69.286" x2="41.447" y1="33.21" y2="48.804"></line>
                <polygon fill="none"
                  points="47.254 73.123 71.376 31.998 24.546
       32.002 41.448 48.805 47.254 73.123"
                  stroke="currentColor" strokeLinejoin="round"
                  strokeWidth="2"></polygon></svg>
              <p>Your Messages</p>
              <p>Send private photos and messages to a friend or group.</p>
              <button className="btn btn-prim"
                onClick={handleSendMessage}>Send Message</button>
            </div>
            : <Outlet />
        }
      </div>
      {/* Modal send messages */}
      <Modal open={openSendModal} onClose={() => setOpenSendModal(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="form-send">
            <div className="form-title">
              <i className="bx bx-x"
                onClick={() => setOpenSendModal(false)}
              ></i>
              <div className="form-h1">
                New message
              </div>
              <div className="form-next">
                Next
              </div>
            </div>
            <div className="form-to">
              <label htmlFor="to">To:</label>
              <input type="text"
                id="to" name="to"
                placeholder="Name" />
            </div>
            <div className="form-group">
              <div className="form-user">
              <Avatar ></Avatar>
              <p>Zei</p>
            </div>
        </div>
      </form>
    </div>
      </Modal >
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
							<button className="btn btn-login"
								onClick={handleSignIn}>Log In</button>
						</form>
					</div>
				</Modal>
    </div >
  )
}

export default Inbox