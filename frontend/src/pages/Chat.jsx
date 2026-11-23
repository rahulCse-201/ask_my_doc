import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export function Chat({ onLogout, logoutError }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setAsking(true);

    try {
      const res = await api.post("/query", { question: userMessage.text });
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: res.data.answer, 
        citations: res.data.citations 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: err.response?.data?.error || "Could not reach the answer service. Please try again." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Chat with your Docs</h1>
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Documents
        </Link>
        <button type="button" onClick={onLogout} className="border px-4 py-2 rounded">Log out</button>
      </div>
      {logoutError && <p role="alert" className="text-red-600 mb-4">{logoutError}</p>}

      <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col border">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">Ask a question about your uploaded documents.</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300 text-xs text-gray-600 flex flex-wrap gap-2">
                    {msg.citations.map((c, idx) => (
                      <span key={idx} className="bg-white px-2 py-1 rounded shadow-sm border">
                        📄 {c.filename} (Page {c.page})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {asking && <p className="text-gray-400 text-sm animate-pulse">AI is thinking...</p>}
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input 
            type="text" value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={asking}
          />
          <button 
            type="submit" disabled={asking}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
