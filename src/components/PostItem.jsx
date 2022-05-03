import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./PostItem.css";
import "./Calendar.css";
import { momentfromNow } from "../moment";

export default function PostItem(props) {
  const [imageLoad, setImageLoad] = useState(false);
  let date = new Date( props.timestamp.seconds * 1000 );

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
            <span>
              <i className="bx bx-dots-horizontal-rounded"></i>
            </span>
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
            <img style={{ display: 'none' }} src={props.imageSrc}
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
              <span>
                <i className="bx bx-heart"></i>
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
             { momentfromNow(date) } 
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
    </div>
  );
}