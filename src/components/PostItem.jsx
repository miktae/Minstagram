import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./PostItem.css";
import "./Calendar.css";
import { momentfromNow } from "../moment";

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
  const [likePost, setLikePost] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const postEditMySelf = ["Delete", "Edit", "Unhide like count",
    "Turn off commenting", "Go to post", "Cancel"]
  let date = new Date(props.timestamp.seconds * 1000);

  const handleEditPost = (e) => {
    e.preventDefault();
    e.stopPropagation();  
  }

  const handleLikePost = (id) => {
    console.log("like post ", id);
    setLikePost(!likePost);
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
              <span onClick={ ()=>{
                handleLikePost(props.id)
              }}>
                <i className={`bx bx-heart ${ likePost ? "hidden" : ""}`}></i>
                <i className={`bx bxs-heart ${ likePost ? "text-red" : "hidden"}`}></i>
              </span>
              <span>
                <i className="bx bx-message-rounded"></i>
              </span>
              <span>
                <i className="bx bx-paper-plane"></i>
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
          {/* Time */}
          <p className="post__caption--time">
            {momentfromNow(date)}
          </p>
        </div>
        {/* input field for comment */}
        <div className="post__comment">
          <form>
            <span>
              <i className='bx bx-smile'></i>
            </span>
            <input type="text" placeholder="Add a comment..." />
            <button className="btn btn-post-comment">Post</button>
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
    </div>
  );
}