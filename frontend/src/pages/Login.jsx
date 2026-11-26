import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function BrandMark({ compact = false }) {
  return (
    <span className={`inline-grid place-items-center rounded-xl border text-[#e4e7c8] ${compact ? "size-[31px] border-[#d7e1d8] text-[#426e59]" : "size-9 border-white/30"}`} aria-hidden="true">
      <svg className={compact ? "size-[21px]" : "size-6"} viewBox="0 0 32 32" fill="none">
        <path d="M7 5.5h11l7 7v14H7v-21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 5.5v7h7M11 17h10M11 21h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m22.5 17.5 1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3-1.2-2.3-2.3-1.2 2.3-1.2 1.2-2.3Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function FieldIcon({ type }) {
  const shared = "size-[18px] shrink-0 text-[#8c9b91]";
  return type === "email" ? (
    <svg className={shared} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" strokeWidth="1.7" /><path d="m5 7 7 5.5L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : (
    <svg className={shared} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10" width="15" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  );
}

const textButtonClass = "cursor-pointer border-0 bg-transparent p-0 font-[inherit] font-bold text-[#1f614e] hover:text-[#123c30] hover:underline hover:underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9ebba7]";

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
    <main className="grid min-h-screen min-h-svh grid-cols-1 bg-[#fbfcfa] font-sans text-[#1b2925] md:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden min-h-screen min-h-svh flex-col overflow-hidden bg-[#173c32] px-9 py-[42px] text-[#f5f6ee] md:flex xl:px-[clamp(40px,5.5vw,88px)]" aria-label="Ask My Docs introduction">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_87%,rgba(161,184,99,0.19),transparent_34%),radial-gradient(ellipse_at_80%_8%,rgba(128,168,134,0.13),transparent_35%)]" />
        <div className="pointer-events-none absolute -top-[8%] -right-[380px] size-[700px] rounded-full border border-white/[0.09]" />
        <div className="pointer-events-none absolute top-[15%] -right-[300px] size-[540px] rounded-full border border-white/[0.09]" />
        <a className="relative z-10 inline-flex w-fit items-center gap-[11px] text-[17px] font-semibold tracking-[-0.55px] text-inherit no-underline" href="/" aria-label="Ask My Docs home">
          <BrandMark /><span>ask my docs</span>
        </a>

        <div className="relative z-10 mt-[clamp(72px,12vh,130px)] max-w-[470px]">
          <div className="flex items-center gap-2.5 text-[10px] font-bold tracking-[1.7px] text-[#b8c6a9]"><span className="size-1.5 rounded-full bg-[#d9b777] shadow-[0_0_12px_#d9b777]" /> YOUR KNOWLEDGE, IN CONVERSATION</div>
          <h1 className="mt-[23px] mb-[17px] max-w-[460px] font-serif text-[clamp(44px,5vw,68px)] leading-[1.03] tracking-[-2.6px] text-[#f6f5ec]">Every document has <em className="text-[#d8dfb4]">an answer.</em></h1>
          <p className="max-w-[370px] text-sm leading-[1.8] text-[#bdc9c0]">Bring your PDFs together and find what matters with a simple question.</p>
        </div>

        <div className="relative z-10 my-[clamp(44px,7vh,78px)] ml-[3%] w-[min(100%,440px)] rotate-[-1.4deg] rounded-[17px] border border-white/20 bg-[#f0f4e5]/[0.09] p-5 shadow-[0_26px_70px_rgba(7,25,20,0.2)] backdrop-blur-xl">
          <div className="mb-[15px] flex items-center gap-2 text-[9px] font-bold tracking-[1.4px] text-[#bdcabc]"><span className="size-1.5 rounded-full bg-[#d9b777]" /><span>YOUR LIBRARY</span><span className="ml-auto text-[#92a399]">03</span></div>
          <div className="flex items-center gap-[11px] border-t border-white/10 py-2.5">
            <span className="grid h-[39px] w-[34px] place-items-center rounded-[7px] bg-[#bf755e] text-[8px] font-extrabold tracking-[0.4px] text-white">PDF</span>
            <span className="grid gap-1"><strong className="text-[11px] font-semibold text-[#eef0e5]">Product strategy.pdf</strong><small className="text-[9px] text-[#a9b8ad]">24 pages · Added just now</small></span>
            <span className="ml-auto grid size-[18px] place-items-center rounded-full bg-[#a5c39b]/[0.18] text-[10px] text-[#bcd4ad]">✓</span>
          </div>
          <div className="flex items-center gap-[11px] border-t border-white/10 py-2.5">
            <span className="grid h-[39px] w-[34px] place-items-center rounded-[7px] bg-[#a89457] text-[8px] font-extrabold tracking-[0.4px] text-white">PDF</span>
            <span className="grid gap-1"><strong className="text-[11px] font-semibold text-[#eef0e5]">Research notes.pdf</strong><small className="text-[9px] text-[#a9b8ad]">12 pages · Ready to explore</small></span>
            <span className="ml-auto grid size-[18px] place-items-center rounded-full bg-[#a5c39b]/[0.18] text-[10px] text-[#bcd4ad]">✓</span>
          </div>
          <div className="my-[13px] flex items-center gap-2.5 rounded-[9px] bg-[#f1f0e6] px-3 py-[11px] text-[10px] font-semibold text-[#37443c]"><span className="text-base text-[#56816c]">✳</span><span>What are the main opportunities?</span><span className="ml-auto text-sm text-[#77847b]">↗</span></div>
          <div className="flex items-start gap-[9px] pt-1 text-[#dbe2d5]"><span className="grid size-5 shrink-0 place-items-center rounded-md bg-[#c7d7b0]/[0.18] text-xs text-[#d6dfb6]">✳</span><span className="grid gap-1"><strong className="text-[10px] font-semibold">Here’s what I found</strong><small className="max-w-[290px] text-[9px] leading-[1.5] text-[#aebdb1]">Three opportunities stand out across your documents...</small></span></div>
        </div>
        <div className="relative z-10 mt-auto flex justify-between text-[9px] font-semibold tracking-[1.3px] text-[#94a69a]"><span>READ LESS. UNDERSTAND MORE.</span><span>01 / 03</span></div>
      </section>

      <section className="flex min-h-screen min-h-svh flex-col px-[25px] py-5 sm:px-[38px] md:px-[clamp(30px,5vw,76px)] md:py-[34px]" aria-label="Account sign in or sign up">
        <div className="flex items-center justify-end gap-[9px] text-[11px] text-[#858f89] md:text-xs">
          <span>{isLogin ? "New to Ask My Docs?" : "Already have an account?"}</span>
          <button type="button" className={`${textButtonClass} text-[11px] md:text-xs`} onClick={switchMode}>{isLogin ? "Create account" : "Sign in"}</button>
        </div>
        <div className="my-auto mx-auto w-full max-w-[390px] py-[30px] md:py-10">
          <div className="mb-[35px] inline-flex items-center gap-[9px] text-[15px] font-bold tracking-[-0.4px] text-[#244d3e] sm:mb-12 md:hidden"><BrandMark compact /><span>ask my docs</span></div>
          <div className="mb-[26px] md:mb-[30px]">
            <div className="mb-5 grid size-[42px] place-items-center rounded-[13px] border border-[#dce6dc] bg-[#f1f6ef] text-[23px] text-[#49725e] md:mb-[25px]">✳</div>
            <p className="mb-[9px] text-[9px] font-bold tracking-[1.8px] text-[#75867c]">{isLogin ? "WELCOME BACK" : "YOUR NEXT CHAPTER"}</p>
            <h2 className="font-serif text-[32px] leading-[1.18] tracking-[-1.25px] text-[#202e28] sm:text-[39px]">{isLogin ? "Good to see you." : "Make room for clarity."}</h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#828e87]">{isLogin ? "Sign in to pick up where you left off." : "Create an account and start asking your documents."}</p>
          </div>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mb-2 text-[11px] font-bold text-[#39473f]" htmlFor="auth-email">Email address</label>
            <div className="flex h-[49px] items-center gap-[11px] rounded-lg border border-[#dfe5df] bg-white px-[13px] text-[#8c9b91] transition focus-within:border-[#709783] focus-within:ring-[3px] focus-within:ring-[#477d5e]/10">
              <FieldIcon type="email" />
              <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-xs text-[#25342c] outline-none placeholder:text-[#a6afa9]" id="auth-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </div>

            <label className="mt-[19px] mb-2 text-[11px] font-bold text-[#39473f]" htmlFor="auth-password">Password</label>
            <div className="flex h-[49px] items-center gap-[11px] rounded-lg border border-[#dfe5df] bg-white px-[13px] text-[#8c9b91] transition focus-within:border-[#709783] focus-within:ring-[3px] focus-within:ring-[#477d5e]/10">
              <FieldIcon type="password" />
              <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-xs text-[#25342c] outline-none placeholder:text-[#a6afa9]" id="auth-password" type={showPassword ? "text" : "password"} placeholder={isLogin ? "Enter your password" : "At least 8 characters"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} minLength={isLogin ? undefined : 8} maxLength={72} required />
              <button type="button" className="cursor-pointer border-0 bg-transparent py-1 pl-2.5 text-[10px] font-semibold text-[#718178] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ebba7]" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            {!isLogin && <p className="mt-[7px] text-[10px] text-[#8a968f]">Use 8–72 characters for your password.</p>}

            {error && <p className="mt-[13px] rounded-[7px] border border-[#f2d8d3] bg-[#fff7f5] px-3 py-2.5 text-[11px] leading-relaxed text-[#a3473d]" role="alert">{error}</p>}
            <button className="relative mt-[25px] flex min-h-[49px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[#245c49] text-xs font-bold text-white transition hover:-translate-y-px hover:bg-[#194b3a] hover:shadow-[0_8px_18px_rgba(36,92,73,0.15)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9ebba7] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none" type="submit" disabled={submitting}>
              <span>{submitting ? "Just a moment…" : isLogin ? "Sign in" : "Create account"}</span>
              {!submitting && <span className="absolute right-[17px] text-[17px] font-normal" aria-hidden="true">↗</span>}
            </button>
          </form>

          <p className="mt-[35px] flex items-center justify-center gap-1.5 text-[10px] text-[#97a19b]"><span className="text-[15px] text-[#779382]">♢</span> Your documents stay yours. Always private.</p>
        </div>
        <footer className="flex justify-between text-[7px] font-semibold tracking-[.65px] text-[#a7b0aa] sm:text-[8px] sm:tracking-[1px]"><span>© 2026 ASK MY DOCS</span><span>MADE FOR THE CURIOUS <b className="pl-1 text-[11px] text-[#78937c]">✳</b></span></footer>
      </section>
    </main>
  );
}
