<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>futurexa.ai — End-to-End UX Product Plan</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0b0f;
    --surface: #111318;
    --surface2: #181c25;
    --border: #1e2330;
    --border-bright: #2a3147;
    --accent: #4f6ef7;
    --accent2: #a855f7;
    --accent3: #10b981;
    --accent4: #f59e0b;
    --danger: #ef4444;
    --text: #e8eaf0;
    --text-muted: #6b7280;
    --text-dim: #9ca3af;
    --client: #4f6ef7;
    --admin: #a855f7;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    line-height: 1.6;
  }

  /* ─── HERO ─── */
  .hero {
    padding: 80px 60px 60px;
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -120px; left: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(79,110,247,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute;
    bottom: -100px; right: 0;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .hero h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 52px;
    line-height: 1.1;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #e8eaf0 30%, #8b9abf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero p {
    color: var(--text-dim);
    font-size: 17px;
    max-width: 600px;
  }
  .hero-meta {
    display: flex;
    gap: 24px;
    margin-top: 32px;
  }
  .hero-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Mono', monospace;
  }
  .badge-client { background: rgba(79,110,247,0.15); color: #7b99ff; border: 1px solid rgba(79,110,247,0.3); }
  .badge-admin { background: rgba(168,85,247,0.15); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
  .badge-flow { background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }

  /* ─── NAV ─── */
  .toc {
    padding: 32px 60px;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .toc a {
    text-decoration: none;
    color: var(--text-muted);
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    padding: 5px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    transition: all 0.2s;
  }
  .toc a:hover { color: var(--text); border-color: var(--border-bright); }

  /* ─── SECTIONS ─── */
  .section {
    padding: 64px 60px;
    border-bottom: 1px solid var(--border);
  }

  .section-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 40px;
  }
  .section-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    padding-top: 6px;
    min-width: 36px;
  }
  .section-title-block h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 32px;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  .section-title-block p {
    color: var(--text-muted);
    font-size: 14px;
  }

  /* ─── LIFECYCLE FLOW ─── */
  .lifecycle {
    display: flex;
    align-items: center;
    gap: 0;
    flex-wrap: wrap;
    margin: 32px 0;
  }
  .lc-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 110px;
  }
  .lc-dot {
    width: 44px; height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    position: relative;
  }
  .lc-label {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: var(--text-dim);
    text-align: center;
    line-height: 1.3;
  }
  .lc-arrow {
    font-size: 18px;
    color: var(--border-bright);
    margin: 0 4px;
    padding-bottom: 20px;
  }
  .dot-1 { background: rgba(79,110,247,0.2); color: #7b99ff; border: 2px solid rgba(79,110,247,0.5); }
  .dot-2 { background: rgba(245,158,11,0.15); color: #fbbf24; border: 2px solid rgba(245,158,11,0.4); }
  .dot-3 { background: rgba(168,85,247,0.2); color: #c084fc; border: 2px solid rgba(168,85,247,0.5); }
  .dot-4 { background: rgba(16,185,129,0.15); color: #34d399; border: 2px solid rgba(16,185,129,0.4); }
  .dot-5 { background: rgba(239,68,68,0.15); color: #f87171; border: 2px solid rgba(239,68,68,0.4); }

  /* ─── DUAL COLUMN ─── */
  .dual-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;
  }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
  }
  .panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  .panel-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
  .pi-client { background: rgba(79,110,247,0.2); }
  .pi-admin { background: rgba(168,85,247,0.2); }
  .panel-title {
    font-weight: 600;
    font-size: 14px;
  }
  .panel-sub {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: var(--text-muted);
  }

  /* ─── PAGE CARDS ─── */
  .page-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  .page-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    transition: border-color 0.2s;
  }
  .page-card:hover { border-color: var(--border-bright); }
  .page-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .page-name {
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .page-tag {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
  }
  .tag-locked { background: rgba(239,68,68,0.15); color: #f87171; }
  .tag-active { background: rgba(16,185,129,0.15); color: #34d399; }
  .tag-admin { background: rgba(168,85,247,0.15); color: #c084fc; }
  .tag-both { background: rgba(245,158,11,0.15); color: #fbbf24; }

  .page-desc {
    color: var(--text-dim);
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 14px;
  }
  .page-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .page-features li {
    font-size: 12px;
    color: var(--text-muted);
    padding-left: 16px;
    position: relative;
  }
  .page-features li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--accent);
  }

  /* ─── STATE MACHINE ─── */
  .state-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  .state-card {
    border-radius: 12px;
    padding: 20px;
    border: 1px solid;
  }
  .state-new { background: rgba(79,110,247,0.06); border-color: rgba(79,110,247,0.25); }
  .state-pending { background: rgba(245,158,11,0.06); border-color: rgba(245,158,11,0.25); }
  .state-active { background: rgba(16,185,129,0.06); border-color: rgba(16,185,129,0.25); }
  .state-suspended { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.25); }
  .state-deleted { background: rgba(107,114,128,0.08); border-color: rgba(107,114,128,0.25); }

  .state-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }
  .state-new .state-label { color: #7b99ff; }
  .state-pending .state-label { color: #fbbf24; }
  .state-active .state-label { color: #34d399; }
  .state-suspended .state-label { color: #f87171; }
  .state-deleted .state-label { color: #6b7280; }

  .state-title { font-weight: 600; font-size: 15px; margin-bottom: 10px; }
  .state-body { font-size: 12px; color: var(--text-muted); line-height: 1.6; }

  /* ─── FLOW DIAGRAM ─── */
  .flow-box {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px;
    margin-top: 24px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    overflow-x: auto;
  }
  .flow-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 10px 0;
    flex-wrap: wrap;
  }
  .flow-node {
    padding: 8px 16px;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 12px;
  }
  .fn-blue { background: rgba(79,110,247,0.2); color: #7b99ff; border: 1px solid rgba(79,110,247,0.35); }
  .fn-purple { background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid rgba(168,85,247,0.35); }
  .fn-green { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); }
  .fn-yellow { background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
  .fn-red { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
  .fn-gray { background: rgba(107,114,128,0.15); color: #9ca3af; border: 1px solid rgba(107,114,128,0.25); }
  .flow-arrow { color: var(--text-muted); font-size: 16px; }
  .flow-comment { color: var(--text-muted); font-size: 11px; font-style: italic; margin-left: 8px; }

  /* ─── TABLE ─── */
  .table-wrap { margin-top: 24px; overflow-x: auto; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  thead th {
    background: var(--surface2);
    padding: 12px 16px;
    text-align: left;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1px solid var(--border);
  }
  tbody td {
    padding: 11px 16px;
    border: 1px solid var(--border);
    color: var(--text-dim);
    vertical-align: top;
  }
  tbody tr:hover td { background: rgba(255,255,255,0.02); }
  .td-action { color: var(--text); font-weight: 500; }
  .td-trigger { color: #7b99ff; font-family: 'DM Mono', monospace; font-size: 11px; }
  .td-effect { color: #34d399; }

  /* ─── ALERT BOXES ─── */
  .alert {
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 13px;
    margin: 16px 0;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .alert-info { background: rgba(79,110,247,0.1); border-left: 3px solid var(--accent); color: #a5b4fc; }
  .alert-warn { background: rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; color: #fcd34d; }
  .alert-danger { background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444; color: #fca5a5; }
  .alert-success { background: rgba(16,185,129,0.1); border-left: 3px solid #10b981; color: #6ee7b7; }

  /* ─── FORM LAYOUT ─── */
  .form-mock {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    max-width: 520px;
    margin-top: 16px;
  }
  .form-title { font-weight: 600; margin-bottom: 20px; }
  .form-field { margin-bottom: 14px; }
  .form-label { font-size: 11px; color: var(--text-muted); font-family: 'DM Mono', monospace; margin-bottom: 6px; }
  .form-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--text-dim);
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
  }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-btn {
    width: 100%;
    padding: 10px;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    margin-top: 8px;
  }

  /* ─── NOTIFICATION ─── */
  .notif-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
  .notif {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .notif-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .notif-text { font-size: 13px; color: var(--text-dim); }
  .notif-text strong { color: var(--text); }
  .notif-time { font-size: 11px; color: var(--text-muted); font-family: 'DM Mono', monospace; margin-top: 2px; }
  .notif-meta { margin-left: auto; text-align: right; }

  /* ─── PERMISSIONS TABLE ─── */
  .perm-table { margin-top: 20px; }
  .perm-row {
    display: grid;
    grid-template-columns: 200px repeat(5, 1fr);
    gap: 1px;
    background: var(--border);
    border-bottom: 1px solid var(--border);
  }
  .perm-cell {
    background: var(--surface);
    padding: 10px 14px;
    font-size: 12px;
  }
  .perm-row-header .perm-cell {
    background: var(--surface2);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
  }
  .check-yes { color: #34d399; }
  .check-no { color: #4b5563; }
  .check-partial { color: #fbbf24; }

  /* ─── MISC ─── */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 32px 0;
  }
  .mono { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-muted); }
  .tag-inline {
    display: inline-block;
    padding: 1px 7px;
    border-radius: 4px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
  }
  .tag-c { background: rgba(79,110,247,0.2); color: #7b99ff; }
  .tag-a { background: rgba(168,85,247,0.2); color: #c084fc; }

  .highlight-box {
    background: linear-gradient(135deg, rgba(79,110,247,0.08), rgba(168,85,247,0.05));
    border: 1px solid rgba(79,110,247,0.2);
    border-radius: 12px;
    padding: 20px 24px;
    margin: 16px 0;
  }
  .highlight-box h4 { font-size: 14px; margin-bottom: 8px; color: #a5b4fc; }
  .highlight-box p { font-size: 13px; color: var(--text-dim); line-height: 1.6; }

  .step-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
  .step-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .step-num {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: var(--surface2);
    border: 1px solid var(--border-bright);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 1px;
  }
  .step-content { font-size: 13px; color: var(--text-dim); }
  .step-content strong { color: var(--text); display: block; font-size: 14px; margin-bottom: 2px; }

  /* ─── FOOTER ─── */
  footer {
    padding: 40px 60px;
    text-align: center;
    color: var(--text-muted);
    font-size: 12px;
    font-family: 'DM Mono', monospace;
  }

  @media (max-width: 900px) {
    .hero, .toc, .section { padding-left: 24px; padding-right: 24px; }
    .dual-col { grid-template-columns: 1fr; }
    .hero h1 { font-size: 36px; }
    .perm-row { grid-template-columns: 140px repeat(4, 1fr); }
  }
</style>
</head>
<body>

<!-- ─────────── HERO ─────────── -->
<div class="hero">
  <div class="hero-label">futurexa.ai · Product Design Document</div>
  <h1>End-to-End<br>UX Product Plan</h1>
  <p>Complete lifecycle design for the Client Dashboard and Admin CRM — every page, every state, every action.</p>
  <div class="hero-meta">
    <span class="hero-badge badge-client">⬡ Client Dashboard · :5174</span>
    <span class="hero-badge badge-admin">⬡ Admin CRM · :5173</span>
    <span class="hero-badge badge-flow">↻ Lifecycle Flows Included</span>
  </div>
</div>

<!-- ─────────── TOC ─────────── -->
<nav class="toc">
  <a href="#s1">01 · System Overview</a>
  <a href="#s2">02 · User Lifecycle</a>
  <a href="#s3">03 · Demo Request Flow</a>
  <a href="#s4">04 · Client Dashboard Pages</a>
  <a href="#s5">05 · Admin CRM Pages</a>
  <a href="#s6">06 · Delete / Suspend Flow</a>
  <a href="#s7">07 · Notifications & Emails</a>
  <a href="#s8">08 · Permissions Matrix</a>
  <a href="#s9">09 · Edge Cases</a>
</nav>


<!-- ══════════════════════════════════════
     SECTION 1 — SYSTEM OVERVIEW
══════════════════════════════════════ -->
<section class="section" id="s1">
  <div class="section-header">
    <div class="section-num">01</div>
    <div class="section-title-block">
      <h2>System Overview</h2>
      <p>How the two apps relate to each other</p>
    </div>
  </div>

  <div class="dual-col">
    <div class="panel">
      <div class="panel-header">
        <div class="panel-icon pi-client">🖥</div>
        <div>
          <div class="panel-title">Client Dashboard</div>
          <div class="panel-sub">:5174 · futurexa.ai/dashboard</div>
        </div>
      </div>
      <p class="page-desc">The customer-facing portal. Clients sign up, wait for activation, then manage their project — milestones, tasks, tickets, files, billing, and deployments.</p>
      <ul class="page-features">
        <li>Self-serve sign-up with email verification</li>
        <li>Locked state until admin activates account</li>
        <li>Demo request triggers admin review</li>
        <li>Full workspace unlocks on activation</li>
        <li>Read + create access to their own project data</li>
      </ul>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div class="panel-icon pi-admin">⚙</div>
        <div>
          <div class="panel-title">Admin CRM</div>
          <div class="panel-sub">:5173 · admin panel</div>
        </div>
      </div>
      <p class="page-desc">Internal tool used by the futurexa team. Manages all clients, projects, leads, and operations. It is the single source of truth for client status and project state.</p>
      <ul class="page-features">
        <li>See all users and their lifecycle status</li>
        <li>Review and act on demo requests (Pending Leads)</li>
        <li>Activate, suspend, or delete accounts</li>
        <li>Manage all projects across all clients</li>
        <li>Full CRUD on milestones, tasks, tickets, files</li>
      </ul>
    </div>
  </div>

  <div class="highlight-box" style="margin-top:24px;">
    <h4>🔑 Core Principle</h4>
    <p>The Admin CRM <strong>controls</strong> client access. A client cannot unlock their workspace themselves — a human admin at futurexa must review their demo request and flip the activation switch. This keeps quality control and client relationships intentional.</p>
  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 2 — USER LIFECYCLE
══════════════════════════════════════ -->
<section class="section" id="s2">
  <div class="section-header">
    <div class="section-num">02</div>
    <div class="section-title-block">
      <h2>User Lifecycle States</h2>
      <p>Every state a user can be in, from signup to deletion</p>
    </div>
  </div>

  <div class="lifecycle">
    <div class="lc-step">
      <div class="lc-dot dot-1">①</div>
      <div class="lc-label">Signs Up</div>
    </div>
    <div class="lc-arrow">→</div>
    <div class="lc-step">
      <div class="lc-dot dot-1">②</div>
      <div class="lc-label">Email<br>Verified</div>
    </div>
    <div class="lc-arrow">→</div>
    <div class="lc-step">
      <div class="lc-dot dot-2">③</div>
      <div class="lc-label">Requests<br>Demo</div>
    </div>
    <div class="lc-arrow">→</div>
    <div class="lc-step">
      <div class="lc-dot dot-3">④</div>
      <div class="lc-label">Admin<br>Reviews</div>
    </div>
    <div class="lc-arrow">→</div>
    <div class="lc-step">
      <div class="lc-dot dot-4">⑤</div>
      <div class="lc-label">Activated</div>
    </div>
    <div class="lc-arrow">→</div>
    <div class="lc-step">
      <div class="lc-dot dot-4">⑥</div>
      <div class="lc-label">Active<br>Client</div>
    </div>
  </div>

  <div class="state-grid">
    <div class="state-card state-new">
      <div class="state-label">State 1</div>
      <div class="state-title">New / Unverified</div>
      <div class="state-body">User signed up but hasn't verified email. Login is blocked. Email verification link sent. Auto-expire after 7 days if not verified.</div>
    </div>

    <div class="state-card state-pending">
      <div class="state-label">State 2</div>
      <div class="state-title">Verified · Pending Activation</div>
      <div class="state-body">Email verified. Sees the "Workspace Restricted" screen. Can fill demo request form. All nav items locked. Admin sees them in Users list.</div>
    </div>

    <div class="state-card state-pending">
      <div class="state-label">State 3</div>
      <div class="state-title">Demo Requested</div>
      <div class="state-body">User submitted demo form. Appears in admin's "Pending Leads" queue. Client sees a "Demo Requested — we'll be in touch" message. Still locked.</div>
    </div>

    <div class="state-card state-active">
      <div class="state-label">State 4</div>
      <div class="state-title">Active</div>
      <div class="state-body">Admin activated account. Full workspace unlocked. Project is created by admin and linked. Client gets email notification. All pages accessible.</div>
    </div>

    <div class="state-card state-suspended">
      <div class="state-label">State 5</div>
      <div class="state-title">Suspended</div>
      <div class="state-body">Admin suspended the account (billing issue, policy breach, etc.). Client can login but sees a suspension notice with reason. Data is preserved.</div>
    </div>

    <div class="state-card state-deleted">
      <div class="state-label">State 6</div>
      <div class="state-title">Deleted</div>
      <div class="state-body">Soft-deleted. Account disabled, login blocked. Data retained for 30 days in archive. Permanent deletion after 30-day window. Admin can restore within this period.</div>
    </div>
  </div>

  <div class="alert alert-warn" style="margin-top:24px;">
    ⚠ <span><strong>Important:</strong> Never hard-delete immediately. Always soft-delete first (30-day grace period). This prevents accidental data loss and enables compliance with data retention policies.</span>
  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 3 — DEMO REQUEST FLOW
══════════════════════════════════════ -->
<section class="section" id="s3">
  <div class="section-header">
    <div class="section-num">03</div>
    <div class="section-title-block">
      <h2>Demo Request Flow</h2>
      <p>The critical conversion funnel from locked client to active workspace</p>
    </div>
  </div>

  <div class="dual-col">
    <div>
      <p style="color:var(--text-dim); font-size:13px; margin-bottom:12px;">The demo request form is the most important UX moment — it's the client's first real interaction with your team. Keep it short, focused, and high-signal.</p>
      <div class="form-mock">
        <div class="form-title">Request a Project Demo</div>
        <div class="form-row">
          <div class="form-field">
            <div class="form-label">FULL NAME</div>
            <div class="form-input" style="color:#6b7280">Mohamed Tabrez</div>
          </div>
          <div class="form-field">
            <div class="form-label">COMPANY</div>
            <div class="form-input" style="color:#6b7280">e.g. Acme Corp</div>
          </div>
        </div>
        <div class="form-field">
          <div class="form-label">WHAT ARE YOU BUILDING?</div>
          <div class="form-input" style="color:#6b7280; height:60px; padding-top:10px">Brief description of your project...</div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <div class="form-label">BUDGET RANGE</div>
            <div class="form-input" style="color:#6b7280">$5k–$10k ▾</div>
          </div>
          <div class="form-field">
            <div class="form-label">TIMELINE</div>
            <div class="form-input" style="color:#6b7280">3–6 months ▾</div>
          </div>
        </div>
        <div class="form-field">
          <div class="form-label">HOW DID YOU HEAR ABOUT US?</div>
          <div class="form-input" style="color:#6b7280">Select... ▾</div>
        </div>
        <button class="form-btn">Submit Request →</button>
      </div>
    </div>

    <div>
      <p style="color:var(--text-dim); font-size:13px; margin-bottom:12px;">After submission, here's the complete flow on both sides:</p>
      <div class="flow-box">
        <div class="flow-row">
          <div class="flow-node fn-blue">Client submits form</div>
          <div class="flow-arrow">→</div>
          <div class="flow-node fn-yellow">Status: Demo Requested</div>
        </div>
        <div class="flow-row" style="padding-left:20px;">
          <div class="flow-arrow">↓</div>
          <div class="flow-comment">Auto-email sent to client: "We received your request"</div>
        </div>
        <div class="flow-row">
          <div class="flow-node fn-purple">Admin sees in Pending Leads</div>
          <div class="flow-arrow">→</div>
          <div class="flow-node fn-purple">Admin reviews details</div>
        </div>
        <div style="padding-left:20px; margin: 10px 0; display:flex; gap:40px;">
          <div>
            <div style="color:#34d399; margin-bottom:6px;">✓ Approve</div>
            <div class="flow-row">
              <div class="flow-node fn-green">Create Project</div>
              <div class="flow-arrow">→</div>
              <div class="flow-node fn-green">Activate User</div>
            </div>
            <div class="flow-row" style="margin-top:6px;">
              <div class="flow-arrow">↓</div>
              <div class="flow-comment">Email: "Your workspace is ready"</div>
            </div>
          </div>
          <div>
            <div style="color:#f87171; margin-bottom:6px;">✗ Reject</div>
            <div class="flow-row">
              <div class="flow-node fn-red">Add rejection reason</div>
            </div>
            <div class="flow-row" style="margin-top:6px;">
              <div class="flow-arrow">↓</div>
              <div class="flow-comment">Email: "We can't take this on"</div>
            </div>
          </div>
        </div>
        <div class="flow-row" style="margin-top:8px;">
          <div class="flow-node fn-green">Client logs in → Full workspace</div>
        </div>
      </div>

      <div class="alert alert-info" style="margin-top:16px;">
        💡 <span>Admin should be able to add a <strong>note/memo</strong> visible only internally when approving or rejecting — e.g. "Referred by X, priority client" or "Budget too low, follow up in Q2".</span>
      </div>
    </div>
  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 4 — CLIENT DASHBOARD PAGES
══════════════════════════════════════ -->
<section class="section" id="s4">
  <div class="section-header">
    <div class="section-num">04</div>
    <div class="section-title-block">
      <h2>Client Dashboard — All Pages</h2>
      <p>What every page does, what it shows, what actions are available</p>
    </div>
  </div>

  <div class="alert alert-info">
    💡 <span>Pages marked <span class="tag-inline tag-c">LOCKED</span> show a "coming soon / pending activation" state until admin activates the account. After activation, all pages unlock simultaneously.</span>
  </div>

  <div class="page-grid" style="margin-top:24px;">

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🏠 Overview</div>
        <span class="page-tag tag-active">ALWAYS VISIBLE</span>
      </div>
      <div class="page-desc">Landing page after login. Pre-activation shows "Workspace Restricted" with demo CTA. Post-activation shows a dashboard summary with key project metrics.</div>
      <ul class="page-features">
        <li>Pre-activation: Lock icon + demo request button</li>
        <li>Post-activation: Project health summary</li>
        <li>Active milestones count, open tasks, open tickets</li>
        <li>Recent activity feed (last 5 actions)</li>
        <li>Upcoming deadline alert strip</li>
        <li>Quick-action buttons (Create ticket, View files)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🚩 Milestones</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">View the project's milestones — high-level phases set by the futurexa team. Clients can see progress but cannot create milestones (admin controls these).</div>
      <ul class="page-features">
        <li>List view with status (Not Started / In Progress / Done)</li>
        <li>Progress bar per milestone</li>
        <li>Due date with overdue highlight</li>
        <li>Linked tasks count per milestone</li>
        <li>Client can add comments on milestones</li>
        <li>No create/edit/delete (admin only)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">☑ Tasks</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">All tasks related to the client's project. Admin creates tasks; client can view, comment, and mark their own assigned tasks complete.</div>
      <ul class="page-features">
        <li>Filter by: Status, Assignee, Milestone, Priority</li>
        <li>Kanban or list toggle view</li>
        <li>Client can comment on any task</li>
        <li>Client can mark task Done if assigned to them</li>
        <li>Task detail drawer (description, attachments, history)</li>
        <li>Due date countdown badges</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🎫 Tickets</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">Support & change-request ticketing. Clients can raise issues, bugs, or feature requests. Admin responds and resolves them.</div>
      <ul class="page-features">
        <li>Client can CREATE new tickets (bug / feature / question)</li>
        <li>Ticket statuses: Open → In Review → Resolved → Closed</li>
        <li>Priority selector: Low / Medium / High / Critical</li>
        <li>File attachment support</li>
        <li>Comment thread per ticket</li>
        <li>Email notification on status change</li>
        <li>Filter by status, date, type</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📁 Files</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">Shared file storage for the project. Design deliverables, docs, assets. Both sides can upload and view.</div>
      <ul class="page-features">
        <li>Grid + list toggle view</li>
        <li>Folder structure (admin creates folders)</li>
        <li>Client can upload files to designated folders</li>
        <li>File preview (images, PDFs)</li>
        <li>Download any file</li>
        <li>Version history on files (admin uploads v2, v3…)</li>
        <li>Comment on specific files</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🚀 Deployments</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">Read-only log of all deployment events for the client's project. Admin logs each deployment; client tracks what's live.</div>
      <ul class="page-features">
        <li>Deployment log with timestamps</li>
        <li>Status: Success / Failed / In Progress</li>
        <li>Environment tags: Staging / Production</li>
        <li>Changelog notes per deployment</li>
        <li>Link to live URL (if applicable)</li>
        <li>Client cannot trigger deployments (view only)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">💳 Billing</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">Financial overview. View invoices, payment history, and current plan. Admin controls the billing data; client views it.</div>
      <ul class="page-features">
        <li>Current plan / engagement summary</li>
        <li>Invoice list (date, amount, status)</li>
        <li>Download invoice PDF</li>
        <li>Payment status: Paid / Pending / Overdue</li>
        <li>Overdue banner if payment outstanding</li>
        <li>Contact admin link for billing questions</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📈 Activity</div>
        <span class="page-tag tag-locked">POST-ACTIVATION</span>
      </div>
      <div class="page-desc">Chronological audit log of everything that happened in the workspace — by both admin and client.</div>
      <ul class="page-features">
        <li>Filterable activity feed by type</li>
        <li>Actor label: You / futurexa Team</li>
        <li>Event types: task updated, file uploaded, ticket opened, milestone reached, etc.</li>
        <li>Date range picker</li>
        <li>Export to CSV</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">⚙ Settings</div>
        <span class="page-tag tag-active">ALWAYS VISIBLE</span>
      </div>
      <div class="page-desc">Account-level settings. Always accessible even in locked state so the client can manage their own profile.</div>
      <ul class="page-features">
        <li>Edit name, email, profile photo</li>
        <li>Change password</li>
        <li>Notification preferences (email vs in-app)</li>
        <li>Timezone setting</li>
        <li>Delete account (triggers soft-delete request to admin)</li>
        <li>Two-factor authentication toggle</li>
      </ul>
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 5 — ADMIN CRM PAGES
══════════════════════════════════════ -->
<section class="section" id="s5">
  <div class="section-header">
    <div class="section-num">05</div>
    <div class="section-title-block">
      <h2>Admin CRM — All Pages</h2>
      <p>What each admin page manages and what actions it exposes</p>
    </div>
  </div>

  <div class="page-grid">

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📊 Overview Dashboard</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">The admin's home screen. A bird's-eye view of all activity across all clients and projects.</div>
      <ul class="page-features">
        <li>Total clients: Active / Pending / Suspended</li>
        <li>Open tickets count across all projects</li>
        <li>Pending leads count (unactioned demo requests)</li>
        <li>Overdue milestones across all projects</li>
        <li>Recent activity feed (all clients)</li>
        <li>Quick links: Go to Pending Leads, Active Projects</li>
        <li>Revenue summary (total invoiced / collected)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🏢 Organizations</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Manage companies / organizations. An org can have multiple users (e.g. client + their team members).</div>
      <ul class="page-features">
        <li>List of all orgs with status badge</li>
        <li>Create / edit / archive organization</li>
        <li>Link users to org</li>
        <li>Link projects to org</li>
        <li>Org-level notes (internal only)</li>
        <li>Contact details, billing address</li>
        <li>Filter by status, industry, source</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">👥 Users</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">All Supabase auth users. This is where you see everyone who has signed up, regardless of activation status.</div>
      <ul class="page-features">
        <li>Table: Name, Email, Status, Created, Last Login</li>
        <li>Filter by status (New / Pending / Active / Suspended / Deleted)</li>
        <li>Click user → User Detail drawer</li>
        <li>Manually activate / suspend / delete user</li>
        <li>Resend verification email</li>
        <li>Impersonate user (view their dashboard)</li>
        <li>Search by name or email</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📥 Pending Leads</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">The most action-critical page. Every demo request lands here. This is the admin's sales pipeline queue.</div>
      <ul class="page-features">
        <li>List of all submitted demo requests</li>
        <li>View full form submission details</li>
        <li>Approve → creates project + activates user</li>
        <li>Reject → sends rejection email with reason</li>
        <li>Defer → snooze for follow-up (set reminder date)</li>
        <li>Add internal notes per lead</li>
        <li>Priority flag (mark high-priority leads)</li>
        <li>Sort by submission date, budget, status</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📂 Projects</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">All projects across all clients. Admins create projects here and link them to users/orgs when activating a client.</div>
      <ul class="page-features">
        <li>Create / edit / archive project</li>
        <li>Assign project to a user & organization</li>
        <li>Project status: Planning / Active / On Hold / Complete</li>
        <li>Set start date, target date</li>
        <li>View all milestones, tasks, tickets under project</li>
        <li>Internal project notes</li>
        <li>Team assignment (which futurexa team members work on it)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🚩 Milestones</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Full CRUD on milestones across all projects. Admins define the roadmap; clients read it.</div>
      <ul class="page-features">
        <li>Create milestone within a project</li>
        <li>Set name, description, due date, status</li>
        <li>Reorder milestones (drag)</li>
        <li>Link tasks to milestone</li>
        <li>Mark complete → auto-notifies client</li>
        <li>Filter by project, status, due date</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">☑ Tasks</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Full task management for the admin team. Create, assign, track tasks across all projects and clients.</div>
      <ul class="page-features">
        <li>Full CRUD on tasks</li>
        <li>Assign to internal team member or client</li>
        <li>Link to milestone</li>
        <li>Priority: Low / Medium / High / Urgent</li>
        <li>Kanban board (per project) or master list</li>
        <li>Subtasks support</li>
        <li>Time tracking per task (optional)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🎫 Tickets</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Support inbox. See every ticket raised by every client. Respond, escalate, and resolve.</div>
      <ul class="page-features">
        <li>Master view: all tickets across all clients</li>
        <li>Filter by project, status, priority, type</li>
        <li>Assign ticket to internal team member</li>
        <li>Change status and add resolution note</li>
        <li>Internal notes on ticket (client doesn't see)</li>
        <li>Merge duplicate tickets</li>
        <li>SLA timer (optional — days open)</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📁 Files</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">File management across all projects. Upload deliverables, organize folders, control what clients can see.</div>
      <ul class="page-features">
        <li>Full upload + folder creation</li>
        <li>Visibility toggle: Shared with client / Internal only</li>
        <li>Bulk upload</li>
        <li>File version control (replace with new version)</li>
        <li>Filter by project, date, type</li>
        <li>Delete / archive files</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🚀 Deployments</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Log and manage all deployment events. Admin creates deployment records; they appear in the client's view.</div>
      <ul class="page-features">
        <li>Create deployment log entry</li>
        <li>Environment: Staging / Production</li>
        <li>Status: Scheduled / In Progress / Success / Failed</li>
        <li>Attach changelog notes</li>
        <li>Link to deployment URL or PR</li>
        <li>Client notification on new deployment</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🔗 Integrations</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Connect futurexa's tools to external services — Slack, GitHub, payment gateways, etc.</div>
      <ul class="page-features">
        <li>List of available integrations with connect/disconnect</li>
        <li>Slack: notify channel on ticket / milestone events</li>
        <li>GitHub / GitLab: auto-log deployments from commits</li>
        <li>Stripe: sync invoices to billing page</li>
        <li>Zapier / Make.com: general webhook bridge</li>
        <li>Status indicator: connected / error / disconnected</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🔔 Webhooks</div>
        <span class="page-tag tag-admin">ADMIN</span>
      </div>
      <div class="page-desc">Custom webhook configuration for sending event data to external URLs. Developer-facing feature.</div>
      <ul class="page-features">
        <li>Create webhook with URL + secret</li>
        <li>Select event triggers (user activated, ticket opened, etc.)</li>
        <li>Test webhook endpoint</li>
        <li>Delivery log with response codes</li>
        <li>Retry failed deliveries</li>
        <li>Enable / disable per webhook</li>
      </ul>
    </div>

  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 6 — DELETE / SUSPEND FLOW
══════════════════════════════════════ -->
<section class="section" id="s6">
  <div class="section-header">
    <div class="section-num">06</div>
    <div class="section-title-block">
      <h2>Delete & Suspend Flows</h2>
      <p>What happens when a user is suspended or deleted</p>
    </div>
  </div>

  <div class="dual-col">
    <div>
      <h3 style="font-size:16px; margin-bottom:16px; color:#fbbf24;">⏸ Suspend Flow</h3>
      <div class="step-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-content"><strong>Admin clicks "Suspend" on user</strong>Must enter a reason (mandatory). E.g. "Invoice overdue 30 days."</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-content"><strong>User status → SUSPENDED</strong>Immediately reflected in the database.</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-content"><strong>Client's next page load</strong>Sees a "Account Suspended" banner with the reason provided. All action buttons disabled. Can still see data (read-only). Can still access Settings.</div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-content"><strong>Email sent automatically</strong>"Your account has been temporarily suspended. Please contact us to resolve this."</div>
        </div>
        <div class="step-item">
          <div class="step-num">5</div>
          <div class="step-content"><strong>Admin can un-suspend</strong>One click restores to Active. Email sent to client: "Your account has been reactivated."</div>
        </div>
      </div>
    </div>

    <div>
      <h3 style="font-size:16px; margin-bottom:16px; color:#f87171;">🗑 Delete Flow</h3>
      <div class="step-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-content"><strong>Admin clicks "Delete User"</strong>Confirmation modal with typed confirmation: "Type the user's email to confirm." Prevents accidents.</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-content"><strong>Soft delete applied</strong>User status → DELETED. Login immediately blocked. Data NOT removed from DB yet. Account flagged for 30-day retention.</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-content"><strong>Cascading effects</strong>User's open tickets → auto-close with note "Account deleted." User removed from task assignees → reassign to admin. Files retained. Billing records retained.</div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-content"><strong>30-day grace period</strong>Admin can restore within 30 days from the archived users list. After 30 days: permanent deletion from DB triggered automatically (scheduled job).</div>
        </div>
        <div class="step-item">
          <div class="step-num">5</div>
          <div class="step-content"><strong>Email to deleted user</strong>"Your futurexa account has been closed. Your data will be deleted on [date]. Contact us if this was a mistake."</div>
        </div>
      </div>
    </div>
  </div>

  <div class="alert alert-danger" style="margin-top:24px;">
    🚨 <span><strong>Never delete projects when a user is deleted.</strong> Archive the project instead. You need the project history for financial records, references, and potential dispute resolution.</span>
  </div>

  <div class="table-wrap" style="margin-top:24px;">
    <table>
      <thead>
        <tr>
          <th>DATA TYPE</th>
          <th>ON SUSPEND</th>
          <th>ON SOFT DELETE</th>
          <th>ON HARD DELETE (30d)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td-action">User profile</td>
          <td>Preserved, read-only</td>
          <td>Preserved, login blocked</td>
          <td class="td-effect">Permanently removed</td>
        </tr>
        <tr>
          <td class="td-action">Project data</td>
          <td>Accessible (read-only)</td>
          <td>Archived, inaccessible to user</td>
          <td>Archived indefinitely (not deleted)</td>
        </tr>
        <tr>
          <td class="td-action">Tickets</td>
          <td>All preserved</td>
          <td>Open tickets auto-closed</td>
          <td>Archived with project</td>
        </tr>
        <tr>
          <td class="td-action">Tasks</td>
          <td>All preserved</td>
          <td>Unassigned from user</td>
          <td>Archived with project</td>
        </tr>
        <tr>
          <td class="td-action">Files</td>
          <td>Accessible (read-only)</td>
          <td>Preserved in storage</td>
          <td>Retained for 90 days then purged</td>
        </tr>
        <tr>
          <td class="td-action">Billing / Invoices</td>
          <td>Visible to admin</td>
          <td>Retained for compliance</td>
          <td>Retained 7 years (legal requirement)</td>
        </tr>
        <tr>
          <td class="td-action">Activity log</td>
          <td>Continues logging</td>
          <td>Frozen, preserved</td>
          <td>Retained with project archive</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 7 — NOTIFICATIONS & EMAILS
══════════════════════════════════════ -->
<section class="section" id="s7">
  <div class="section-header">
    <div class="section-num">07</div>
    <div class="section-title-block">
      <h2>Notifications & Email Triggers</h2>
      <p>Every automated communication that should fire and when</p>
    </div>
  </div>

  <div class="dual-col">
    <div>
      <h3 style="font-size:14px; font-family:'DM Mono',monospace; color:var(--text-muted); margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Client → Receives Emails</h3>
      <div class="notif-list">
        <div class="notif">
          <div class="notif-dot" style="background:#4f6ef7;"></div>
          <div class="notif-text">
            <strong>Welcome / Verify Email</strong>
            <div>Triggered on signup. Contains email verification link.</div>
            <div class="notif-time">Trigger: signup</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#f59e0b;"></div>
          <div class="notif-text">
            <strong>Demo Request Received</strong>
            <div>Confirmation that request was submitted successfully.</div>
            <div class="notif-time">Trigger: form submit</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#10b981;"></div>
          <div class="notif-text">
            <strong>Account Activated 🎉</strong>
            <div>Workspace is live. Link to dashboard. Intro to what they can do.</div>
            <div class="notif-time">Trigger: admin approves</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#ef4444;"></div>
          <div class="notif-text">
            <strong>Demo Request Declined</strong>
            <div>Polite rejection with reason. Option to reapply later.</div>
            <div class="notif-time">Trigger: admin rejects</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#8b5cf6;"></div>
          <div class="notif-text">
            <strong>Ticket Update</strong>
            <div>When admin responds to or changes status of a ticket.</div>
            <div class="notif-time">Trigger: ticket status change</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#10b981;"></div>
          <div class="notif-text">
            <strong>Milestone Reached</strong>
            <div>"Phase 2 is complete! Here's what comes next."</div>
            <div class="notif-time">Trigger: milestone marked complete</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#ef4444;"></div>
          <div class="notif-text">
            <strong>Account Suspended</strong>
            <div>Reason for suspension. How to contact futurexa to resolve.</div>
            <div class="notif-time">Trigger: admin suspends</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#f59e0b;"></div>
          <div class="notif-text">
            <strong>Invoice Due Reminder</strong>
            <div>3 days before due, on due date, 7 days overdue.</div>
            <div class="notif-time">Trigger: billing schedule</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 style="font-size:14px; font-family:'DM Mono',monospace; color:var(--text-muted); margin-bottom:16px; letter-spacing:0.05em; text-transform:uppercase;">Admin → In-App Notifications</h3>
      <div class="notif-list">
        <div class="notif">
          <div class="notif-dot" style="background:#f59e0b;"></div>
          <div class="notif-text">
            <strong>New Demo Request</strong>
            <div>Someone submitted a demo request. Go to Pending Leads.</div>
            <div class="notif-time">Trigger: client submits form</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#4f6ef7;"></div>
          <div class="notif-text">
            <strong>New User Signup</strong>
            <div>A new account was created and is awaiting action.</div>
            <div class="notif-time">Trigger: signup + verify</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#ef4444;"></div>
          <div class="notif-text">
            <strong>New Critical Ticket</strong>
            <div>A client raised a critical priority ticket. Needs immediate attention.</div>
            <div class="notif-time">Trigger: ticket priority=critical</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#ef4444;"></div>
          <div class="notif-text">
            <strong>Milestone Overdue</strong>
            <div>A milestone's due date has passed and it's still in progress.</div>
            <div class="notif-time">Trigger: daily job checks</div>
          </div>
        </div>
        <div class="notif">
          <div class="notif-dot" style="background:#f59e0b;"></div>
          <div class="notif-text">
            <strong>Webhook Delivery Failed</strong>
            <div>A configured webhook returned a non-2xx response.</div>
            <div class="notif-time">Trigger: webhook failure</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 8 — PERMISSIONS MATRIX
══════════════════════════════════════ -->
<section class="section" id="s8">
  <div class="section-header">
    <div class="section-num">08</div>
    <div class="section-title-block">
      <h2>Permissions Matrix</h2>
      <p>Who can do what across both systems</p>
    </div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>FEATURE / ACTION</th>
          <th>CLIENT (locked)</th>
          <th>CLIENT (active)</th>
          <th>ADMIN</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="td-action">View Overview</td>
          <td class="check-partial">✓ (restricted screen)</td>
          <td class="check-yes">✓ Full</td>
          <td class="check-yes">✓</td>
        </tr>
        <tr>
          <td class="td-action">Submit Demo Request</td>
          <td class="check-yes">✓</td>
          <td class="check-no">— (already active)</td>
          <td class="check-no">—</td>
        </tr>
        <tr>
          <td class="td-action">View Milestones</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓ Read only</td>
          <td class="check-yes">✓ Full CRUD</td>
        </tr>
        <tr>
          <td class="td-action">Create / Edit Tasks</td>
          <td class="check-no">✗</td>
          <td class="check-partial">✓ Mark own tasks done, comment</td>
          <td class="check-yes">✓ Full CRUD</td>
        </tr>
        <tr>
          <td class="td-action">Create Tickets</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓</td>
          <td class="check-yes">✓ Full CRUD</td>
        </tr>
        <tr>
          <td class="td-action">Respond to Tickets</td>
          <td class="check-no">✗</td>
          <td class="check-partial">✓ Own tickets only</td>
          <td class="check-yes">✓ All tickets</td>
        </tr>
        <tr>
          <td class="td-action">Upload Files</td>
          <td class="check-no">✗</td>
          <td class="check-partial">✓ Designated folders</td>
          <td class="check-yes">✓ All folders</td>
        </tr>
        <tr>
          <td class="td-action">View Deployments</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓ Read only</td>
          <td class="check-yes">✓ Full CRUD</td>
        </tr>
        <tr>
          <td class="td-action">View Billing</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓ Read only</td>
          <td class="check-yes">✓ Full CRUD</td>
        </tr>
        <tr>
          <td class="td-action">Activate Users</td>
          <td class="check-no">✗</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓</td>
        </tr>
        <tr>
          <td class="td-action">Suspend / Delete Users</td>
          <td class="check-no">✗</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓</td>
        </tr>
        <tr>
          <td class="td-action">Create / Manage Projects</td>
          <td class="check-no">✗</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓</td>
        </tr>
        <tr>
          <td class="td-action">View Activity Log</td>
          <td class="check-no">✗</td>
          <td class="check-partial">✓ Own project only</td>
          <td class="check-yes">✓ All projects</td>
        </tr>
        <tr>
          <td class="td-action">Manage Integrations</td>
          <td class="check-no">✗</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓</td>
        </tr>
        <tr>
          <td class="td-action">Configure Webhooks</td>
          <td class="check-no">✗</td>
          <td class="check-no">✗</td>
          <td class="check-yes">✓</td>
        </tr>
        <tr>
          <td class="td-action">Edit Own Profile</td>
          <td class="check-yes">✓</td>
          <td class="check-yes">✓</td>
          <td class="check-yes">✓</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>


<!-- ══════════════════════════════════════
     SECTION 9 — EDGE CASES
══════════════════════════════════════ -->
<section class="section" id="s9">
  <div class="section-header">
    <div class="section-num">09</div>
    <div class="section-title-block">
      <h2>Edge Cases & Design Decisions</h2>
      <p>The situations you haven't thought of yet — handled</p>
    </div>
  </div>

  <div class="page-grid">

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🔁 Re-submitting Demo Request</div>
      </div>
      <div class="page-desc">What if a user submits a demo request, gets rejected, and wants to try again?</div>
      <ul class="page-features">
        <li>Allow resubmission after 7 days from rejection</li>
        <li>Show "Request rejected" message with date on client side</li>
        <li>Button: "Submit a revised request" appears after 7 days</li>
        <li>Admin sees resubmission clearly labeled "2nd attempt"</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">👥 Multiple Users per Org</div>
      </div>
      <div class="page-desc">What if a client wants to add a team member to their workspace?</div>
      <ul class="page-features">
        <li>Client cannot invite users themselves (security)</li>
        <li>Client submits a ticket: "Add team member"</li>
        <li>Admin creates the user in the CRM and links to the org</li>
        <li>New user gets an invite email with a set-password link</li>
        <li>Both users share the same project workspace</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📧 Email Already Registered</div>
      </div>
      <div class="page-desc">Someone tries to sign up with an email that's already in the system.</div>
      <ul class="page-features">
        <li>Show generic: "If this email exists, you'll receive a link"</li>
        <li>Prevents enumeration of existing users</li>
        <li>If account is deleted (soft): send "account closed" message</li>
        <li>If suspended: normal login flow, suspension screen after</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🧑‍💻 Admin Deletes Themselves</div>
      </div>
      <div class="page-desc">What if the only admin tries to delete their own account?</div>
      <ul class="page-features">
        <li>Block deletion if user is the last admin</li>
        <li>Show error: "Cannot delete last admin account"</li>
        <li>Must first assign another admin role, then delete</li>
        <li>Super-admin role above regular admin as backstop</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">📬 Client Changes Email</div>
      </div>
      <div class="page-desc">Client updates their email in Settings — this touches auth and billing records.</div>
      <ul class="page-features">
        <li>Sends verification to new email before updating</li>
        <li>Old email gets "your email was changed" notification</li>
        <li>Billing records updated to new email</li>
        <li>Admin sees email change in Activity log</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">💀 Project Completed / Offboarding</div>
      </div>
      <div class="page-desc">Project is done. What's the client's experience going forward?</div>
      <ul class="page-features">
        <li>Admin marks project "Complete"</li>
        <li>Client dashboard shows "Project Delivered" banner</li>
        <li>Files/tickets remain read-only for 90 days</li>
        <li>Billing transitions to maintenance or closes</li>
        <li>Admin can archive workspace after 90 days</li>
        <li>Client gets "Your data is available until [date]" email</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🔒 Session / Security</div>
      </div>
      <div class="page-desc">Security considerations for both portals.</div>
      <ul class="page-features">
        <li>JWT sessions with refresh tokens (Supabase handles)</li>
        <li>Admin CRM behind IP allowlist or VPN (optional)</li>
        <li>Failed login attempts → temporary lockout after 5 tries</li>
        <li>2FA available on Settings (client) and mandatory for admins</li>
        <li>Admin impersonation leaves audit log entry</li>
      </ul>
    </div>

    <div class="page-card">
      <div class="page-card-head">
        <div class="page-name">🌐 No Project Assigned Yet</div>
      </div>
      <div class="page-desc">Admin activated user but forgot to create/link a project.</div>
      <ul class="page-features">
        <li>Client sees "Your workspace is being set up" state</li>
        <li>Show estimated time or contact support link</li>
        <li>Admin gets auto-reminder: "User activated but no project linked"</li>
        <li>Prevent activation without project assignment (recommended)</li>
      </ul>
    </div>

  </div>

  <div class="highlight-box" style="margin-top:32px;">
    <h4>🗺 Recommended Build Order</h4>
    <p>
      <strong>Phase 1:</strong> Auth (signup, verify, login) + User lifecycle states in DB + "Workspace Restricted" screen + Demo request form → Admin Pending Leads + Approve/Reject + Activation email.<br><br>
      <strong>Phase 2:</strong> Client: Milestones (read), Tasks (read+comment), Tickets (create). Admin: Full CRUD on all three.<br><br>
      <strong>Phase 3:</strong> Files, Deployments, Activity log, Billing pages.<br><br>
      <strong>Phase 4:</strong> Notifications email system, Integrations, Webhooks, Advanced permissions.
    </p>
  </div>
</section>

<footer>
  futurexa.ai · Product Design Document · Generated March 2026
</footer>

</body>
</html>