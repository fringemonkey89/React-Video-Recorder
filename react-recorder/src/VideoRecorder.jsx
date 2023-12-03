import { useState, useRef } from "react";

const mimeType = 'video/webm'

const VideoRecorder = () => {
    const [permission, setPermission] = useState(false)
    const [stream, setStream] = useState(null)
    // reference to the mediarecorder instance
    // the initial value of the reference is null
    //this reference can be used to store and access the mediarecorder instance
    const mediaRecorder = useRef(null)
    // reference to the live video feed instance
    // the initial value of the reference is null
    //this reference can be used to store and access the live video feed 
    const liveVideoFeed = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [videoChunks, setVideoChunks] = useState([]);
    const [recordedVideo, setRecordedVideo] = useState(null)

    const getCameraPermission = async () => {
        // reset the recorded video state variable to null
        setRecordedVideo(null)
        //checks if the mediarecorder api is supported in the browser by checking if the mediarecorder object exists in the window
        if ('MediaRecorder' in window) {
            try {
                //defines the videoconstraints object, which specifies the constraints for the video stream
                const videoConstraints = {
                    audio: false,
                    video: true,
                };
                //enable audio in audiostream
                const audioConstraints = {audio: true}
                
                //get the audio stream from the users device based on the audio constraints
                // the returned audiostream variable holds the obtained audio stream
                const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);

                //get the video stream from the users device based on the audio constraints
                    // the returned videostream variable holds the obtained video stream
                const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);

                //set the permission state variable to true
                setPermission(true)

                //combine both audio and video streams
                //creates a new mediastream instance named combine stream, which holds the merged audio
                //and video streams
                const combinedStream = new MediaStream([
                    ...videoStream.getVideoTracks(),
                    ...audioStream.getAudioTracks(),
                ])
                //set the stream variable to combined stream
                setStream(combinedStream)

                //set the live feed video source to the video stream
                //sets the srcObject property of the liveVideoFeed.current to the videostream which displays the live feed
                // in the corresponding html element
                liveVideoFeed.current.srcObject = videoStream;

            } catch(err) {
                alert(err.message)
            }
        } else {
            alert('the mediarecorder api is not suppported in your browser')
        }
    };

    const startRecording = async () => {
        //set the recording status to 'recording'
        //indcates that the recording process has started
        setRecordingStatus('recording');
        // create new mediarecorder instance with the provided stream and mimetype
        const media = new MediaRecorder(stream, { mimeType})
        //store the mediarecorder instance in the mediarecorder reference
        //allows access and control of the mediarecorder instance from other parts of the code
        mediaRecorder.current = media;
        //start recording with the mediarecorder instance
        //will begin capturing audio and video data from the provided stream
        mediaRecorder.current.start();
        //create an empty array to store the recorded video chunks
        let localVideoChunks = [];
        // event handler for when data becomes available from the media recorder
        mediaRecorder.current.ondataavailable = (event) => {
            //if the event data is undefined, return
            // means there is no data available so the function returns
            if (typeof event.data === 'undefined') return;
            //if the event data size is zero, return
            if (event.data.size === 0) return;
            //push the event data into the localVideoChunks array
            localVideoChunks.push(event.data)
        };
        //update the videoCHunks state variable with the localvideoChunks array
          //this allows other parts of the code to access and utilize the recorded video chunks
        setVideoChunks(localVideoChunks)
    }

    const stopRecording = async () => {
        // set the permission state variable to false, indicating that camera and microphone permissions are no longer granted
        setPermission(false);
        //set the recording tatus to inactive to indicate that the recording process has been stoppped
        setRecordingStatus('inactive')
        // stop the recording process using the stop() method of the media recorder instance
        mediaRecorder.current.stop();
        // event handler for when the recording process is stopped
        // the event fires when the recording process is stopped
        mediaRecorder.current.onstop = () => {
            // create a blob object from the recorded video chunks with the specified mimetype
            // the blob object represents the recorded video data
            // the type property is set to the provided mimetype to specify the type of blob
            const videoBlob = new Blob(videoChunks, {type: mimeType })
            //create a url representing the videoblob
            const videoUrl = URL.createObjectURL(videoBlob);
            //set the recordedvideo state variable to the videourl, representing the recorded video
            // allows other parts of the code to access and utlilze the recorded video
            setRecordedVideo(videoUrl);
            // clear the videochunks state variable by setting it to an empty array
            // prepares the state variable for future recordings
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
                    {permission && recordingStatus === 'inactive' ? (
                        <button onClick={startRecording} type="button">
                            Record
                        </button>
                    ): null}
                    {recordingStatus === 'recording' ? (
                        <button onClick={stopRecording} type="button">
                            Stop Recording
                        </button>
                    ): null}
                </div>
            </main>
            <div className="video-player">
                {!recordedVideo ? (
                    <video ref={liveVideoFeed} autoPlay className="live-player"></video>
                ): null}
                {recordedVideo ? (
                    <div className="recorded-player">
                        <video className="recorded" src={recordedVideo} controls ></video>
                        <a download href={recordedVideo}>
                            Download Recording
                        </a>
                    </div>
                    ): null}
            </div>
        </div>
    )

}

export default VideoRecorder;