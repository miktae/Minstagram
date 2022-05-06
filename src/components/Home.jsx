import React, { useState, useEffect } from 'react';
import PostItem from "./PostItem";
import { db } from "../firebase";
import {
    collection,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore";

function Home() {
    const [posts, setPosts] = useState([]);
    const postsCollectionRef = collection(db, "posts");
    const q = query(postsCollectionRef, orderBy('timestamp', 'desc'));

    useEffect(() => onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })))
    }), []);

    return (
        <>
            {/* Posts */}
            <div className="Post__list">
                {
                    posts.map(post => (
                        <PostItem key={post.id} {...post}></PostItem>
                    ))}
            </div>
        </>
    )
}

export default Home