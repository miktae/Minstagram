import React, { useState } from 'react';
import Avatar from "@material-ui/core/Avatar";
import styles from "./Message.module.css";
import { converttoDateandTime } from "../../moment";
import { auth, db } from "../../firebase";
import {
    doc,
    updateDoc
} from "firebase/firestore";

const MessageMore = (props) => {
    const onUnsendMessage = async (id) => {
        let confirm = window.confirm("Are you sure you want to unsend this message?");
        if (confirm) {
            try {
                await updateDoc(doc(db, auth.currentUser.uid + "'s_chats", id), {
                    user: auth.currentUser.uid,
                    message: "You unsent a message",
                    fileUrl: "",
                    unsent: true
                })
            } catch (err) {
                alert(err)
            }
        }
    }

    const onReportMessage = async (id) => {
        let confirm = window.confirm("Are you sure you want to report this message?");
        if (confirm) {
            try {
                await updateDoc(doc(db, auth.currentUser.uid + "'s_chats", id), {
                    user: auth.currentUser.uid,
                    report: true
                })
            } catch (err) {
                alert(err)
            }
        }
    }

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
                        <div className={styles.more_item}
                            onClick={() => {
                                if (props.action == 'Unsend') {
                                    onUnsendMessage(props.id)
                                }
                                else {
                                    onReportMessage(props.id)
                                }
                            }}>
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
            style={props.message === "You unsent a message"
                ? {
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    fontWeight: 200,
                    color: "#BCC0C4"
                }
                : {}}
            onMouseOver={props.onMouseOver}
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
                        id={props.id}
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
                        message={props.message}
                        onMouseOver={() => setIsHover(true)} />
                }
                {
                    props.user != auth.currentUser.uid
                    && isHover && <MessageMore
                        id={props.id}
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
