import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import PostItem from "./components/PostItem";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  onSnapshot
} from "firebase/firestore";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Input } from '@material-ui/core';

function getModalStyle() {
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

function App() {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Check open modal
  const [openSignInModal, setOpenSignInModal] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const postsCollectionRef = collection(db, "posts");

  useEffect(() => onSnapshot(postsCollectionRef, (snapshot) => {
    setPosts(snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })))
  }), []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // user has logged in...
        setUser(user);
        console.log(user);
      } else {
        // user has logged out...
        setUser(null);
      }
    });
  }, [user, username]);

  const handleClickSignUp = (childData) => {
    setOpenModal(childData);
  }

  const handleClickSignIn = (childData) => {
    setOpenSignInModal(childData);
  }

  const handleSignUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // update profile
        updateProfile(auth.currentUser, {
          displayName: username,
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
    setOpenModal(false);
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
      });
    setOpenSignInModal(false);
  }

  return (
    <div className="App">
      {/* Navbar */}
      <Navbar takeMessSignUp={handleClickSignUp}
        takeMessLogIn={handleClickSignIn}
        user={user} />
      {/* Posts */}
      <div className="Post__list">
        {
          posts.map(post => (
            <PostItem key={post.id} {...post}></PostItem>
          ))}
      </div>
      {/* Modal sign up */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="form__signup">
            <img className="form__logo"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Logo"
            />
            <div className="form__group" style={{ marginTop: "1rem" }}>
              <Input className="form__field" placeholder="Username"
                type="text" value={username} onChange={
                  (e) => setUsername(e.target.value)
                } />
            </div>
            <div className="form__group">
              <Input className="form__field" placeholder="Email"
                type="text" value={email} onChange={
                  (e) => setEmail(e.target.value)
                } />
            </div>
            <div className="form__group">
              <Input className="form__field" placeholder="Password"
                type="password" value={password} onChange={
                  (e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-login" style={{
              "margin-top": "0.6rem"
            }}
              onClick={handleSignUp}>Sign up
            </button>
          </form>
        </div>
      </Modal>
      {/* Modal log in */}
      <Modal open={openSignInModal} onClose={() => setOpenSignInModal(false)}>
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
    </div>
  );
}

export default App;