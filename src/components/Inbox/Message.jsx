import React, { useState } from 'react';
import Avatar from "@material-ui/core/Avatar";
import styles from "./Message.module.css";
import { converttoDateandTime } from "../../moment";
import { auth } from "../../firebase";

const MessageMore = (props) => {
    return (
        <div className={styles.more}>
            {
                props.click &&
                <div className={styles.modal}
                    style={{ display: props.displayModal }}>
                    <div className={styles.more_items}>
                        <div className={styles.more_item}>
                            Like
                        </div>
                        <div className={styles.more_item}>
                            Forward
                        </div>
                        <div className={styles.more_item}>
                            Copy
                        </div>
                        <div className={styles.more_item}>
                            {props.action}

                        </div>
                    </div>
                    <div className={styles.triangle}
                        style={{ marginLeft: props.marginLeft }}
                    >
                    </div>
                </div>
            }
            {
                props.hover &&
                <div className={styles.more_icon}
                    onClick={props.handleClick}>
                    ...
                </div>
            }
        </div>
    )
}

const TextMessage = (props) => {
    return (
        <div className={props.user == auth.currentUser.uid
            ? styles.messageText
            : styles.messageTextOther}
            onMouseOver={() => setIsHover(true)}
        >
            {props.message}
        </div>
    )
}

export default function Message(props) {
    const [isHover, setIsHover] = useState(false);
    const [isClick, setClick] = useState(false);

    return (
        <div className={styles.message}>
            <div className={styles.messageBodyMainDate}>
                <span>{props.timestamp && converttoDateandTime(props.timestamp.seconds)}</span>
            </div>
            <div className={props.user == auth.currentUser.uid ? styles.messageBody
                : styles.messageBodyOther}
                onMouseLeave={() => setIsHover(false)}
            >
                {props.user != auth.currentUser.uid && <Avatar className={styles.MuiAvatar} />}
                {
                    props.user == auth.currentUser.uid
                    && isHover && <MessageMore
                        action="Unsend" marginLeft="90%"
                        hover={isHover}
                        handleClick={() => setClick(!isClick)}
                        click={isClick} />
                }

                {
                    props.voiceUrl && <div className={styles.messageVoiceClip}
                        onMouseOver={() => setIsHover(true)}
                    >
                        <audio src={props.voiceUrl} controls />
                    </div>
                }

                {
                    props.fileUrl && <div className={styles.messageFile}
                        onMouseOver={() => setIsHover(true)}
                    >
                        <a href={props.fileUrl} alt="">
                            {
                                props.fileType == "image/png" || props.fileType == "image/jpeg" || props.fileType == "image/jpg"
                                    
                                ? <img width="100rem" height="100rem"
                                        src={props.fileUrl} className={styles.img} />
                                    :
                                    props.fileType == "video/mp4" || props.fileType == "video/webm"
                                        || props.fileType == "video/ogg"
                                        || props.fileType == "video/quicktime" ||
                                        props.fileType == "video/x-flv"
                                        || props.fileType == "video/x-msvideo"
                                        || props.fileType == "video/x-ms-wmv"
                                        ? <video width="40%" height="40%"
                                            src={props.fileUrl} controls />
                                        : <div className={styles.fileEm}>
                                            <div className={styles.fileName}>
                                                  {props.fileName} 
                                            </div>
                                            <embed src={props.fileUrl} alt="file"
                                                frameBorder="0"
                                                height="100%"
                                                width="100%"
                                            ></embed>
                                        </div>

                            }
                        </a>
                    </div>
                }
                {
                    props.message &&
                    <TextMessage user={props.user}
                        message={props.message} />
                }
                {
                    props.user != auth.currentUser.uid
                    && isHover && <MessageMore
                        action="Report" marginLeft="6%"
                        hover={isHover}
                        handleClick={() => setClick(!isClick)}
                        click={isClick}
                    />
                }
            </div>
        </div>
    )
}