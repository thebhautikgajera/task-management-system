import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Login = ({handleLogin}) => {
  Login.propTypes = {
    handleLogin: PropTypes.func.isRequired
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showNote, setShowNote] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';
    
    if (wasRemembered && savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData.email, formData.password);

    // Save credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
      localStorage.setItem('rememberedPassword', formData.password);
      localStorage.setItem('rememberMe', 'true');
    } else {
      // Clear saved credentials if remember me is unchecked
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
    }

    setFormData({
      email: "",
      password: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-40 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-blue-500/10 animate-gradient"></div>
      </div>

      {/* Note Popup Overlay */}
      {showNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-violet-900/90 to-indigo-900/90 p-8 rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-[90%] relative transform transition-all duration-300 scale-100 animate-fadeIn">
            <div className="absolute -top-4 -right-4">
              <button
                onClick={() => setShowNote(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-all duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Login Information</h3>
              <p className="text-white/60">Here&apos;s everything you need to know about logging in</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Admin Access</h4>
                    <p className="text-white/60">Email: <span className="text-purple-300">admin@gmail.com</span></p>
                    <p className="text-white/60">Password: <span className="text-purple-300">Admin@123</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Employee Access</h4>
                      <p className="text-white/60">Email: <span className="text-purple-300">johndoe@gmail.com</span></p>
                      <p className="text-white/60">Password: <span className="text-purple-300">Johndoe@123</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowNote(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl w-[500px] border border-white/20 relative z-10 hover:shadow-purple-500/20 transition-all duration-500">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 drop-shadow-lg mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-base font-light">
            Sign in to continue your journey
          </p>
          <button
            onClick={() => setShowNote(true)}
            className="mt-4 px-4 py-2 text-sm text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-white/20 flex items-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Need help?
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2 group-hover:text-purple-300 transition-colors">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              placeholder="Enter your email"
            />
          </div>

          <div className="group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2 group-hover:text-purple-300 transition-colors">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 text-purple-500 focus:ring-purple-500 bg-white/5 border-white/10 rounded-md transition-colors duration-200"
            />
            <label htmlFor="remember" className="ml-3 text-sm text-gray-200 hover:text-purple-300 transition-colors duration-200">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-600 text-white rounded-xl font-medium hover:from-violet-600 hover:via-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg border border-white/20 group"
          >
            <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              Sign in
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
