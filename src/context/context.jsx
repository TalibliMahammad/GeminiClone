import { createContext, useEffect, useState } from "react";
import runChat from "../config/gemini";





export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
   const [prevPrompts, setPrevPrompts] = useState(() => {
        const saved = localStorage.getItem("prevPrompts");
        return saved ? JSON.parse(saved) : [];
    });


    useEffect(() => {
        localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
    }, [prevPrompts]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");


    const delayPara = (index, nexWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nexWord)
        }, 75 * index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);

    }
    const onSent = async (prompt, fromRecent = false) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let usedPrompt = prompt !== undefined ? prompt : input;
        if (!fromRecent && prompt === undefined) {
            setPrevPrompts((prev) => [...prev, usedPrompt]);
        }
        setRecentPrompt(usedPrompt);
        let response = await runChat(usedPrompt);

        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i]
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("<br>");
        let newResponseArray = newResponse2.split(" "); // simvol yox, sözə böl

        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i] + " ";
            delayPara(i, nextWord);
        }

        setLoading(false);
        setInput("");
    };

    const ContextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }


    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    );

}

export default ContextProvider
