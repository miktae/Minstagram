import React, { useState } from 'react'
import { useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import 'emoji-picker-element';
import styles from "./Messages.module.css";

export default function Messages(props) {
    const [iconOpen, setIconOpen] = useState(false);
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
                        style={{
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            position: 'relative',
                            color: '#00bcd4',
                           top: '0.7rem',
                           left: '2.5rem'
                        }}
                        onClick={() => setIconOpen(!iconOpen)}></i>
                    {iconOpen && <emoji-picker></emoji-picker>}
                    <input type="text" className={styles.messageInput}
                        placeholder="            Message..." />
                </div>
            </div>
        </div>
    )
}
