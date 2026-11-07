"use client";
import { useEffect, useRef, useState } from "react";

export default function useVoiceRecorder(maxSeconds = 60) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState("");

  // "refs" keep values that don't need to redraw the page
  const recorderRef = useRef(null);  // the recorder
  const streamRef = useRef(null);    // the microphone connection
  const chunksRef = useRef([]);      // pieces of audio collected so far
  const timerRef = useRef(null);     // the clock that counts seconds

  /* ---------- STOP recording ---------- */
  function stop() {
    clearInterval(timerRef.current);
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setIsRecording(false);
  }

  /* ---------- START recording ---------- */
  async function start() {
    setError("");

    // is the microphone available in this browser and on this address?
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Recording needs a secure connection (https or localhost) and a supported browser. You can still upload a video.");
      return;
    }

    try {
      // ask the browser for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Chrome records "webm" audio, Safari records "mp4"
      const mimeType = ["audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      // collect pieces of audio while recording
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };

      // when recording stops: join the pieces into one file and switch the microphone off
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setSeconds(0);

      // count seconds, and stop automatically when the limit is reached
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setSeconds(elapsed);
        if (elapsed >= maxSeconds) stop();
      }, 1000);
    } catch {
      setError("Microphone access was blocked. Allow it in your browser settings and try again.");
    }
  }

  /* ---------- CLEAR the recording ---------- */
  function clear() {
    setAudioBlob(null);
    setAudioUrl(null);
    setSeconds(0);
  }

  /* ---------- CLEAN UP ---------- */
  // switch the microphone off if the visitor leaves the page while recording
  useEffect(() => () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  // free the temporary audio link when the recording is replaced or removed
  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  return { isRecording, seconds, audioBlob, audioUrl, error, start, stop, clear };
}