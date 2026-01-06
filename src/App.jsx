import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import StudySessions from "./pages/StudySessions/StudySessions";
import Navbar from "./components/Navbar/Navbar";
import DailyTracker from "./pages/DailyTracker/DailyTracker";
import MockForm from "./pages/MockTests/MockForm";
import Analytics from './pages/Analytics/Analytics';
import CalendarView from './pages/Calendar/CalendarView';
import MockTests from './pages/MockTests/MockTests';
import WeeklyReview from './pages/WeeklyReview/WeeklyReview';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white pb-24">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sessions" element={<StudySessions />} />
          <Route path="/tracker" element={<DailyTracker />} />
          <Route
            path="/mocks"
            element={
              <div className="p-6">
                <MockForm />
              </div>
            }
          />
          {/* FIXED: This is now INSIDE the <Routes> block */}
          <Route path="/analytics" element={<Analytics />} /> 
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/mocks" element={<MockTests />} />
          <Route path="/review" element={<WeeklyReview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        
        {/* Navbar stays OUTSIDE because it is a global UI element */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;