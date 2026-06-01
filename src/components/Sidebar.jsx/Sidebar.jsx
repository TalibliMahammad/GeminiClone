// filepath: src/components/Sidebar.jsx/Sidebar.jsx
import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { Context } from "../../context/context";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const { conversations, activeConversation, loadConversation, newChat } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={assets.gemini_icon} alt="Gemini" />
          {!collapsed && (
            <div className="brand-text">
              <p>Gemini</p>
              <span>Conversation history</span>
            </div>
          )}
        </div>
        <button className="sidebar-collapse" onClick={() => setCollapsed((prev) => !prev)}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <button className="btn-new-chat" onClick={newChat}>
        <span>+</span>
        {!collapsed && "New Chat"}
      </button>

      <div className="sidebar-history">
        {conversations.length === 0 ? (
          <div className="history-empty">No chats yet. Start a new conversation.</div>
        ) : (
          conversations.map((item) => (
            <button
              key={item.id}
              className={`history-item ${activeConversation?.id === item.id ? "active" : ""}`}
              onClick={() => loadConversation(item.id)}
            >
              <div className="history-title">{item.title}</div>
              {!collapsed && <small>{new Date(item.createdAt).toLocaleDateString()}</small>}
            </button>
          ))
        )}
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <small>Gemini Clone • Dark theme</small>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;