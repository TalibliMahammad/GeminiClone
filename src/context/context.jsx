// ...existing code...
import { createContext, useEffect, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const STORAGE_KEY = "geminiCloneConversations";

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [recording, setRecording] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const normalized = parsed.map((c) => {
          if (Array.isArray(c.messages)) return c;
          const msgs = [];
          if (c.prompt) msgs.push({ role: "user", content: c.prompt });
          if (c.response) msgs.push({ role: "assistant", content: c.response });
          return { ...c, messages: msgs };
        });
        setConversations(normalized);
        if (normalized.length > 0) {
          setActiveConversation(normalized[0]);
          setShowResult(true);
          const last = normalized[0].messages?.slice(-1)[0];
          setResultData((last && last.role === "assistant") ? last.content || "" : "");
        }
      }
    } catch (error) {
      console.warn("Could not load saved conversations", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const getConversationTitle = (prompt) => {
    const cleaned = prompt.trim().replace(/\n+/g, " ");
    return cleaned.length > 32 ? `${cleaned.slice(0, 32)}…` : cleaned || "New conversation";
  };

  const loadConversation = (id) => {
    const conversation = conversations.find((item) => item.id === id);
    if (!conversation) return;

    setActiveConversation(conversation);
    setResultData(
      conversation.messages?.slice(-1)[0]?.role === "assistant"
        ? conversation.messages.slice(-1)[0].content || ""
        : ""
    );
    setShowResult(true);
    setLoading(false);
  };

  const newChat = () => {
    setShowResult(false);
    setActiveConversation(null);
    setResultData("");
    setInput("");
    setLoading(false);
  };

  const deleteConversation = (id) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeConversation?.id === id) {
        if (next.length > 0) {
          setActiveConversation(next[0]);
          setResultData(next[0].response || "");
          setShowResult(true);
        } else {
          newChat();
        }
      }
      return next;
    });
  };

  const toggleRecording = () => {
    setRecording((prev) => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => setRecording(false), 2400);
      }
      return nextState;
    });
  };

  const onListen = () => {
    if (!resultData || typeof window === "undefined") return;
    setListening(true);
    const utterance = new SpeechSynthesisUtterance(resultData.replace(/```/g, ""));
    utterance.onend = () => setListening(false);
    window.speechSynthesis.speak(utterance);
  };

  const typeMarkdown = async (text, onChunk) => {
    // stream-like word-by-word builder, call onChunk for UI updates
    const tokens = text.split(" ");
    let built = "";
    for (let i = 0; i < tokens.length; i++) {
      built += tokens[i] + (i < tokens.length - 1 ? " " : "");
      if (onChunk) onChunk(built);
      await new Promise((resolve) => setTimeout(resolve, 28));
    }
    return built;
  };

  const appendMessageToConversation = (conversationId, message) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, messages: [...(c.messages || []), message], updatedAt: new Date().toISOString() } : c))
    );
    setActiveConversation((prev) => (prev && prev.id === conversationId ? { ...prev, messages: [...(prev.messages || []), message], updatedAt: new Date().toISOString() } : prev));
  };

  const onSent = async (prompt) => {
    const promptText = prompt !== undefined ? prompt : input;
    if (!promptText.trim()) return;

    setInput("");

    let conversationId = activeConversation?.id;
    if (!conversationId) {
      conversationId = Date.now().toString();
      const newConversation = {
        id: conversationId,
        title: getConversationTitle(promptText),
        messages: [],
        response: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversation(newConversation);
    }

    const userMsg = { role: "user", content: promptText, createdAt: new Date().toISOString() };
    appendMessageToConversation(conversationId, userMsg);
    setShowResult(true);
    setLoading(true);
    setResultData("");

    const response = await runChat(promptText);

    await typeMarkdown(response, (chunk) => {
      setResultData(chunk);
    });

    const assistantMsg = { role: "assistant", content: response, createdAt: new Date().toISOString() };
    appendMessageToConversation(conversationId, assistantMsg);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              response,
              title: c.title || getConversationTitle(promptText),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setActiveConversation((prev) =>
      prev && prev.id === conversationId
        ? {
            ...prev,
            response,
            title: prev.title || getConversationTitle(promptText),
            updatedAt: new Date().toISOString(),
          }
        : prev
    );

    setLoading(false);
    setResultData(response);
  };

  const value = {
    input,
    setInput,
    conversations,
    activeConversation,
    showResult,
    loading,
    resultData,
    recording,
    listening,
    onSent,
    onListen,
    loadConversation,
    newChat,
    deleteConversation,
    toggleRecording,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
// ...existing code...