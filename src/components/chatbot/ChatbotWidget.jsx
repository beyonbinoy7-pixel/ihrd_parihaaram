import { useState } from 'react';
import { Bot, X, Minus, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { detectIntent } from '../../services/chatbot/intentDetector.js';
import { generateResponse } from '../../services/chatbot/responseGenerator.js';
import { suggestedQuestions } from '../../services/chatbot/chatbotConfig.js';

export default function ChatbotWidget() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', text: 'Hello, I’m the PARIHAARAM AI Assistant. How can I help you today?', time: new Date() }]);
  const send = (value = input) => {
    const text = value.trim(); if (!text || typing) return;
    setMessages(items => [...items, { id: Date.now(), role: 'user', text, time: new Date() }]); setInput(''); setTyping(true);
    window.setTimeout(() => { const detected = detectIntent(text); setMessages(items => [...items, { id: Date.now() + 1, role: 'assistant', text: generateResponse(detected, currentUser?.role), time: new Date() }]); setTyping(false); }, 450);
  };
  return <div className="pari-chatbot">
    {open && <section className={`pari-chat-window ${minimized ? 'is-minimized' : ''}`} aria-label="PARIHAARAM AI Assistant">
      <header className="pari-chat-header"><span className="pari-chat-avatar"><Bot size={20}/></span><span><strong>PARIHAARAM AI ASSISTANT</strong><small>Keyword-based help · {currentUser?.role || 'Guest'}</small></span><button aria-label="Clear conversation" onClick={() => setMessages([{ id: Date.now(), role: 'assistant', text: 'Conversation cleared. How can I help?', time: new Date() }])}><Trash2 size={17}/></button><button aria-label="Minimize chat" onClick={() => setMinimized(!minimized)}><Minus size={18}/></button><button aria-label="Close chat" onClick={() => setOpen(false)}><X size={18}/></button></header>
      {!minimized && <><div className="pari-chat-messages" aria-live="polite">{messages.map(message => <div className={`pari-chat-message ${message.role}`} key={message.id}><span className="pari-chat-bubble">{message.text}<small>{message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></span></div>)}{typing && <div className="pari-chat-typing">Assistant is typing…</div>}</div>
        {messages.length < 3 && <div className="pari-chat-suggestions">{suggestedQuestions.map(question => <button key={question} onClick={() => send(question)}>{question}</button>)}</div>}
        <form className="pari-chat-form" onSubmit={event => { event.preventDefault(); send(); }}><input aria-label="Your message" value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about grievances…"/><button aria-label="Send message" disabled={!input.trim() || typing}><Send size={18}/></button></form>
      </>}
    </section>}
    <button className="pari-chat-launcher" aria-label={open ? 'Close assistant' : 'Open assistant'} onClick={() => setOpen(!open)}>{open ? <X/> : <Bot/>}</button>
  </div>;
}
