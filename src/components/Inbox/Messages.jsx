import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from '@mui/material/Tooltip';
import 'emoji-picker-element';
import styles from "./Messages.module.css";
import Message from "./Message";
import { auth, db, storage } from "../../firebase";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    addDoc,
    updateDoc,
    doc
} from "firebase/firestore";
import {
    ref,
    getDownloadURL,
    uploadBytes,
    uploadBytesResumable
} from "firebase/storage";
import VoiceClip from './Tools/VoiceClip';
import useStore from "./store";
import Reminder from './Tools/Reminder';

const EmojiPicker = () => {
    const ref = useRef(null)

    useEffect(() => {
        ref.current.addEventListener('emoji-click', event => {
            document.getElementById('message').value += event.detail.unicode
        })
        ref.current.skinToneEmoji = '👍'
    }, [])

    return React.createElement('emoji-picker', { ref })
}

export default function Messages() {
    let { user } = useParams();
    const [iconOpen, setIconOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [typingMessages, setTypingMessages] = useState('');
    const [audioDownloadUrl, setAudioDownloadUrl] = useState('');
    const messagesCollectionRef = collection(db, "chats");
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));
    const audioSrc = useStore((state) => state.audioSrc);
    const setAudioSrc = useStore((state) => state.setAudioSrc);
    const setAudioView = useStore((state) => state.setAudioView);

    useEffect(() => {
        setTypingMessages(document.getElementById('message').value);
        console.log(typingMessages);
    }, [typingMessages])

    useEffect(() => onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })))
        // console.clear()
    }), []);

    const SendMessages = async (e) => {
        let message = document.getElementById('message').value;
        if (message.length > 0) {
            let timestamp = serverTimestamp();
            try {
                document.getElementById('message').value = "";
                await addDoc(messagesCollectionRef, {
                    user: auth.currentUser.uid,
                    message: message,
                    timestamp: timestamp
                })

            } catch (err) {
                alert(err)
            }
        }
        else {
            console.log(audioSrc)
            if (audioSrc) {
                setAudioView(false);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function (e) {
                        console.log(e);
                        reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", audioSrc, true);
                    xhr.send(null);
                });

                const docRef = await addDoc(collection(db, "chats"), {
                    user: auth.currentUser.uid,
                    timestamp: serverTimestamp(),
                });

                const voiceRef = ref(storage, `chats/${auth.currentUser.uid}/${docRef.id}`);
                const metadata = {
                    contentType: "audio/webm",
                };

                await uploadBytes(voiceRef, blob, metadata)
                    .then(async (snapshot) => {
                        const downloadURL = await getDownloadURL(voiceRef);
                        await updateDoc(doc(db, "chats", docRef.id), {
                            voiceUrl: downloadURL
                        });
                        // console.log(downloadURL)
                    })
                    .then(() => {
                        setAudioSrc('');
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        console.log(file)
        const metadata = {
            contentType: file.type
        };

        const docRef = await addDoc(collection(db, "chats"), {
            user: auth.currentUser.uid,
            timestamp: serverTimestamp(),
        });
        const fileRef = ref(storage,
            `chats/${auth.currentUser.uid}/${docRef.id}`);
        await uploadBytes(fileRef, file)
            .then(async (snapshot) => {
                const downloadURL = await getDownloadURL(fileRef);
                await updateDoc(doc(db, "chats", docRef.id), {
                    fileName: file.name,
                    fileUrl: downloadURL,
                    fileType: file.type
                });
                console.log(downloadURL)
            })
            .catch(err => {
                console.log(err)
            })
    }

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
                <div className={styles.messageBodyMain} >
                    {/* Messages */}
                    <div className="Message__list">
                        {
                            messages.map(message => (
                                <Message key={message.id} {...message}></Message>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.messageTypingContainer}>
                    <div className={styles.messageTyping}>
                        <i className="fa-solid fa-face-smile"
                            onClick={() => setIconOpen(!iconOpen)}></i>
                        <textarea id="message" className={styles.messageInput}
                            placeholder="Message..."
                        ></textarea>
                        <div className={styles.messageIcon}>
                            <Tooltip title="Send a voice clip" placement="top">
                                <>
                                    <VoiceClip>
                                    </VoiceClip>
                                </>
                            </Tooltip>
                            <Tooltip title="Attach a file" placement="top">
                                <label htmlFor="file">
                                    <i className="fa-solid fa-photo-film"></i>
                                    <input id="file" type="file"
                                        onChange={uploadFile}
                                        name="file" style={{ display: "none" }} />
                                </label>
                            </Tooltip>
                            <Tooltip title="Create reminder" placement="top">
                                <>
                                    <Reminder />
                                </>
                            </Tooltip>

                        </div>
                        <p className={styles.messageSend}
                            onClick={SendMessages}>
                            Send
                        </p>
                    </div>
                    {iconOpen && <EmojiPicker />}
                </div>
            </div>
        </div>
    )
}