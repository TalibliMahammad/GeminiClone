// filepath: src/components/Main/Main.jsx
// ...existing code...
import React, { useContext, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Context } from "../../context/context";
import { assets } from "../../assets/assets";
import "./Main.css";

const CodeBlock = ({ inline, className, children }) => {
  const language = /language-(\w+)/.exec(className || "")?.[1] || "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.toString());
    } catch {
      // ignore
    }
  };

  if (inline) {
    return <code className="inline-code">{children}</code>;
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{language}</span>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

const Main = ({ onOpenSidebar }) => {
  const {
    onSent,
    activeConversation,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    toggleRecording,
    recording,
  } = useContext(Context);

  const textareaRef = useRef(null);
  const messageListRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [input]);

  // scroll to bottom when messages change or streaming result changes
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;
    // small timeout to wait for rendered changes
    const id = setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 80);
    return () => clearTimeout(id);
  }, [activeConversation?.messages?.length, resultData, loading]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSent(input);
    }
  };

  const chatHeaderTitle = activeConversation ? "Active conversation" : "How can I help you today?";

  return (
    <main className="main">
      <div className="main-content">
        {!showResult ? (
          <section className="welcome-panel">
          <button className="mobile-menu-button" onClick={onOpenSidebar} type="button" aria-label="Open sidebar menu">
            ☰
          </button>
          <div className="welcome-copy">
            <p className="welcome-label">
                Hello, I’m <span>Gemini</span>
              </p>
              <h1>How can I help you today?</h1>
              <p>
                Ask about code, design, summaries, ideas, or get instant
                smart suggestions with clean Markdown and code rendering.
              </p>
            </div>

            <div className="suggestion-grid">
              <button
                className="suggestion-card"
                onClick={() =>
                  onSent("Write a responsive landing page using React and Tailwind CSS.")
                }
              >
                <p>Build a landing page</p>
              </button>
              <button
                className="suggestion-card"
                onClick={() => onSent("Explain the difference between React state and props.")}
              >
                <p>Explain React</p>
              </button>
              <button
                className="suggestion-card"
                onClick={() => onSent("Generate a JavaScript function to validate email addresses.")}
              >
                <p>Validate email</p>
              </button>
              <button
                className="suggestion-card"
                onClick={() => onSent("Show example Python code for reading a CSV file and printing rows.")}
              >
                <p>Python example</p>
              </button>
            </div>
          </section>
        ) : (
          <section className="chat-panel">
            <div className="chat-header">
            <button className="mobile-menu-button" onClick={onOpenSidebar} type="button" aria-label="Open sidebar menu">
              ☰
            </button>
            <div className="chat-title">
              <p>Latest request</p>
              <h2>{chatHeaderTitle}</h2>
            </div>
          </div>

            <div className="message-list" ref={messageListRef}>
              {/* Render entire conversation */}
              {(activeConversation?.messages || []).map((m, idx) => {
                const key = `${m.role}-${idx}-${m.createdAt || idx}`;
                if (m.role === "user") {
                  return (
                    <div className="message message-user" key={key}>
                      <div className="message-bubble user-bubble">{m.content}</div>
                    </div>
                  );
                }
                return (
                  <div className="message message-assistant" key={key}>
                    <div className="assistant-top">
                      <div className="assistant-avatar">
                        <img src={assets.gemini_icon} alt="Gemini" />
                        <div className="assistant-meta">
                          <strong>Gemini</strong>
                          <small>AI assistant</small>
                        </div>
                      </div>
                    </div>

                    <div className="assistant-bubble">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{ code: CodeBlock }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {/* While loading, show streaming assistant bubble as last item */}
              {loading && (
                <div className="message message-assistant">
                  <div className="assistant-top">
                    <div className="assistant-avatar">
                      <img src={assets.gemini_icon} alt="Gemini" />
                      <div className="assistant-meta">
                        <strong>Gemini</strong>
                        <small>AI assistant</small>
                      </div>
                    </div>
                  </div>

                  <div className="assistant-bubble">
                    {resultData ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{ code: CodeBlock }}
                      >
                        {resultData}
                      </ReactMarkdown>
                    ) : (
                      <div className="typing-indicator">
                        <span />
                        <span />
                        <span />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </section>
        )}
      </div>

      <div className="main-bottom">
        <div className="input-pill">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a prompt to Gemini..."
            rows="1"
          />

          <div className="input-icons">
            <button type="button" className="icon-button" title="Upload image">
              <img src={assets.gallery_icon} alt="Upload" />
            </button>
            <button
              type="button"
              className={`icon-button mic-action ${recording ? "active" : ""}`}
              title="Voice input"
              onClick={toggleRecording}
            >
              <img src={assets.mic_icon} alt="Voice" />
            </button>
            <button
              type="button"
              className="send-button"
              onClick={() => onSent(input)}
              disabled={!input.trim()}
            >
              <img src={assets.send_icon} alt="Send" />
            </button>
          </div>
        </div>

        <p className="bottom-caption">
          Gemini clone app. Made with ❤️ by Dev Mahammad Talibli.
        </p>
      </div>
    </main>
  );
};

export default Main;
// ...existing code...