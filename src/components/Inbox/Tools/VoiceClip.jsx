import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import useVoice from './useVoice';
import styles from "./Tools.module.css";
import useStore from "../store";

function VoiceClip() {
    const [
        audioURL,
        isRecording,
        startRecording,
        stopRecording
    ] = useVoice();
    const audioView = useStore((state) => state.audioView);
    const setAudioView = useStore((state) => state.setAudioView);
    const [audioDisplay, setAudioDisplay] = useState(false);
    const [startView, setStartView] = useState(true);
    const [stopView, setStopView] = useState(true);

    return (
        <div className={styles.container}>
            {
                audioDisplay &&
                <div className={styles.audioContainer}>
                    {
                        audioView &&
                        <audio src={audioURL} controls width="100%">
                            Your browser does not support the audio element.
                        </audio>
                    }
                    {
                        stopView &&
                        <Tooltip title="Stop" placement="top">
                            <i className='bx bx-stop-circle'
                                onClick={() => {
                                    stopRecording();
                                    setStartView(true);
                                    setStopView(false);
                                }}
                            ></i>
                        </Tooltip>
                    }
                </div>
            }
            {
                startView &&
                <Tooltip title="Send a voice clip" placement="top">
                    <i className="fa-solid fa-microphone"
                        onClick={
                            () => {
                                startRecording();
                                setAudioDisplay(true);
                                setStartView(false);
                                setStopView(true);
                                setAudioView(true);
                            }}
                        disabled={isRecording}></i>
                </Tooltip>
            }

        </div>
    )
}

export default VoiceClip