import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import SessionCard from "./SessionCard";
import { useStudySessions } from "../../hooks/useStudySessions";
import { calculateTotalStudyHours } from "../../features/studySessions/sessionLogic";

const StudySessions = () => {
  const { sessions, toggleSession, updateSessionTopic, loading } = useStudySessions();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const wakeLock = useRef(null);
  
  // Tactical Audio Assets
  const startAudio = useRef(new Audio('/Assets/timerStart.wav'));
  const endAudio = useRef(new Audio('/Assets/timerEnd.mp3'));

  // PiP Logic Refs
  const canvasRef = useRef(document.createElement('canvas'));
  const videoRef = useRef(document.createElement('video'));

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('studyTimer_timeLeft');
    return savedTime ? parseInt(savedTime, 10) : 120 * 60;
  });
  
  const [isActive, setIsActive] = useState(() => {
    const savedActive = localStorage.getItem('studyTimer_isActive');
    return savedActive === 'true';
  });

  // --- 1. MEDIA SESSION HANDLERS (PIP CONTROLS) ---
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Warrior Timer: ${formatTime(timeLeft)}`,
        artist: 'Command Center',
        album: isActive ? 'Deployment Active' : 'System Standby',
      });

      // These handlers map the PiP window buttons to your app's logic
      navigator.mediaSession.setActionHandler('play', () => handleStart());
      navigator.mediaSession.setActionHandler('pause', () => handleStart());
      navigator.mediaSession.setActionHandler('seekbackward', () => resetTimer());
    }
  }, [timeLeft, isActive]);

  // --- 2. WAKE LOCK ENGINE ---
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLock.current) {
        wakeLock.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) { console.warn("WakeLock Restricted"); }
  };

  // --- 3. PERSISTENCE & PIP REDRAW ---
  useEffect(() => {
    localStorage.setItem('studyTimer_timeLeft', timeLeft);
    localStorage.setItem('studyTimer_isActive', isActive);
    
    if (document.pictureInPictureElement) {
      drawPiPCanvas();
    }
  }, [timeLeft, isActive]);

  // --- 4. TIMER ENGINE ---
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      requestWakeLock();
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      endAudio.current.play().catch(e => console.error("Audio blocked", e));
      if (wakeLock.current) wakeLock.current.release().then(() => wakeLock.current = null);
    } else {
      if (wakeLock.current) wakeLock.current.release().then(() => wakeLock.current = null);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- 5. THE ADVANCED PiP UI ENGINE ---
  const drawPiPCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400; // Squared for better UI

    // Background
    ctx.fillStyle = '#020617'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Progress Ring Calculation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    const progress = timeLeft / (120 * 60);

    // Draw Background Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw Active Progress Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress));
    ctx.strokeStyle = isActive ? '#10b981' : '#f43f5e';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Time Text
    ctx.shadowBlur = 15;
    ctx.shadowColor = isActive ? '#10b981' : '#f43f5e';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatTime(timeLeft), centerX, centerY);

    // Status Text
    ctx.shadowBlur = 0;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(isActive ? 'MISSION ACTIVE' : 'PAUSED', centerX, centerY + 60);
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        const video = videoRef.current;
        
        // Browser hack: A video must have audio interaction to enable Media Session controls
        video.muted = false; 
        video.volume = 0.001; // Effectively silent but "active" for the browser
        
        drawPiPCanvas();
        const stream = canvasRef.current.captureStream(10); 
        video.srcObject = stream;
        
        await video.play();
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP Error:", error);
    }
  };

  // --- 6. AUDIO & START LOGIC ---
  const handleStart = async () => {
    // Force a "User Gesture" for Audio Context
    const primeAudio = (audio) => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(e => console.warn("Priming failed", e));
    };

    primeAudio(startAudio.current);
    primeAudio(endAudio.current);

    if (!isActive) {
      if (timeLeft === 120 * 60) {
        startAudio.current.play().catch(e => console.error("Audio blocked", e));
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
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(120 * 60);
  };

  const totalHours = calculateTotalStudyHours(sessions);

  return (
    <div className={`p-6 space-y-6 pb-24 ${isFullScreen ? 'bg-slate-950 fixed inset-0 z-[100] flex flex-col items-center justify-center' : ''}`}>
      
      {!isFullScreen && (
        <header className="flex justify-between items-center px-2">
          <div>
            <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">Command Center</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 underline decoration-blue-500/50 underline-offset-8">Focus Ops</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-emerald-400 italic tabular-nums">{totalHours}h</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Logged</p>
          </div>
        </header>
      )}

      {/* TACTICAL TIMER SECTION */}
      <section className={`card bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center space-y-8 shadow-2xl relative transition-all duration-500 ${isFullScreen ? 'w-full h-full border-none' : 'rounded-[3rem] p-12'}`}>
        
        <div className="absolute top-8 right-8 flex gap-4">
          <button onClick={togglePiP} className="p-3 bg-slate-800/50 backdrop-blur-md rounded-2xl text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all shadow-lg">
            <ExternalLink size={20} />
          </button>
          <button onClick={toggleFullScreen} className="p-3 bg-slate-800/50 backdrop-blur-md rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all shadow-lg">
            {isFullScreen ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
          </button>
        </div>

        <div className={`font-black text-slate-600 uppercase tracking-[0.5em] ${isFullScreen ? 'text-2xl' : 'text-[11px]'}`}>
          {isActive ? 'Mission Status: Active' : 'System Status: Standby'}
        </div>
        
        <div className={`font-black text-white font-mono tracking-tighter tabular-nums transition-all leading-none ${isFullScreen ? 'text-[20vw]' : 'text-8xl'}`}>
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-8">
          <button 
            onClick={handleStart}
            className={`flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-90 border-b-8 ${
              isActive ? 'bg-amber-500 border-amber-700 text-black' : 'bg-emerald-500 border-emerald-700 text-black'
            }`}
          >
            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            {isActive ? 'Pause' : 'Start Focus'}
          </button>
          
          <button onClick={resetTimer} className="p-5 bg-slate-800 text-slate-400 rounded-[1.5rem] hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-slate-700 shadow-xl">
            <RotateCcw size={28} />
          </button>
        </div>
      </section>

      {!isFullScreen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onToggle={toggleSession} onTopicChange={updateSessionTopic} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessions;