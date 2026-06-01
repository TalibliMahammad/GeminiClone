// filepath: src/App.jsx
import React from "react";
import ContextProvider from "./context/context";
import Sidebar from "./components/Sidebar.jsx/Sidebar";
import Main from "./components/Main/Main";
import "./index.css";

function App() {
  return (
    <ContextProvider>
      <div className="app-shell">
        <Sidebar />
        <Main />
      </div>
    </ContextProvider>
  );
}

export default App;