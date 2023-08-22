import React, { useState, useRef, useEffect } from 'react';
import './styles/core.css';
import { askQuestion } from './services/api.js';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showChat, setShowChat] = useState(false); // State to control chat visibility
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const convertAndFormatText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)(\.\s|\s|$)/g;
    const paragraphs = text.split('\n'); // Split by single line breaks
  
    return paragraphs.map((paragraph, index) => {
      if (/^\d+\.\s/.test(paragraph)) {
        // Handle numerical lists
        return (
          <div key={index} style={{ marginTop: '10px', marginBottom: '10px' }}>
            {paragraph}
          </div>
        );
      } else {
        const parts = paragraph.split(urlRegex);
        return (
          <div key={index}>
            {parts.map((part, partIndex) =>
              urlRegex.test(part) ? (
                <a
                  key={partIndex}
                  href={part.trim().replace(/\.$/, '')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {part.trim().replace(/\.$/, '')}
                </a>
              ) : (
                <React.Fragment key={partIndex}>{part}</React.Fragment>
              )
            )}
          </div>
        );
      }
    });
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleStartChat = () => {
    if (apiKey.trim() !== '') {
      setShowChat(true);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, type: 'question' },
      ]);

      setInputText('');
      inputRef.current.focus();

      try {
        setLoading(true);
        setLoadingMessage('');

        const response = await askQuestion(inputText, apiKey);
        const formattedResponse = convertAndFormatText(response);

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: formattedResponse, type: 'response' },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setLoadingMessage('');
      }
    }
  };

  return (
    <div className="App">
      <h1 className="logo"></h1>
      {!showChat ? (
        <div className="landing-page">
  <div className="disclaimer">
    <h1>Welcome to the AI Support Bot</h1>
    <p>
      Discover fast and context-rich answers with our AI-powered Support Bot! Version 1.0 is here for alpha testing, leveraging product documentation as a reference.
    </p>
    <div className="highlights">
      <div className="highlight">
        <span className="good-list">🚀 What the Bot Excels At:</span>
        <ul>
          <li>Instant Access to Summarized Documentation</li>
          <li>Thorough Explanations of Tools & Features</li>
        </ul>
      </div>
      <div className="highlight">
        <span className="not-good-list">⚠️ Where We're Improving:</span>
        <ul>
          <li>Individual Message Processing</li>
          <li>Occasional Character Limit Constraints</li>
        </ul>
      </div>
    </div>
    <p>
      Encounter unexpected responses? Share your feedback with Jack Compton on Slack. Help us enhance the bot by sharing your questions and responses!
      Together, we'll make this app even cooler!
    </p>
    <p>
      Happy chatting! 😄
    </p>
  </div>
  <div className="api-key-container">
    <input
      type="password"
      className="api-key-input"
      placeholder="Enter your OpenAI API key"
      value={apiKey}
      onChange={handleApiKeyChange}
    />
    <button className="start-chat-button" onClick={handleStartChat}>
      Start Chat
    </button>
  </div>
</div>
      ) : (
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.type === 'question' ? 'question' : 'response'
              }`}
            >
              {message.text}
            </div>
          ))}
          <div className="textbox-container">
            <input
              type="text"
              className="textbox"
              placeholder="Send a message"
              value={inputText}
              onChange={handleInputChange}
              ref={inputRef}
            />
            <button className="send-button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
          {loading && (
            <div className="loading-message">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
