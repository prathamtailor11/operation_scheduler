import React, { useState } from 'react';

const LoginSignup = ({ onLogin, onBack }) => {
  const [role, setRole] = useState('doctor');
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: Replace with real authentication logic
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    onLogin({ ...form, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center animate-fade-in">
        {/* Left branding panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white px-8 py-12 w-1/2 h-full">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg animate-bounce mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-center">Hospital Operation Scheduler</h2>
          <p className="text-lg text-center opacity-90">Advanced Surgical Management System</p>
        </div>
        {/* Right form panel */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 relative w-full h-full bg-white/95 md:rounded-none rounded-none md:shadow-none shadow-none border-none">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 top-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-center bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              {isLogin ? 'Login' : 'Sign Up'} as
            </h2>
          </div>
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 ${role === 'doctor' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 ${role === 'client' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border-indigo-600'} shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400`}
              onClick={() => setRole('client')}
            >
              Client
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  placeholder="Your Name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Password"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              className="text-blue-600 hover:underline font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setIsLogin((prev) => !prev)}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
