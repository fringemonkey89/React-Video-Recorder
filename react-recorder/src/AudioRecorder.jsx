import { useState, useRef } from "react";

// setting the audio mime type for the recorder audio
const mimeType = 'audio/webm'
const AudioRecorder = () => {
    //stores if permission to use the microphone was granted
    const [permission, setPermission] = useState(false)
    //stores the mediaRecorder instance
    const mediaRecorder = useRef(null)
    //stores the  current recording status
    const [recordingStatus, setRecordingStatus] = useState('inactive')
    // stores the mediastream from the users microphone
    const [stream, setStream] = useState(null)
    //stores the audio chunks while recording
    const [audioChunks, setAudioChunks] = useState([]);
    //stoes the final recorded  audio url
    const [audio, setAudio] = useState(null)

    const getMicrophonePermission = async () => {
        // checks if the mediaRecorder object is available in the window object
        //mediaRecorder is an API for recording audio and video
        if ('MediaRecorder' in window) {
            //if the media recorder object is available, it tries to request microphone access from the user
            // usng the navigator.mediaDevices.getUserMedia method. 
            //this method returns a promise that resolves with a mediastream object containing the requested
            //audio an or video stream
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    //the getUserMedia method is called with an object parameter that specifies the desired media types
                    audio: true,
                    video: false,
                });
                //if the user grants permission and the promise resolves successfully, the code sets the permission
                //status to true using the setPermission function and sets the obtained mediastream object to a variable called
                //stream
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
        //sets the recording status to 'recording' using the setRecordingStatus('recording)
        setRecordingStatus("recording");
        //create new media recorder instance using the stream and mimetype
        const media = new MediaRecorder(stream, {type: mimeType});
        // set the mediarecorder instance to the mediaRecorder ref to the media instance
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        // initializes an empty array named localAudioChunks to store the received audio chunks
        let localAudioChunks = [];
        //sets the ondataavailable handler, it checks if the received event.data is defined and has nonzero size
        
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') return;
            if (event.data.size === 0) return;
            //if so, it pushes the event.data into the localAudioChunks array
            localAudioChunks.push(event.data)
        }
        //sets the audioChunks state variable to the localAudioChunks array
        setAudioChunks(localAudioChunks)
    }

    const stopRecording = () => {
        //set the recording status to 'inactive'
        setRecordingStatus('inactive');
        //stops the recording instance
        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            // create a blob file from the audiochunks data
            const audioBlob = new Blob(audioChunks, {type: mimeType})
            //creates a playable url from the blob file
            const audioUrl = URL.createObjectURL(audioBlob)
            //set the audio state variable to the audioUrl
            setAudio(audioUrl);
            //clears the audioChunks array by setting it to an empty array using the setAudioChunks
            setAudioChunks([])
        }
    }


    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            get microphone
                        </button>
                    ): null }
                    {permission && recordingStatus === 'inactive' ? (
                        <button onClick={startRecording} type="button">
                            Start Recording
                        </button>
                    ): null}
                    {recordingStatus === 'recording' ? (
                        <button onClick={stopRecording} type="button">
                            Stop Recording
                        </button>
                    ): null}
                </div>
                {audio ? (
                    <div className="audio-container">
                        <audio src={audio} controls></audio>
                        <a download href={audio}>
                            Download Recording
                        </a>
                    </div>
                ): null}
            </main>
        </div>
    )

}

export default AudioRecorder;

// receives microphone permissions from the browser using the getmicrophonepermission function
// sets mediastream received from the navigator.mediaDevices.getUserMedia function to the stream state variable