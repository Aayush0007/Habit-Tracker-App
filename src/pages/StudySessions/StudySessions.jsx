import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Activity,
} from "lucide-react";
import SessionCard from "./SessionCard";
import { useStudySessions } from "../../hooks/useStudySessions";
import { calculateTotalStudyHours } from "../../features/studySessions/sessionLogic";

const StudySessions = () => {
  const { sessions, toggleSession, updateSessionTopic, loading } =
    useStudySessions();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const wakeLock = useRef(null);

  const startAudio = useRef(new Audio("/Assets/timerStart.wav"));
  const endAudio = useRef(new Audio("/Assets/timerEnd.mp3"));
  const canvasRef = useRef(document.createElement("canvas"));
  const videoRef = useRef(document.createElement("video"));

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("studyTimer_timeLeft");
    return savedTime ? parseInt(savedTime, 10) : 120 * 60;
  });

  const [isActive, setIsActive] = useState(() => {
    const savedActive = localStorage.getItem("studyTimer_isActive");
    return savedActive === "true";
  });

  // Media Session Handlers
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Warrior Timer: ${formatTime(timeLeft)}`,
        artist: "Command Center",
        album: isActive ? "Deployment Active" : "System Status: Standby",
      });
      navigator.mediaSession.setActionHandler("play", () => handleStart());
      navigator.mediaSession.setActionHandler("pause", () => handleStart());
      navigator.mediaSession.setActionHandler("seekbackward", () =>
        resetTimer(),
      );
    }
  }, [timeLeft, isActive]);

  // Wake Lock
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator && !wakeLock.current) {
        wakeLock.current = await navigator.wakeLock.request("screen");
      }
    } catch (err) {
      console.warn("WakeLock Restricted");
    }
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem("studyTimer_timeLeft", timeLeft);
    localStorage.setItem("studyTimer_isActive", isActive);
    if (document.pictureInPictureElement) drawPiPCanvas();
  }, [timeLeft, isActive]);

  // Timer Engine
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      requestWakeLock();
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      endAudio.current.play().catch((e) => console.error("Audio blocked", e));
      if (wakeLock.current)
        wakeLock.current.release().then(() => (wakeLock.current = null));
    } else {
      if (wakeLock.current)
        wakeLock.current.release().then(() => (wakeLock.current = null));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const drawPiPCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const progress = timeLeft / (120 * 60);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 20;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + 2 * Math.PI * progress,
    );
    ctx.strokeStyle = isActive ? "#10b981" : "#f43f5e";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.shadowBlur = 15;
    ctx.shadowColor = isActive ? "#10b981" : "#f43f5e";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 70px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(formatTime(timeLeft), centerX, centerY);
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        const video = videoRef.current;

        // 1. Force unmuted with low volume to enable Media Session controls
        video.muted = false;
        video.volume = 0.001;

        // 2. Ensure Canvas is drawn BEFORE capturing
        drawPiPCanvas();

        // 3. Capture at 10FPS (Solves the "Static Image" rejection on mobile)
        const stream = canvasRef.current.captureStream(10);
        video.srcObject = stream;

        // 4. Brief mount to DOM (Required by some Android versions)
        video.style.display = "none";
        document.body.appendChild(video);

        await video.play();
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP Critical Failure:", error);
      // Fallback: If PiP fails, we can alert the user
      showToast(
        "PiP Blocked: Ensure browser permissions allow popups",
        "error",
      );
    }
  };
  
  const handleStart = async () => {
    const primeAudio = (audio) => {
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch((e) => console.warn("Priming failed", e));
    };
    primeAudio(startAudio.current);
    primeAudio(endAudio.current);

    if (!isActive) {
      if (timeLeft === 120 * 60) {
        startAudio.current
          .play()
          .catch((e) => console.error("Audio blocked", e));
      }
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(120 * 60);
  };

  const totalHours = calculateTotalStudyHours(sessions);

  if (loading) return null;

  return (
    <div
      className={`min-h-screen bg-slate-950 text-white transition-colors duration-500 ${isFullScreen ? "flex items-center justify-center p-0" : "p-4 md:p-8 pb-32"}`}
    >
      {!isFullScreen && (
        <header className="flex justify-between items-start mb-8 max-w-4xl mx-auto w-full px-2">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
              Command Center
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Activity size={14} className="text-blue-500 animate-pulse" />
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                Focus Operations
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl md:text-5xl font-black text-emerald-400 italic tabular-nums leading-none">
              {totalHours}h
            </span>
            <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
              Logged
            </p>
          </div>
        </header>
      )}

      {/* RESPONSIVE TIMER CONTAINER */}
      <section
        className={`relative mx-auto w-full transition-all duration-700 ease-in-out flex flex-col items-center justify-center
          ${
            isFullScreen
              ? "h-screen bg-slate-950 border-none rounded-none"
              : "max-w-3xl aspect-[4/3] md:aspect-video bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl p-6 md:p-12"
          }`}
      >
        {/* ACTION BUTTONS (TOP RIGHT) */}
        <div
          className={`absolute flex gap-2 md:gap-4 ${isFullScreen ? "top-6 right-6" : "top-6 md:top-10 right-6 md:right-10"}`}
        >
          <button
            onClick={togglePiP}
            className="p-3 md:p-4 bg-slate-800/50 backdrop-blur-md rounded-2xl text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all shadow-xl"
          >
            <ExternalLink size={20} />
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-3 md:p-4 bg-slate-800/50 backdrop-blur-md rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all shadow-xl"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* STATUS LABEL */}
        <div
          className={`font-black text-slate-600 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4 md:mb-8 text-center px-4
          ${isFullScreen ? "text-xl md:text-3xl" : "text-[10px] md:text-sm"}`}
        >
          SYSTEM STATUS:{" "}
          <span className={isActive ? "text-emerald-500" : "text-amber-500"}>
            {isActive ? "Active Deployment" : "Standby"}
          </span>
        </div>

        {/* TIMER TEXT - FLUID TYPOGRAPHY FIX */}
        <div
          className={`font-black text-white font-mono tracking-tighter tabular-nums leading-none text-center select-none
          ${
            isFullScreen
              ? "text-[22vw] md:text-[20vw]"
              : "text-[18vw] sm:text-[15vw] md:text-[10rem]"
          }`}
          style={{
            textShadow: isActive ? "0 0 40px rgba(16, 185, 129, 0.2)" : "none",
          }}
        >
          {formatTime(timeLeft)}
        </div>

        {/* CONTROLS */}
        <div
          className={`flex flex-wrap justify-center gap-4 md:gap-8 mt-8 md:mt-16 w-full px-4`}
        >
          <button
            onClick={handleStart}
            className={`flex items-center justify-center gap-3 px-8 md:px-14 py-4 md:py-7 rounded-3xl md:rounded-[2.5rem] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-xs md:text-base transition-all shadow-2xl active:scale-95 border-b-4 md:border-b-8 flex-1 max-w-[280px]
              ${isActive ? "bg-amber-500 border-amber-700 text-black" : "bg-emerald-500 border-emerald-700 text-black"}
            `}
          >
            {isActive ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
            {isActive ? "Pause" : "Start Focus"}
          </button>

          <button
            onClick={resetTimer}
            className="p-4 md:p-7 bg-slate-800 text-slate-400 rounded-3xl md:rounded-[2.5rem] hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-slate-700 shadow-xl"
          >
            <RotateCcw size={28} />
          </button>
        </div>
      </section>

      {/* SESSION CARDS GRID */}
      {!isFullScreen && (
        <div className="max-w-6xl mx-auto mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onToggle={toggleSession}
              onTopicChange={updateSessionTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessions;
