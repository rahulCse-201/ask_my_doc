import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./Login.css";

function BrandMark() {
  return (
    <span className="auth-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M7 5.5h11l7 7v14H7v-21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 5.5v7h7M11 17h10M11 21h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m22.5 17.5 1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3-1.2-2.3-2.3-1.2 2.3-1.2 1.2-2.3Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function FieldIcon({ type }) {
  return type === "email" ? (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" /><path d="m5 7 7 5.5L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10" width="15" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  );
}

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const switchMode = () => {
    setIsLogin((current) => !current);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await api.post(endpoint, { email, password });
      setUser(response.data);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.error || "We couldn't connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="Ask My Docs introduction">
        <div className="auth-story-glow" />
        <a className="auth-brand" href="/" aria-label="Ask My Docs home">
          <BrandMark />
          <span>ask my docs</span>
        </a>

        <div className="auth-story-copy">
          <div className="auth-eyebrow"><span /> YOUR KNOWLEDGE, IN CONVERSATION</div>
          <h1>Every document has <em>an answer.</em></h1>
          <p>Bring your PDFs together and find what matters with a simple question.</p>
        </div>

        <div className="auth-preview" aria-hidden="true">
          <div className="preview-topline"><span className="preview-dot" /><span>YOUR LIBRARY</span><span className="preview-count">03</span></div>
          <div className="preview-file"><span className="file-icon file-icon-coral">PDF</span><span className="file-copy"><strong>Product strategy.pdf</strong><small>24 pages · Added just now</small></span><span className="file-check">✓</span></div>
          <div className="preview-file"><span className="file-icon file-icon-gold">PDF</span><span className="file-copy"><strong>Research notes.pdf</strong><small>12 pages · Ready to explore</small></span><span className="file-check">✓</span></div>
          <div className="preview-question"><span className="question-spark">✳</span><span>What are the main opportunities?</span><span className="question-arrow">↗</span></div>
          <div className="preview-answer"><span className="answer-avatar">✳</span><span><strong>Here’s what I found</strong><small>Three opportunities stand out across your documents...</small></span></div>
        </div>
        <div className="auth-story-foot"><span>READ LESS. UNDERSTAND MORE.</span><span>01 / 03</span></div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top"><span>{isLogin ? "New to Ask My Docs?" : "Already have an account?"}</span><button type="button" className="auth-top-link" onClick={switchMode}>{isLogin ? "Create account" : "Sign in"}</button></div>
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><BrandMark /><span>ask my docs</span></div>
          <div className="auth-form-heading">
            <div className="auth-welcome-icon"><span>✳</span></div>
            <p className="auth-kicker">{isLogin ? "WELCOME BACK" : "YOUR NEXT CHAPTER"}</p>
            <h2>{isLogin ? "Good to see you." : "Make room for clarity."}</h2>
            <p className="auth-subtitle">{isLogin ? "Sign in to pick up where you left off." : "Create an account and start asking your documents."}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="auth-email">Email address</label>
            <div className="auth-input-wrap">
              <FieldIcon type="email" />
              <input id="auth-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </div>

            <div className="auth-password-label">
              <label className="auth-label" htmlFor="auth-password">Password</label>
            </div>
            <div className="auth-input-wrap">
              <FieldIcon type="password" />
              <input id="auth-password" type={showPassword ? "text" : "password"} placeholder={isLogin ? "Enter your password" : "At least 8 characters"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} minLength={isLogin ? undefined : 8} maxLength={72} required />
              <button type="button" className="auth-show-password" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            {!isLogin && <p className="auth-password-hint">Use 8–72 characters for your password.</p>}

            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={submitting}>
              <span>{submitting ? "Just a moment…" : isLogin ? "Sign in" : "Create account"}</span>
              {!submitting && <span className="auth-submit-arrow" aria-hidden="true">↗</span>}
            </button>
          </form>

          <p className="auth-privacy"><span>♢</span> Your documents stay yours. Always private.</p>
        </div>
        <footer className="auth-footer"><span>© 2026 ASK MY DOCS</span><span>MADE FOR THE CURIOUS <b>✳</b></span></footer>
      </section>
    </main>
  );
}
