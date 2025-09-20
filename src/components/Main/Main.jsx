import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context';



const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>


            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Dev</span></p>
                            <p>How can I help you</p>
                        </div>

                        <div className="cards">
                            <div className="card">
                                <p>
                                    Navigate with Compass
                                </p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Write down your ideas</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Send a message</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card">
                                <p>Code examples</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>

                    </>

                ) : (
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />

                            {loading

                                ? <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>

                                : null
                            }

                            <p dangerouslySetInnerHTML={{ __html: resultData }}></p>

                        </div>
                    </div>
                )

                }

                <div className="main-bottom">

                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} placeholder='Enter a Promt Here' type="text" />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input ? <img onClick={() => onSent(input)} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>

                    <p className='bottom-info'>
                        Gemini clone app. Made with by Dev Mahammad Talibli
                    </p>
                    
                </div>
            </div>
        </div>
    )
}

export default Main