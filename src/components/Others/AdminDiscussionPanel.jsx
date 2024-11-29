"use client";

import { useState, useEffect, useRef } from "react";
import moment from 'moment';

const AdminDiscussionPanel = () => {
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
          parsedUser.role === "employee" ? parsedUser.data?.firstName + " " + parsedUser.data?.lastName :
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
        const messageInput = document.getElementById("messageInput");
        messageInput?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [inputFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const newDiscussion = {
      id: Date.now(),
      message: newMessage,
      sender: currentUser.name,
      timestamp: new Date().toISOString(),
      role: currentUser.role
    };

    const updatedDiscussions = [...discussions, newDiscussion];
    setDiscussions(updatedDiscussions);
    localStorage.setItem("discussions", JSON.stringify(updatedDiscussions));
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDelete = (id) => {
    if (currentUser?.role !== "admin") return;
    const updatedDiscussions = discussions.filter(
      (discussion) => discussion.id !== id
    );
    setDiscussions(updatedDiscussions);
    localStorage.setItem("discussions", JSON.stringify(updatedDiscussions));
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 max-w-2xl mx-auto text-gray-700 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discussion Panel
        </h2>
        <div className="flex gap-2">
          {discussions
            .filter(d => d.role === "employee")
            .map(d => d.sender)
            .filter((sender, index, self) => self.indexOf(sender) === index)
            .map((employeeName, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
              >
                {employeeName}
              </span>
            ))}
        </div>
      </div>

      <div className="space-y-4 mb-6 h-[400px] overflow-y-auto custom-scrollbar">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className={`p-4 rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
              discussion.role === 'admin' 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'
                : discussion.role === 'employee'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                : 'bg-gradient-to-r from-gray-50 to-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${
                  discussion.role === 'admin' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-blue-200' : 
                  discussion.role === 'employee' ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-4 ring-green-200' : 'bg-gradient-to-br from-gray-500 to-slate-600'
                }`}>
                  <span className="text-sm font-bold text-white">
                    {discussion.sender.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-sm">{discussion.sender}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`capitalize font-medium px-2 py-0.5 rounded-full ${
                      discussion.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                      discussion.role === 'employee' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {discussion.role}
                    </span>
                    <span>•</span>
                    <span>{moment(discussion.timestamp).format('MM/DD/YY h:mm A')}</span>
                  </div>
                </div>
              </div>
              {currentUser?.role === "admin" && (
                <button
                  onClick={() => handleDelete(discussion.id)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm pl-12 leading-relaxed">{discussion.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-inner">
        <textarea
          id="messageInput"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Type your message... (Press '/' to focus)"
          className="w-full rounded-lg border border-gray-200 p-3 mb-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          rows={2}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDiscussionPanel;
