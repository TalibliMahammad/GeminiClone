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
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversation(parsed[0]);
          setShowResult(true);
          setResultData(parsed[0].response || "");
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
    setResultData(conversation.response || "");
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

  const typeMarkdown = async (text) => {
    const tokens = text.split(" ");
    let built = "";
    for (let i = 0; i < tokens.length; i++) {
      built += tokens[i] + (i < tokens.length - 1 ? " " : "");
      setResultData(built);
      await new Promise((resolve) => setTimeout(resolve, 28));
    }
  };

  const onSent = async (prompt) => {
    const promptText = prompt !== undefined ? prompt : input;
    if (!promptText.trim()) return;

    const newConversation = {
      id: Date.now().toString(),
      title: getConversationTitle(promptText),
      prompt: promptText,
      response: "",
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setShowResult(true);
    setLoading(true);
    setResultData("");
    setInput("");

    const response = await runChat(promptText);

    await typeMarkdown(response);

    setLoading(false);
    setConversations((prev) =>
      prev.map((item) => (item.id === newConversation.id ? { ...item, response } : item))
    );
    setActiveConversation((prev) =>
      prev && prev.id === newConversation.id ? { ...prev, response } : prev
    );
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
    toggleRecording,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;