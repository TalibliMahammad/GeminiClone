## About the Project

**Gemini Clone** is a high-performance web application that replicates the sleek, minimalist user interface of Google Gemini. While the front-end focuses on a pixel-perfect, interactive user experience, the core architecture is powered by the ultra-fast **Groq API**, delivering near-instant AI responses. 

The project demonstrates advanced state management, robust context continuity, and secure production deployment.

## Tech Stack & Core Concepts

Here is a quick breakdown of what was used and why:

*   **Vite & React** – Chosen for fast scaffolding, hot module replacement, and efficient UI rendering.
*   **Context API & `useState`** – Utilized for centralized global state management. It preserves the complete conversation history (`messages` array), allowing users to continue threads seamlessly without losing prior context.
*   **Tailwind CSS** – Used to build a 100% responsive, dark-mode optimized layout that adapts flawlessly from desktop monitors to mobile screens.
*   **Groq API (`llama-3.3-70b-versatile`)** – Integrated as the main AI engine to handle complex text generation with sub-second latency.
*   **Environment Variables (`.env`)** – Implemented to securely isolate sensitive API keys away from the client-side codebase.
*   **Vercel** – Used for continuous deployment, managing production-ready environment configurations smoothly.

*   <img width="1889" height="871" alt="Ekran şəkli 2026-06-02 124916" src="https://github.com/user-attachments/assets/d90c1f3f-1f89-4f9d-a40f-db2ff9ef026e" />
<img width="1897" height="871" alt="Ekran şəkli 2026-06-02 124856" src="https://github.com/user-attachments/assets/9c4bc66f-abfa-4ff8-b4cc-956ef1f472de" />
