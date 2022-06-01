import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import 'emoji-picker-element';
import styles from "./Messages.module.css";

const EmojiPicker = () => {
    const ref = useRef(null)

    useEffect(() => {
        ref.current.addEventListener('emoji-click', event => {
            document.getElementById("message").value += event.detail.unicode
        })
        ref.current.skinToneEmoji = '👍'
    }, [])

    return React.createElement('emoji-picker', { ref })
}

export default function Messages(props) {
    const [iconOpen, setIconOpen] = useState(false);
    const [message, setMessage] = useState("");

    let { user } = useParams();

    return (
        <div className={styles.messageContainer}>
            <div className={styles.messageHeader}>
                <div className={styles.messageHeaderLeft}>
                    <div className={styles.headerAvatar}>
                        <Avatar sx={{ width: 18, height: 18 }} />
                    </div>
                    <div className={styles.headerUser}>
                        {user}
                    </div>
                </div>
                <div className={styles.messageHeaderRight}>
                    <i className="fa-solid fa-circle-info"></i>
                </div>
            </div>
            <div className={styles.messageBody}>
                <div className={styles.messageBodyMain}>
                    Lorem Ips ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec eget nunc eget nunc efficitur efficitur.
                    <div className={styles.messageBodyMainDate}>
                        <span>{new Date().toLocaleString()}</span>
                    </div>
                </div>
                <div className={styles.messageTyping}>
                    <i className="fa-solid fa-face-smile"
                        onClick={() => setIconOpen(!iconOpen)}></i>
                    <input type="text" id="message" className={styles.messageInput}
                        placeholder="Message..."
                        defaultValue={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className={styles.messageIcon}>
                        <i className="fa-solid fa-microphone"
                         tooltip="Send a voice message"></i>
                        <i className="fa-solid fa-photo-film" 
                         tooltip="Attach a file"></i>
                        <i className="fa-solid fa-user-clock"
                         tooltip="Reminder"></i>
                    </div>
                    {message && <p className={styles.messageSend}>Send</p>}
                </div>
                {iconOpen && <EmojiPicker />}
            </div>
        </div>
    )
}