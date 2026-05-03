import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { IoSend, IoSparkles } from 'react-icons/io5';
import MarkdownRenderer from './MarkdownRenderer';
import './AssistantChat.css';

// Initialize the Gemini API client
// Note: In a real production app, API calls should be made from a backend server
// to keep the API key secure. This is a frontend-only prototype for the hackathon.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai;
if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

const AssistantChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm your Election Assistant powered by Google Gemini. How can I help you understand the election process today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!ai) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
      }

      // Prepare conversation history for context
      const chatContext = messages
        .slice(-5) // Send last 5 messages for context
        .map(m => `${m.sender === 'assistant' ? 'Assistant' : 'User'}: ${m.text}`)
        .join('\n');
      
      const prompt = `You are a helpful, neutral, and highly knowledgeable Election Assistant. 
Your goal is to explain election processes, timelines, and requirements clearly and comprehensively to citizens.

CRITICAL INSTRUCTIONS:
- DO NOT tell the user to "search online", "visit your local office", or "check other websites" to find basic information. Provide direct, concrete, and actionable answers right here in the chat based on your knowledge.
- **Interactive Eligibility Check:** If the user asks if they are eligible to vote, DO NOT just list all the criteria at once. Instead, ask them one question at a time (e.g., "To check your eligibility, let me ask a few quick questions. First, are you a citizen of India?") and wait for their response. Guide them step-by-step through the criteria to give them a personalized answer.
- If the user asks about dates or procedures, give them the exact steps and details directly.
- If you need to refer them to an official portal, provide the actual URL (e.g., https://voters.eci.gov.in/) but still explain the process they will need to follow.
- Keep your answers well-formatted using markdown (bullet points, bold text) and easy to understand.
- Do not show bias towards any political party or candidate.

Chat History:
${chatContext}

User: ${userMessage.text}
Assistant:`;

      const callGeminiWithRetry = async (retries = 3) => {
        try {
          return await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
          });
        } catch (error) {
          if (error.status === 429 && retries > 0) {
            console.warn(`Rate limit exceeded (429). Retrying in 3 seconds...`);
            await new Promise(r => setTimeout(r, 3000));
            return callGeminiWithRetry(retries - 1);
          }
          throw error;
        }
      };

      const response = await callGeminiWithRetry();

      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `**Error:** ${error.message || "Failed to connect to the assistant. Please try again later."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="chat-container glass-panel" id="assistant" aria-labelledby="assistant-heading">
      <div className="chat-header">
        <IoSparkles className="chat-icon" />
        <h2 id="assistant-heading">AI Election Assistant</h2>
      </div>

      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className={`message-bubble ${msg.sender}`}>
              {msg.sender === 'assistant' ? (
                <MarkdownRenderer content={msg.text} />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
            <span className="message-time">{msg.timestamp}</span>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper assistant">
            <div className="message-bubble assistant typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about the election..."
          aria-label="Type your message"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
          className="send-button"
        >
          <IoSend />
        </button>
      </form>
    </section>
  );
};

export default AssistantChat;
