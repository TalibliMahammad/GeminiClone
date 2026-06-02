// filepath: src/components/Sidebar.jsx/Sidebar.jsx
import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { Context } from "../../context/context";
import { assets } from "../../assets/assets";

const Sidebar = ({ isOpen, onClose }) => {
  const { conversations, activeConversation, loadConversation, newChat, deleteConversation } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img src={assets.gemini_icon} alt="Gemini" />
            {!collapsed && (
              <div className="brand-text">
                <p>Mahammad Ai</p>
                <span>Conversation history</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-collapse"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {isOpen && (
          <button
            className="sidebar-close-mobile"
            onClick={onClose}
            type="button"
            aria-label="Close menu"
          >
            ×
          </button>
        )}

      <button className="btn-new-chat" onClick={newChat} aria-label="New chat">
        <span>+</span>
        {!collapsed && "New Chat"}
      </button>

      <div className="sidebar-history">
        {conversations.length === 0 ? (
          <div className="history-empty">No chats yet. Start a new conversation.</div>
        ) : (
          conversations.map((item) => (
            <div
              key={item.id}
              className={`history-item ${activeConversation?.id === item.id ? "active" : ""}`}
              onClick={() => loadConversation(item.id)}
              role="button"
              tabIndex={0}
            >
              <div className="history-left">
                <div className="history-title">{item.title}</div>
                {!collapsed && <small>{new Date(item.createdAt).toLocaleDateString()}</small>}
              </div>
              <div className="history-right">
                <button
                  className="history-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Conversation silinsin?")) deleteConversation(item.id);
                  }}
                  aria-label="Delete conversation"
                  title="Sil"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <small>Minimal Gemini • Dark</small>
        </div>
      )}
    </aside>
      <div className={`sidebar-backdrop ${isOpen ? "visible" : ""}`} onClick={onClose} />
    </>
  );
};

export default Sidebar;