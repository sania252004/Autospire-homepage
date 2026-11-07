"use client";
/* ==========================================================
   "NOT SURE WHAT'S WRONG?" BOX
   Lets the customer record the sound their car makes and/or
   upload a video of the problem. Shown inside the Hero search
   box on the "Book a Service" tab.

   WHERE TO EDIT:
   - Longest recording and biggest video -> the two settings below
   - Text shown to the customer          -> the <div className={styles.heading}> part
   - Colours and sizes                   -> IssueCapture.module.css
   - The microphone logic                -> useVoiceRecorder.js
   ========================================================== */

import { useEffect, useRef, useState } from "react";
import useVoiceRecorder from "./useVoiceRecorder";
import styles from "./IssueCapture.module.css";

/* ---------- SETTINGS: change these numbers ---------- */
const MAX_RECORD_SECONDS = 60; // longest car-noise recording (in seconds)
const MAX_VIDEO_MB = 100;      // biggest video file allowed (in megabytes)

/* ---------- SMALL ICONS (drawn here so no extra files are needed) ---------- */
const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

const MicIcon = () => (
  <svg {...iconProps}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
);
const VideoIcon = () => (
  <svg {...iconProps}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></svg>
);
const StopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
);
const CloseIcon = () => (
  <svg {...iconProps} width="16" height="16" strokeWidth="2.4"><path d="M6 6l12 12M18 6 6 18" /></svg>
);

// Turns seconds into minutes:seconds, e.g. 75 becomes "1:15"
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/* ---------- THE BOX ---------- */
// onChange({ audio, video }) is called whenever the recording or video changes,
// so page.jsx always knows what the customer attached.
export default function IssueCapture({ onChange }) {
  const recorder = useVoiceRecorder(MAX_RECORD_SECONDS); // microphone controls (see useVoiceRecorder.js)

  const [video, setVideo] = useState(null);        // the video file the customer chose
  const [videoUrl, setVideoUrl] = useState(null);  // temporary link so the video can be previewed
  const [videoError, setVideoError] = useState(""); // message if the video is not allowed
  const fileInputRef = useRef(null);               // the hidden "choose file" box

  // Remember the latest onChange so the effect below always calls the newest one
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Tell the page whenever the recording or video changes
  useEffect(() => {
    onChangeRef.current?.({ audio: recorder.audioBlob, video });
  }, [recorder.audioBlob, video]);

  // Clean up the temporary video link when the video is replaced or removed
  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  // Runs when the customer picks a video file
  function handleVideoChosen(event) {
    setVideoError("");
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be chosen again later
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setVideoError("Please choose a video file.");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setVideoError(`Video is too large. Maximum size is ${MAX_VIDEO_MB} MB.`);
      return;
    }
    setVideo(file);
    setVideoUrl(URL.createObjectURL(file));
  }

  function removeVideo() {
    setVideo(null);
    setVideoUrl(null);
  }

  // Show whichever error exists (microphone problem or video problem)
  const errorMessage = recorder.error || videoError;

  return (
    <div className={styles.box}>

      {/* TITLE AND EXPLANATION */}
      <div className={styles.heading}>
        <b>Not sure what's wrong?</b>
        <span>Record the noise your car makes or upload a video of the issue. Garages will see it with your booking.</span>
      </div>

      {/* THE TWO BUTTONS */}
      <div className={styles.buttons}>
        {recorder.isRecording ? (
          // while recording: red Stop button with a timer
          <button type="button" className={`${styles.button} ${styles.recording}`} onClick={recorder.stop}>
            <span className={styles.dot} /> <StopIcon /> Stop · {formatTime(recorder.seconds)} / {formatTime(MAX_RECORD_SECONDS)}
          </button>
        ) : (
          // otherwise: Record button
          <button type="button" className={styles.button} onClick={recorder.start}>
            <MicIcon /> {recorder.audioBlob ? "Re-record noise" : "Record car noise"}
          </button>
        )}

        <button type="button" className={styles.button} onClick={() => fileInputRef.current?.click()}>
          <VideoIcon /> {video ? "Replace video" : "Upload video of the issue"}
        </button>
        {/* the real file picker is hidden; the button above opens it */}
        <input ref={fileInputRef} type="file" accept="video/*" hidden onChange={handleVideoChosen} />
      </div>

      {/* ERROR MESSAGE (only shown when something goes wrong) */}
      {errorMessage && <p className={styles.error} role="alert">{errorMessage}</p>}

      {/* PREVIEWS of what the customer added */}
      {(recorder.audioUrl || videoUrl) && (
        <div className={styles.previews}>
          {recorder.audioUrl && (
            <div className={styles.preview}>
              <audio controls src={recorder.audioUrl} />
              <button type="button" className={styles.removeButton} onClick={recorder.clear} aria-label="Remove recording"><CloseIcon /></button>
            </div>
          )}
          {videoUrl && (
            <div className={styles.preview}>
              <video controls src={videoUrl} />
              <span className={styles.fileName}>{video.name} ({(video.size / 1048576).toFixed(1)} MB)</span>
              <button type="button" className={styles.removeButton} onClick={removeVideo} aria-label="Remove video"><CloseIcon /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}