"use client";

import { useState, useEffect, useRef } from "react";
import moment from 'moment';

const DiscussionPanel = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [discussions]);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser({
        role: parsedUser.role,
        name: parsedUser.role === "admin" ? "Admin" : 
          parsedUser.role === "employee" ? "Employee" :
          parsedUser.data?.firstName + " " + parsedUser.data?.lastName
      });
    }

    const storedDiscussions = localStorage.getItem("discussions");
    if (storedDiscussions) {
      setDiscussions(JSON.parse(storedDiscussions));
    } else {
      localStorage.setItem("discussions", JSON.stringify([]));
    }

    const handleKeyPress = (e) => {
      if (e.key === "/" && !inputFocused && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("messageInput")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [inputFocused]);

  const handleAddMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;

    const message = {
      id: Date.now(),
      message: newMessage,
      sender: currentUser.name,
      timestamp: new Date().toISOString(),
      role: currentUser.role
    };

    const updatedDiscussions = [...discussions, message];
    setDiscussions(updatedDiscussions);
    localStorage.setItem("discussions", JSON.stringify(updatedDiscussions));
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddMessage(e);
    }
  };

  const handleDelete = (messageId) => {
    if (currentUser?.role !== "admin") return;
    const updatedDiscussions = discussions.filter(discussion => discussion.id !== messageId);
    setDiscussions(updatedDiscussions);
    localStorage.setItem("discussions", JSON.stringify(updatedDiscussions));
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
            Team Discussion
          </h2>
          <div className="flex items-center gap-2">
            {discussions
              .map(d => ({ name: d.sender, role: d.role }))
              .filter((participant, index, self) => 
                index === self.findIndex(p => p.name === participant.name)
              )
              .map((participant, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    participant.role === 'admin'
                      ? 'bg-indigo-100 text-indigo-600'
                      : participant.role === 'employee'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {participant.name}
                </span>
              ))}
          </div>
        </div>

        <div className="space-y-6 mb-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id}
              className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 ${
                discussion.role === 'admin' 
                  ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100'
                  : discussion.role === 'employee'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner ${
                    discussion.role === 'admin' 
                      ? 'bg-gradient-to-br from-indigo-100 to-purple-100'
                      : discussion.role === 'employee'
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                    <span className={`text-xl font-bold ${
                      discussion.role === 'admin' 
                        ? 'text-indigo-600'
                        : discussion.role === 'employee'
                        ? 'text-green-600'
                        : 'text-gray-700'
                    }`}>
                      {discussion.sender.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className={`font-semibold text-lg block ${
                      discussion.role === 'admin' 
                        ? 'text-indigo-600'
                        : discussion.role === 'employee'
                        ? 'text-green-600'
                        : 'text-gray-800'
                    }`}>
                      {discussion.sender}
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        discussion.role === 'admin' 
                          ? 'bg-indigo-100 text-indigo-600'
                          : discussion.role === 'employee'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {discussion.role}
                      </span>
                      <span className="text-sm text-gray-400">
                        {moment(discussion.timestamp).format('DD MMMM, YYYY [at] HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(discussion.id)}
                    className="text-red-400 hover:text-red-600 transition-all duration-200 p-2 rounded-full hover:bg-red-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="pl-16">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{discussion.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {currentUser && (
          <form onSubmit={handleAddMessage} className="space-y-4">
            <div className="relative">
              <textarea
                id="messageInput"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Press '/' to start typing, Enter to send and Shift+Enter to new line..."
                className="w-full px-6 py-4 text-gray-700 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none placeholder-gray-400 shadow-inner"
                rows="4"
                style={{ minHeight: "120px" }}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newMessage.trim()}
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default DiscussionPanel;
