import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import PostItem from './components/PostItem'
import { db } from "./firebase";
import {
  collection,
  onSnapshot
} from "firebase/firestore";

function App() {
  const [posts, setPosts] = useState([])

  const postsCollectionRef = collection(db, "posts");

  useEffect(() => onSnapshot(postsCollectionRef, (snapshot) => {
    setPosts(snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })))
  }), []);

  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="Post__list">
        {
        posts.map(post => (
          <PostItem key={post.id} {...post}></PostItem>
        ))}
      </div>
    </div>
  )
}

export default App
