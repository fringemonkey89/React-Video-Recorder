import { useState, useRef } from "react";

const VideoRecorder = () => {
    const [permission, setPermission] = useState(false)
    const [stream, setStream] = useState(null)

    const getCameraPermission = async () => {
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
            <h2>Video Recorder</h2>
            <main>
                <div className="video-controls">
                    {permission ? (
                        <button onClick={getCameraPermission} type="button">
                            get camera
                        </button>
                    ): null }
                    {permission ? (
                        <button type="button">
                            Record
                        </button>
                    ): null}
                </div>
            </main>
        </div>
    )

}

export default VideoRecorder;