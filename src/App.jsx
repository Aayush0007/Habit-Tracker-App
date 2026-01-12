import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";

// Tactical Components
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import StudySessions from "./pages/StudySessions/StudySessions";
import DailyTracker from "./pages/DailyTracker/DailyTracker";
import Analytics from "./pages/Analytics/Analytics";
import CalendarView from "./pages/Calendar/CalendarView";
import MockTests from "./pages/MockTests/MockTests";
import WeeklyReview from "./pages/WeeklyReview/WeeklyReview";
import Settings from "./pages/Settings/Settings";
import SyllabusTracker from "./pages/Syllabus/SyllabusTracker";
import NotificationProvider from "./components/Notification/Notification";

function App() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitializing(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (initializing)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-blue-500 font-black tracking-[0.3em] text-[10px] uppercase">
          Booting Command Suite
        </p>
      </div>
    );

  if (!session) return <Auth />;

  return (
    <>
      <NotificationProvider />
      <Router>
        <div className="min-h-screen bg-slate-950 text-white pb-24">
          <Routes>
            <Route path="/" element={<Dashboard user={session.user} />} />
            <Route
              path="/sessions"
              element={<StudySessions user={session.user} />}
            />
            <Route
              path="/tracker"
              element={<DailyTracker user={session.user} />}
            />
            <Route path="/mocks" element={<MockTests user={session.user} />} />
            <Route
              path="/analytics"
              element={<Analytics user={session.user} />}
            />
            <Route
              path="/calendar"
              element={<CalendarView user={session.user} />}
            />
            <Route
              path="/review"
              element={<WeeklyReview user={session.user} />}
            />
            <Route
              path="/settings"
              element={<Settings user={session.user} />}
            />
            <Route
              path="/syllabus"
              element={<SyllabusTracker user={session.user} />}
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Navigation persistent across routes */}
          <Navbar />
        </div>
      </Router>
    </>
  );
}

export default App;
