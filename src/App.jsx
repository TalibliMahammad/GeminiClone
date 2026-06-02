// filepath: src/App.jsx
import React, { useState } from "react";
import ContextProvider from "./context/context";
import Sidebar from "./components/Sidebar.jsx/Sidebar";
import Main from "./components/Main/Main";
import "./index.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ContextProvider>
      <div className="app-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Main onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </ContextProvider>
  );
}

export default App;