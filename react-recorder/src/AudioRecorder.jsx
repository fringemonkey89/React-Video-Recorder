import { useState, useRef } from "react";
const mimeType = 'audio/webm'
const AudioRecorder = () => {
    const [permission, setPermission] = useState(false)
    const mediaRecorder = useRef(null)
    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [stream, setStream] = useState(null)
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null)

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

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new media recorder instance using the stream
        const media = new MediaRecorder(stream, {type: mimeType});
        // set the mediarecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording prociess
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }



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

export default AudioRecorder;

// receives microphone permissions from the browser using the getmicrophonepermission function
// sets mediastream received from the navigator.mediaDevices.getUserMedia function to the stream state variable