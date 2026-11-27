import { Link, NavLink } from "react-router-dom";

function Mark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl border border-[#d9e4d7] bg-[#f0f5ed] text-[#426d58]" aria-hidden="true">
      <svg className="size-[22px]" viewBox="0 0 32 32" fill="none">
        <path d="M7 5.5h11l7 7v14H7v-21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 5.5v7h7M11 17h10M11 21h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m22.5 17.5 1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3-1.2-2.3-2.3-1.2 2.3-1.2 1.2-2.3Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function NavItem({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition ${isActive ? "bg-[#eaf1e8] text-[#245c49]" : "text-[#748078] hover:bg-[#f3f5f0] hover:text-[#34473b]"}`}
    >
      {icon}
      {children}
    </NavLink>
  );
}

export default function AppShell({ user, onLogout, logoutError, eyebrow, title, description, actions, children }) {
  const initials = user?.email?.slice(0, 1).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#1e2d26]">
      <header className="sticky top-0 z-20 border-b border-[#e7ebe4] bg-[#fbfcfa]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/dashboard" className="inline-flex shrink-0 items-center gap-2.5 text-[15px] font-bold tracking-[-.45px] text-[#244d3e] no-underline">
            <Mark />
            <span>ask my docs</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            <NavItem to="/dashboard" icon={<svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" /></svg>}>Library</NavItem>
            <NavItem to="/chat" icon={<svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 11.6a8.2 8.2 0 0 1-8.4 8.1 9 9 0 0 1-3.6-.8l-4.4 1 1-4.1a7.7 7.7 0 0 1-1.2-4.2 8.2 8.2 0 0 1 8.4-8.1 8.2 8.2 0 0 1 8.2 8.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M8 11.8h.01M12 11.8h.01M16 11.8h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>}>Ask your docs</NavItem>
          </nav>

          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-[#e6eee4] text-xs font-bold text-[#416b55]">{initials}</span>
            <span className="hidden max-w-[190px] truncate text-xs font-medium text-[#657269] md:block">{user?.email}</span>
            <button type="button" onClick={onLogout} className="rounded-lg border border-[#dce4dc] bg-white px-3 py-2 text-[11px] font-semibold text-[#526258] transition hover:border-[#afc3b2] hover:text-[#245c49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8fae96]">Log out</button>
          </div>
        </div>
        <nav className="flex gap-2 border-t border-[#edf0ea] px-5 py-2 sm:hidden" aria-label="Mobile navigation">
          <NavItem to="/dashboard" icon={<span aria-hidden="true">▦</span>}>Library</NavItem>
          <NavItem to="/chat" icon={<span aria-hidden="true">✳</span>}>Ask your docs</NavItem>
        </nav>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        {(eyebrow || title || description || actions) && (
          <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="mb-2 text-[10px] font-bold tracking-[1.8px] text-[#718477]">{eyebrow}</p>}
              {title && <h1 className="font-serif text-[32px] leading-tight tracking-[-1.1px] text-[#20362b] sm:text-[39px]">{title}</h1>}
              {description && <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#77837b]">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        )}
        {logoutError && <p role="alert" className="mb-5 rounded-xl border border-[#f0d8d2] bg-[#fff8f6] px-4 py-3 text-xs text-[#a3473d]">{logoutError}</p>}
        {children}
      </main>
      <footer className="mx-auto flex max-w-[1180px] justify-between border-t border-[#e8ece6] px-5 py-5 text-[9px] font-semibold tracking-[1px] text-[#9aa49d] sm:px-8">
        <span>ASK MY DOCS</span><span>YOUR LIBRARY, IN CONVERSATION</span>
      </footer>
    </div>
  );
}
