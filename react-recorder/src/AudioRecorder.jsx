import { useState, useRef } from "react";

const AudioRecorder = () => {
    const [permission, setPermission] = useState(false)
    const [stream, setStream] = useState(null)

    const getMicrophonePermission = async () => {
        if ('MediaRecorder' in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true)
                setStream(streamData);
            } catch(err) {
                alert(err.message)
            }
        } else {
            alert('the mediarecorder api is not suppported in your browser')
        }
    };

    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls">
                    {permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            get microphone
                        </button>
                    ): null }
                </div>
            </main>
        </div>
    )

}

export default AudioRecorder;