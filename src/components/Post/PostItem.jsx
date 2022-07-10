import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./PostItem.css";
import "./Calendar.css";
import { momentfromNow } from "../../moment";
import { Link } from "react-router-dom";
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

export default function PostItem(props) {
  const [imageLoad, setImageLoad] = useState(false);
  const [openEditPost, setOpenEditPost] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [likePost, setLikePost] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [id, setId] = useState(null);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const postsCollectionRef = collection(db, auth.currentUser.displayName + "'s_posts");
  const q = query(postsCollectionRef, orderBy('timestamp', 'asc'));
  const [comments, setComments] = useState([]);
  const postEditMySelf = ["Delete", "Edit", "Unhide like count",
    "Turn off commenting", "Go to post", "Cancel"]
  let date = new Date(props.timestamp.seconds * 1000);
  const setOpenPostView = useStore((state) => state.setOpenPostView)

  const handleEditPost = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleLikePost = (id) => {
    console.log("like post ", id);
    setLikePost(!likePost);
  }

  const PostComment = async (id) => {
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
      console.log(comments)
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

  const EmojiPicker = () => {
    const ref = useRef(null)

    useEffect(() => {
      ref.current.addEventListener('emoji-click', event => {
        document.getElementById('comment_' + id).value
          += event.detail.unicode
      })
      ref.current.skinToneEmoji = '👍'
    }, [])

    return React.createElement('emoji-picker', { ref })
  }

  return (
    <div className="post__container">
      {/* Header -> Username + Avatar + Local */}
      <div className="post__header">
        <div className="post__header--block-left">
          <div className="post__header--avatar">
            <Avatar alt="Remy Sharp" src={props.avatarSrc} />
          </div>
        </div>
        <div className="post__header--block-right">
          <div className="post__header--username">
            <a href="/#">{props.username}</a>
          </div>
          <div className="post__header--more-option">
            <button className="btn btn-edits" onClick={() => setOpenEditPost(true)}>
              <i className="bx bx-dots-horizontal-rounded"
              ></i>
            </button>
          </div>
        </div>
      </div>
      {/* image */}
      <div className="post__image">
        {
          <>
            {
              imageLoad ? (
                <img src={props.imageSrc} alt="post" />
              ) : (
                <video controls>
                  <source src={props.imageSrc} type="video/mp4" />
                </video>
              )
            }
            <img className="hidden" src={props.imageSrc}
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
      <div className="post__group-bottom">
        {/* Group of interactive icons */}
        <div className="post__group-bottom">
          <div className="icons">
            <div className="icons-left">
              <span onClick={() => {
                handleLikePost(props.id)
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
        {/* Username + Caption */}
        <div className="post__caption">
          <div className="post__caption--user">
            <span className="user-name">
              <a href="/#">{props.username}</a>
            </span>
            &nbsp;
            <span className="caption">
              {props.caption}
            </span>
          </div>
          {/* Comments */}
          <p className="post__caption--comments">
            <Link className="post__caption--comments--link"
              onClick={() => {
                setOpenPostView(true)
              }
              }
              to={`/Minstagram/post/${props.id}`}>{
                props.comments &&
                  props.comments.length > 0 ?
                  props.comments.length === 1 ?
                    "View " + 1 + " comment"
                    :
                    "View all " + props.comments.length + " comments"
                  : ""
              }</Link>
          </p>
          {/* Time */}
          <p className="post__caption--time">
            {momentfromNow(date)}
          </p>
        </div>
        {/* input field for comment */}
        <div className="post__comment">
          <form onSubmit={(e) => {
            e.preventDefault();
            PostComment(props.id)
          }}>
            <span>
              <i className='bx bx-smile'
                onClick={() => {
                  setId(props.id)
                  setIconOpen(!iconOpen)
                }}>
                {
                  iconOpen && <EmojiPicker />
                }
              </i>
            </span>
            <input type="text" placeholder="Add a comment..."
              id={"comment_" + props.id} />
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
  );
}