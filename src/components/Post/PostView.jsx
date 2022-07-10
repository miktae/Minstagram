import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
    onSnapshot,
    updateDoc,
    doc,
} from "firebase/firestore";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./PostItem.css";
import "./PostView.css";
import "./Calendar.css";
import { momentfromNow } from "../../moment";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../Inbox/store";

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
        width: '30%',
        fontSize: "1rem",
        textAlign: "center",
        borderRadius: "12px",
        backgroundColor: theme.palette.background.paper,
        border: "2px solid transparent",
        boxShadow: theme.shadows[5],
    },
}));

export default function PostView(props) {
    let { id } = useParams();
    let navigate = useNavigate();
    const openPostView = useStore((state) => state.openPostView)
    const setOpenPostView = useStore((state) => state.setOpenPostView)
    const [posts, setPosts] = useState([]);
    const [imageLoad, setImageLoad] = useState(false);
    const [openEditPost, setOpenEditPost] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [likePost, setLikePost] = useState(false);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle); const q = doc(db, auth.currentUser.displayName + "'s_posts", id)
    const [comments, setComments] = useState([]);
    const postEditMySelf = ["Delete", "Edit", "Unhide like count",
        "Turn off commenting", "Go to post", "Cancel"]
    let date = new Date();

    useEffect(() => {
        onSnapshot(q, (doc) => {
            // console.log(doc.data());
            // console.log(doc.id)
            setPosts({
                ...doc.data(),
                id: doc.id
            })
           // console.log(posts);
           // console.log(posts.id);
           // console.log(posts.comments.map(comment => comment.content));
        })
    }, [])

    const handleEditPost = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleLikePost = (id) => {
        console.log("like post ", id);
        setLikePost(!likePost);
    }

    const PostComment = async (id) => {
        console.log("comment ", id);
        let comment = document.getElementById(`comment_${id}`).value;
        console.log("comment ", comment);
        if (comment.length > 0) {
            setComments([...comments,
            {
                content: comment,
                id: id,
                at: new Date(),
                by: auth.currentUser.displayName,
            }
            ]
            )
           // console.log(comments)
            console.log("comment ", comment);
            try {
                await updateDoc(doc(db, auth.currentUser.displayName
                    + "'s_posts", id), {
                    comments: [...comments, {
                        content: comment,
                        id: id,
                        at: new Date(),
                        by: auth.currentUser.displayName,
                    }]
                }).then(() => {
                    document.getElementById(`comment_${id}`).value = ""
                })
            } catch (err) {
                alert(err)
            }
        }
    }

    return (
        <Modal open={openPostView} onClose={() => {
            navigate("/Minstagram/")
            setOpenPostView(false)
        }}>
            <div className="postview__container">
                {/* image */}
                <div className="postview__image">
                    {
                        <>
                            {
                                imageLoad ? (
                                    <img src={posts.imageSrc} alt="post" />
                                ) : (
                                    <video controls>
                                        <source src={posts.imageSrc} type="video/mp4" />
                                    </video>
                                )
                            }
                            <img className="hidden" src={posts.imageSrc}
                                onLoad=
                                {
                                    () => {
                                        setImageLoad(true);
                                    }
                                }
                                onError=
                                {
                                    () => {
                                        setImageLoad(false);
                                    }
                                }
                            />
                        </>
                    }
                </div>
                {/* Header -> Username + Avatar + Local */}
                <div className="postview__cont">
                    <div className="post__header">
                        <div className="post__header--block-left">
                            <div className="post__header--avatar">
                                <Avatar alt="Min" src={posts.avatarSrc} />
                            </div>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className="postview__header--block-right">
                            <div className="postview__header--user">
                                <div className="post__header--username">
                                    <a href="/#">{posts.username}</a>
                                </div>
                                &nbsp;
                                <div className="post__header--follow">
                                    <button>Following</button>
                                </div>
                            </div>
                            <div className="post__header--more-option">
                                <button className="btn btn-edits" onClick={() => setOpenEditPost(true)}>
                                    <i className="bx bx-dots-horizontal-rounded"
                                    ></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="post__group-bottom">
                        {/* Username + Caption */}
                        <div className="postview__caption">
                            <div className="post__header--avatar">
                                <Avatar alt="Min" src={posts.avatarSrc} />
                            </div>
                            &nbsp; &nbsp;
                            <div className="post__caption--user">
                                <span className="user-name">
                                    <a href="/#">{posts.username}</a>
                                </span>
                                &nbsp;
                                <span className="caption">
                                    {posts.caption}
                                </span>
                            </div>
                        </div>
                        {/* Comments */}
                        <div className="post__caption--comments">
                            {
                                posts.comments &&
                                    posts.comments.length > 0 ? (
                                    posts.comments.map(comment => (
                                        <div key={comment.id + comment.at}>
                                            <div className="post__caption--comment"
                                            >
                                                <div className="post__caption--commentby">
                                                    {
                                                        comment.by
                                                    }
                                                </div>
                                                &nbsp; &nbsp;
                                                <div className="post__caption--commentcontent">
                                                    {comment.content}
                                                </div>
                                            </div><div className="post__caption--commentat">
                                                {momentfromNow(new Date(comment.at.seconds * 1000))}
                                            </div>
                                        </div>
                                    ))
                                ) : null
                            }
                        </div>
                        {/* Time */}
                        <p className="post__caption--time">
                            {momentfromNow(date)}
                        </p>
                        {/* Group of interactive icons */}
                        <div className="post__group-bottom">
                            <div className="icons">
                                <div className="icons-left">
                                    <span onClick={() => {
                                        handleLikePost(posts.id)
                                    }}>
                                        <i className={`bx bx-heart ${likePost ? "hidden" : ""}`}></i>
                                        <i className={`bx bxs-heart ${likePost ? "text-red" : "hidden"}`}></i>
                                    </span>
                                    <span>
                                        <i className="bx bx-message-rounded"></i>
                                    </span>
                                    <span>
                                        <i className="bx bx-paper-plane"
                                            onClick={() => setOpenShareModal(true)}
                                        ></i>
                                    </span>
                                </div>
                                <div className="icons-right">
                                    <span>
                                        <i className="bx bx-bookmark"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="post__interactive-info">
                                <a href="/#">
                                    <span>321</span> lượt thích
                                </a>
                            </div>
                        </div>
                        {/* input field for comment */}
                        <div className="post__comment">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                PostComment(posts.id)
                                console.log(posts)
                                console.log(posts.id)
                            }}>
                                <span>
                                    <i className='bx bx-smile'></i>
                                </span>
                                <input type="text" placeholder="Add a comment..."
                                    id={"comment_" + posts.id} />
                                <button className="btn btn-post-comment"
                                    type="submit">Post</button>
                            </form>
                        </div>
                    </div>
                    {/* Modal edit */}
                    <Modal open={openEditPost} onClose={() => setOpenEditPost(false)}>
                        <div style={modalStyle} className={classes.paper}>
                            <form className="form_edit_post">
                                {
                                    postEditMySelf.map((item, index) => {
                                        return (
                                            <button key={index}
                                                className={"btn-post-edit btn-" +
                                                    item.toString().replaceAll(" ", "-").toLowerCase()}
                                                onClick={() => handleEditPost()}
                                            >
                                                {item}
                                            </button>
                                        )
                                    }
                                    )}
                            </form>
                        </div>
                    </Modal>
                    {/* Modal share */}
                    <Modal open={openShareModal} onClose={() => setOpenShareModal(false)}>
                        <div style={modalStyle} className={classes.paper}>
                            <form className="form__signup">
                                Share
                                <div className="form__group">
                                    All
                                </div>
                                <button type="submit" className="btn btn-login" >
                                    Send
                                </button>
                            </form>
                        </div>
                    </Modal>
                </div>
            </div>
        </Modal>
    );
}