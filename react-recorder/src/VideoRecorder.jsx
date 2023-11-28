import { useState, useRef } from "react";
const mimeType = 'video/webm'

const VideoRecorder = () => {
    const [permission, setPermission] = useState(false)
    const [stream, setStream] = useState(null)
    const mediaRecorder = useRef(null)
    const liveVideoFeed = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null)

    const getCameraPermission = async () => {
        setRecordedVideo(null)
        if ('MediaRecorder' in window) {
            try {
                const videoConstraints = {
                    audio: true,
                    video: true,
                };
                const audioConstraints = {audio: true}
                
                const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);

                const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);

                setPermission(true)

                //combine both audio and video streams
                const combinedStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...audioStream.getAudioTracks(),
                ])

                setStream(combinedStream)

                liveVideoFeed.current.srcObject = videoStream;

            } catch(err) {
                alert(err.message)
            }
        } else {
            alert('the mediarecorder api is not suppported in your browser')
        }
    };

    const startRecording = async () => {
        setRecordingStatus('recording');
        const media = new MediaRecorder(stream, { mimeType})
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localVideoChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') return;
            if (event.data.size === 0) return;
            localVideoChunks.push(event.data)
        };
        setVideoChunks(localVideoChunks)
    }

    const stopRecording = async () => {
        setPermission(false);
        setRecordingStatus('inactive')
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const videoBlob = new Blob(videoChunks, {type: mimeType })
            const videoUrl = URL.createObjectURL(videoBlob);
            setRecordedVideo(videoUrl);
            setVideoChunks([]);
        }
    }


    return (
        <div>
            <h2>Video Recorder</h2>
            <main>
                <div className="video-controls">
                    {!permission ? (
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