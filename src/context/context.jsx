import { createContext, useEffect, useState } from "react";
import runChat from "../config/gemini";





export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");


    console.log(prevPrompts);


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
    let response;
    if (prompt !== undefined) {
        if (!fromRecent) {
            setPrevPrompts((prev) => [...prev, prompt]);
        }
        setRecentPrompt(prompt);
        response = await runChat(prompt);
    } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await runChat(input);
    }

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i]
        } else {
            newResponse += "<b>" + responseArray[i] + "</b>"
        }
    }
    let newResponse2 = newResponse.split("*").join("<br>")
    let newResponseArray = newResponse2.split("");
    for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + "");
    }
    setResultData(newResponse2)
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
