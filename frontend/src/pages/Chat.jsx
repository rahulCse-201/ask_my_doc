import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { api } from "../api";

const suggestions = [
  "Summarize my documents",
  "What are the key takeaways?",
  "Compare the main ideas",
];

function Sparkle() {
  return <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 2.2 6.1L20 10l-5.8 2L12 18l-2.2-6L4 10l5.8-1.9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" fill="currentColor" /></svg>;
}

export function Chat({ user, onLogout, logoutError }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, asking]);

  const handleAsk = async (event) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || asking) return;

    setMessages((previous) => [...previous, { role: "user", text }]);
    setQuestion("");
    setAsking(true);

    try {
      const { data } = await api.post("/query", { question: text });
      setMessages((previous) => [...previous, { role: "ai", text: data.answer, citations: data.citations || [] }]);
    } catch (requestError) {
      setMessages((previous) => [...previous, { role: "ai", text: requestError.response?.data?.error || "I couldn't reach the answer service. Please try again." }]);
    } finally {
      setAsking(false);
      inputRef.current?.focus();
    }
  };

  const startFresh = () => {
    setMessages([]);
    setQuestion("");
    inputRef.current?.focus();
  };

  const showSuggestion = (suggestion) => {
    setQuestion(suggestion);
    inputRef.current?.focus();
  };

  return (
    <AppShell
      user={user}
      onLogout={onLogout}
      logoutError={logoutError}
      eyebrow="DOCUMENT Q&A"
      title="A good question goes a long way."
      description="Ask about your library and get an answer grounded in the pages you’ve uploaded."
      actions={messages.length > 0 && <button type="button" onClick={startFresh} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#dce5db] bg-white px-3.5 text-[11px] font-semibold text-[#52665a] transition hover:bg-[#f1f5ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ebba7]"><span aria-hidden="true">＋</span> New chat</button>}
    >
      <section className="mx-auto flex min-h-[min(680px,calc(100svh-250px))] max-w-[890px] flex-col overflow-hidden rounded-[22px] border border-[#e4eae2] bg-white shadow-[0_10px_35px_rgba(31,52,39,.055)]" aria-label="Chat with your documents">
        <div className="flex items-center gap-3 border-b border-[#edf0eb] bg-[#fdfefc] px-5 py-4 sm:px-6">
          <span className="grid size-9 place-items-center rounded-xl bg-[#edf4eb] text-[#4c7959]"><Sparkle /></span>
          <div className="min-w-0"><p className="text-[12px] font-bold text-[#35483c]">Your document assistant</p><p className="mt-0.5 text-[10px] text-[#8c988f]">Answers are based on your indexed library</p></div>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-[#e2e9df] bg-white px-2.5 py-1 text-[9px] font-semibold text-[#728478] sm:inline-flex"><span className="size-1.5 rounded-full bg-[#80a786]" /> PRIVATE WORKSPACE</span>
        </div>

        <div className="flex min-h-[330px] flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-7 sm:py-7" aria-live="polite">
          {messages.length === 0 ? (
            <div className="m-auto flex w-full max-w-[560px] flex-col items-center py-8 text-center">
              <span className="mb-4 grid size-[54px] place-items-center rounded-[18px] bg-[#edf4eb] text-[#4d795a]"><Sparkle /></span>
              <p className="mb-1 text-[9px] font-bold tracking-[1.6px] text-[#87968a]">HELLO{user?.email ? `, ${user.email.split("@")[0].toUpperCase()}` : ""}</p>
              <h2 className="font-serif text-[25px] tracking-[-.7px] text-[#263c30]">What would you like to know?</h2>
              <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-[#89958d]">I’ll look across your ready documents and bring the useful passages into the conversation.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => showSuggestion(suggestion)} className="rounded-full border border-[#e3e9e1] bg-[#fbfcfa] px-3.5 py-2 text-[10px] font-medium text-[#5e7064] transition hover:border-[#b7cbb8] hover:bg-[#f1f6ef] hover:text-[#315b43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ebba7]">{suggestion}</button>)}
              </div>
              <Link to="/dashboard" className="mt-5 text-[10px] font-semibold text-[#47735a] underline decoration-[#c8d9c6] underline-offset-4">Manage documents in your library</Link>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[700px] flex-col gap-5">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "ai" && <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-[#edf4eb] text-[#4c7959]"><Sparkle /></span>}
                  <div className={`max-w-[88%] sm:max-w-[82%] ${message.role === "user" ? "rounded-[16px] rounded-br-[5px] bg-[#245c49] px-4 py-3 text-white" : "rounded-[16px] rounded-bl-[5px] bg-[#f5f7f3] px-4 py-3 text-[#3b4b41]"}`}>
                    <p className="whitespace-pre-wrap text-[12px] leading-[1.75]">{message.text}</p>
                    {message.citations?.length > 0 && <div className={`mt-3 flex flex-wrap gap-1.5 border-t pt-2.5 ${message.role === "user" ? "border-white/20" : "border-[#e2e9e0]"}`}>
                      {message.citations.map((citation, citationIndex) => <span key={`${citation.docId || citation.filename}-${citation.page}-${citationIndex}`} className="inline-flex items-center gap-1.5 rounded-md border border-[#e2e9e0] bg-white px-2 py-1 text-[9px] font-medium text-[#647369]"><svg className="size-3 text-[#9a6550]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.75h7.5L19 9.3v10.95H6V3.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M13 4v5.5h5.5" stroke="currentColor" strokeWidth="1.7" /></svg>{citation.filename} · p. {citation.page}</span>)}
                    </div>}
                  </div>
                </div>
              ))}
              {asking && <div className="flex items-center gap-2.5 text-[11px] text-[#8b978e]"><span className="grid size-7 place-items-center rounded-lg bg-[#edf4eb] text-[#4c7959]"><Sparkle /></span><span className="animate-pulse">Looking through your documents…</span></div>}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="border-t border-[#edf0eb] bg-[#fdfefc] p-3 sm:px-6 sm:py-4">
          <div className="mx-auto flex max-w-[700px] items-end gap-2 rounded-[15px] border border-[#dfe7de] bg-white p-2 shadow-[0_2px_8px_rgba(31,52,39,.035)] transition focus-within:border-[#9ebaa1] focus-within:ring-4 focus-within:ring-[#dce9da]/60">
            <label className="sr-only" htmlFor="chat-question">Ask a question about your documents</label>
            <textarea id="chat-question" ref={inputRef} rows={1} maxLength={2000} value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Ask a question about your documents…" disabled={asking} className="max-h-32 min-h-[40px] flex-1 resize-y border-0 bg-transparent px-2 py-2 text-[12px] leading-relaxed text-[#33443a] outline-none placeholder:text-[#a1aaa3] disabled:opacity-60" />
            <button type="submit" disabled={asking || !question.trim()} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] bg-[#245c49] px-3.5 text-[10px] font-bold text-white transition hover:bg-[#194b3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ebba7] disabled:cursor-not-allowed disabled:bg-[#b8c8bc]">{asking ? "Thinking" : "Ask"}<span aria-hidden="true">↗</span></button>
          </div>
          <p className="mx-auto mt-2 max-w-[700px] text-center text-[9px] text-[#a0aaa2]">Answers are generated from matching passages in your documents. Shift + Enter for a new line.</p>
        </form>
      </section>
    </AppShell>
  );
}
