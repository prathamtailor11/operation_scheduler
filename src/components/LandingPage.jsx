import React from 'react';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent tracking-tight">
            Hospital Operation Scheduler
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-slate-700 font-medium mb-8 max-w-2xl">
          Advanced Surgical Management System for seamless scheduling, management, and tracking of hospital operations. Empowering doctors, staff, and patients with modern, efficient tools.
        </p>
        <button
          onClick={onLogin}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-xl text-lg font-semibold shadow-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
