'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Boxes, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react'

const MOCK_USERS = [
  { id: 1, email: 'admin@warehouse.com', password: 'admin123', name: 'Admin User', role: 'admin' as const, created_at: new Date().toISOString() },
  { id: 2, email: 'staff@warehouse.com', password: 'staff123', name: 'Nguyễn Văn A', role: 'staff' as const, created_at: new Date().toISOString() },
]

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  dur: Math.random() * 4 + 2,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.7 + 0.2,
}))

const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 4,
  dur: Math.random() * 3 + 2,
  delay: Math.random() * 5,
}))

const FEATURES = [
  { icon: Shield, label: 'Bảo mật tuyệt đối', desc: 'Mã hóa end-to-end toàn bộ dữ liệu' },
  { icon: Zap, label: 'Cập nhật thời gian thực', desc: 'Đồng bộ tức thì mọi thay đổi' },
  { icon: BarChart3, label: 'Báo cáo thông minh', desc: 'Phân tích tồn kho chuyên sâu' },
]

const CSS = `
  .lg-root { min-height:100vh; display:flex; background:#04080f; font-family:'Inter',-apple-system,sans-serif; overflow:hidden; }

  /* ── STAR FIELD ── */
  .lg-star { position:absolute; border-radius:50%; background:white; animation:starTwinkle var(--dur) ease-in-out var(--delay) infinite alternate; }
  @keyframes starTwinkle {
    0%   { opacity:var(--op); transform:scale(1); }
    50%  { opacity:0.05; transform:scale(0.4); }
    100% { opacity:var(--op); transform:scale(1.3); }
  }

  /* ── SPARKLE ── */
  .lg-sparkle { position:absolute; pointer-events:none; animation:sparklePop var(--dur) ease-in-out var(--delay) infinite; }
  .lg-sparkle::before, .lg-sparkle::after {
    content:''; position:absolute; top:50%; left:50%;
    width:var(--sz); height:2px;
    background:linear-gradient(90deg,transparent,rgba(147,197,253,0.9),transparent);
    border-radius:2px; transform-origin:left center;
  }
  .lg-sparkle::before { transform:translate(-50%,-50%) rotate(0deg); }
  .lg-sparkle::after  { transform:translate(-50%,-50%) rotate(90deg); }
  @keyframes sparklePop {
    0%,100% { opacity:0; transform:scale(0.2) rotate(0deg); }
    30%,70% { opacity:1; transform:scale(1) rotate(45deg); }
  }

  /* ── AURORA BLOBS ── */
  .lg-aurora { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
  .lg-aurora-1 { width:700px;height:700px;top:-200px;left:-200px; background:radial-gradient(circle,rgba(59,130,246,0.18),transparent 70%); animation:auroraFloat1 12s ease-in-out infinite alternate; }
  .lg-aurora-2 { width:600px;height:600px;bottom:-150px;right:-150px; background:radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%); animation:auroraFloat2 15s ease-in-out infinite alternate; }
  .lg-aurora-3 { width:400px;height:400px;top:40%;left:30%; background:radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%); animation:auroraFloat3 9s ease-in-out infinite alternate; }
  @keyframes auroraFloat1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(60px,40px) scale(1.15)} }
  @keyframes auroraFloat2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-50px,-30px) scale(1.1)} }
  @keyframes auroraFloat3 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(30px,-50px) scale(0.9)} }

  /* ── LEFT PANEL ── */
  .lg-left { flex:1; display:none; flex-direction:column; justify-content:center; padding:60px; position:relative; overflow:hidden; }
  @media(min-width:1024px){.lg-left{display:flex}}

  .lg-left-grid {
    position:absolute;inset:0;
    background-image:linear-gradient(rgba(59,130,246,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.07) 1px,transparent 1px);
    background-size:48px 48px;
    animation:gridDrift 20s linear infinite;
  }
  @keyframes gridDrift { 0%{background-position:0 0} 100%{background-position:48px 48px} }

  .lg-brand { position:relative;z-index:2;margin-bottom:52px; }
  .lg-logo-wrap {
    width:68px;height:68px;border-radius:20px;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    box-shadow:0 0 0 0 rgba(99,102,241,0.4);
    display:flex;align-items:center;justify-content:center;
    margin-bottom:28px;
    animation:logoPulse 2.5s ease-in-out infinite;
  }
  @keyframes logoPulse {
    0%,100%{box-shadow:0 8px 40px rgba(99,102,241,0.4),0 0 0 0 rgba(99,102,241,0.3)}
    50%{box-shadow:0 8px 60px rgba(99,102,241,0.7),0 0 0 14px rgba(99,102,241,0)}
  }
  .lg-title { font-size:42px;font-weight:800;line-height:1.15;color:#f1f5f9;letter-spacing:-0.025em;margin-bottom:16px; }
  .lg-title span { background:linear-gradient(135deg,#60a5fa,#a78bfa,#38bdf8); -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; background-size:200%; animation:gradShift 4s ease infinite alternate; }
  @keyframes gradShift { 0%{background-position:0%} 100%{background-position:100%} }
  .lg-desc { font-size:15px;color:#475569;line-height:1.75;max-width:380px; }

  .lg-features { position:relative;z-index:2;display:flex;flex-direction:column;gap:14px; }
  .lg-feat {
    display:flex;align-items:center;gap:16px;padding:16px 20px;
    background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
    border-radius:14px;backdrop-filter:blur(8px);
    transition:all 0.3s ease;
    opacity:0;animation:slideUp 0.5s ease forwards;
  }
  .lg-feat:hover { background:rgba(59,130,246,0.07);border-color:rgba(99,102,241,0.3);transform:translateX(8px); }
  @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .lg-feat-icon { width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.15));border:1px solid rgba(99,102,241,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0; }

  /* ── RIGHT PANEL ── */
  .lg-right { width:100%;display:flex;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden; }
  @media(min-width:1024px){.lg-right{width:500px;flex-shrink:0}}

  /* ── CARD ── */
  .lg-card {
    position:relative;z-index:2;width:100%;max-width:410px;
    border-radius:28px;padding:40px 36px;
    opacity:0;transform:translateY(28px);
    transition:opacity 0.65s ease,transform 0.65s ease;
    /* Glass */
    background:rgba(10,16,32,0.75);
    border:1px solid rgba(255,255,255,0.1);
    backdrop-filter:blur(24px);
    box-shadow:0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .lg-card.mounted{opacity:1;transform:translateY(0)}

  /* Card shimmer border */
  .lg-card::before {
    content:'';position:absolute;inset:-1px;border-radius:29px;
    background:linear-gradient(135deg,rgba(59,130,246,0.4),rgba(99,102,241,0.3),rgba(6,182,212,0.2),rgba(99,102,241,0.3),rgba(59,130,246,0.4));
    background-size:300% 300%;
    animation:borderShimmer 5s ease infinite;
    z-index:-1;
  }
  @keyframes borderShimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  /* Card inner glow */
  .lg-card::after {
    content:'';position:absolute;inset:0;border-radius:28px;
    background:radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.12),transparent 60%);
    pointer-events:none;
  }

  .lg-card-head { text-align:center;margin-bottom:28px; }
  .lg-card-logo {
    width:60px;height:60px;border-radius:18px;margin:0 auto 18px;
    background:linear-gradient(135deg,#3b82f6,#6366f1);
    display:flex;align-items:center;justify-content:center;
    animation:logoPulse 2.5s ease-in-out infinite;
    position:relative;
  }
  .lg-card-logo::after { content:'';position:absolute;inset:-6px;border-radius:24px;background:radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%);animation:ringPulse 2.5s ease-in-out infinite; }
  @keyframes ringPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }

  .lg-card-title { font-size:23px;font-weight:800;color:#f1f5f9;margin-bottom:5px; }
  .lg-card-sub { font-size:13px;color:#475569; }

  /* Demo buttons */
  .lg-demo-row { display:flex;gap:10px;margin-bottom:24px; }
  .lg-demo-btn { flex:1;padding:9px 6px;border-radius:11px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:inherit; }
  .lg-demo-admin { background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);color:#60a5fa; }
  .lg-demo-admin:hover { background:rgba(59,130,246,0.22);transform:translateY(-2px);box-shadow:0 4px 16px rgba(59,130,246,0.2); }
  .lg-demo-staff { background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#34d399; }
  .lg-demo-staff:hover { background:rgba(16,185,129,0.22);transform:translateY(-2px);box-shadow:0 4px 16px rgba(16,185,129,0.2); }

  /* Divider */
  .lg-divider { display:flex;align-items:center;gap:12px;margin-bottom:22px; }
  .lg-divider-line { flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); }
  .lg-divider-text { font-size:10.5px;color:#334155;font-weight:600;letter-spacing:0.08em; }

  /* Form */
  .lg-form-group { margin-bottom:17px; }
  .lg-label { display:block;font-size:11px;font-weight:700;color:#64748b;margin-bottom:8px;letter-spacing:0.08em;text-transform:uppercase; }
  .lg-input-wrap { position:relative; }
  .lg-input-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;transition:color 0.2s; }
  .lg-input {
    width:100%;padding:13px 14px 13px 43px;
    background:rgba(4,8,15,0.7);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:13px;font-size:14px;color:#f1f5f9;
    outline:none;font-family:inherit;
    transition:border-color 0.25s,box-shadow 0.25s,background 0.25s;
  }
  .lg-input:focus { border-color:rgba(99,102,241,0.6);box-shadow:0 0 0 3px rgba(99,102,241,0.12),0 0 20px rgba(99,102,241,0.08);background:rgba(8,13,26,0.9); }
  .lg-input::placeholder { color:#1e293b; }

  .lg-pw-toggle { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#334155;padding:5px;transition:color 0.2s; }
  .lg-pw-toggle:hover { color:#64748b; }

  /* Error */
  .lg-error { display:flex;align-items:center;gap:9px;padding:12px 14px;border-radius:11px;margin-bottom:16px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);color:#fb7185;font-size:13px;animation:shake 0.4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 60%{transform:translateX(6px)} }

  /* Submit */
  .lg-submit {
    width:100%;height:50px;border-radius:14px;border:none;cursor:pointer;font-family:inherit;
    background:linear-gradient(135deg,#3b82f6,#6366f1,#8b5cf6);
    background-size:200% 200%;
    color:white;font-size:15px;font-weight:700;
    display:flex;align-items:center;justify-content:center;gap:9px;
    transition:all 0.3s;position:relative;overflow:hidden;
    box-shadow:0 6px 30px rgba(99,102,241,0.4);
    animation:btnGradShift 4s ease infinite;
  }
  @keyframes btnGradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  .lg-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent 60%);opacity:0;transition:opacity 0.3s; }
  .lg-submit:hover:not(:disabled)::before { opacity:1; }
  .lg-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,0.55); }
  .lg-submit:active:not(:disabled) { transform:translateY(0); }
  .lg-submit:disabled { opacity:0.7;cursor:not-allowed;animation:none; }

  /* Submit shimmer sweep */
  .lg-submit::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:skewX(-20deg);animation:sweepShimmer 3s ease-in-out infinite 1s; }
  @keyframes sweepShimmer { 0%,100%{left:-100%} 40%,60%{left:150%} }

  .lg-spinner { width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,0.3);border-top-color:white;animation:spin 0.7s linear infinite;flex-shrink:0; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .lg-footer { text-align:center;margin-top:22px;font-size:11.5px;color:#1e293b;line-height:1.7; }
`

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const user = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (user) { setAuth(user, 'mock-jwt-token-' + user.role); router.push('/dashboard') }
    else setError('Email hoặc mật khẩu không đúng')
    setLoading(false)
  }

  const fillDemo = (role: 'admin' | 'staff') => {
    const u = MOCK_USERS.find(u => u.role === role)!
    setEmail(u.email); setPassword(u.password); setError('')
  }

  return (
    <div className="lg-root">
      <style>{CSS}</style>

      {/* ── LEFT ── */}
      <div className="lg-left">
        {/* Stars */}
        {STARS.map(s => (
          <div key={s.id} className="lg-star" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, '--op': s.opacity,
          } as React.CSSProperties} />
        ))}

        {/* Aurora blobs */}
        <div className="lg-aurora lg-aurora-1" />
        <div className="lg-aurora lg-aurora-2" />
        <div className="lg-aurora lg-aurora-3" />

        {/* Grid */}
        <div className="lg-left-grid" />

        {/* Brand */}
        <div className="lg-brand">
          <div className="lg-logo-wrap"><Boxes size={32} color="white" /></div>
          <h1 className="lg-title">Warehouse<span>Go</span></h1>
          <p className="lg-desc">Nền tảng quản lý kho hàng thông minh — theo dõi hàng tồn kho, nhập xuất và báo cáo phân tích trong một hệ thống duy nhất.</p>
        </div>

        {/* Features */}
        <div className="lg-features">
          {FEATURES.map((f, i) => (
            <div key={f.label} className="lg-feat" style={{ animationDelay: `${0.1 + i * 0.13}s` }}>
              <div className="lg-feat-icon"><f.icon size={18} color="#818cf8" /></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="lg-right">
        {/* Stars on right panel too */}
        {STARS.slice(0, 30).map(s => (
          <div key={s.id} className="lg-star" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size * 0.8, height: s.size * 0.8,
            '--dur': `${s.dur}s`, '--delay': `${s.delay + 1}s`, '--op': s.opacity * 0.5,
          } as React.CSSProperties} />
        ))}

        {/* Sparkles on right */}
        {SPARKLES.map(s => (
          <div key={s.id} className="lg-sparkle" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            '--sz': `${s.size}px`, '--dur': `${s.dur}s`, '--delay': `${s.delay}s`,
          } as React.CSSProperties} />
        ))}

        {/* Blob */}
        <div className="lg-aurora" style={{ width: 400, height: 400, top: -100, right: -100, background: 'radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)' }} />
        <div className="lg-aurora" style={{ width: 300, height: 300, bottom: -80, left: -80, background: 'radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%)' }} />

        {/* Card */}
        <div className={`lg-card ${mounted ? 'mounted' : ''}`}>
          <div className="lg-card-head">
            <div className="lg-card-logo"><Boxes size={28} color="white" /></div>
            <div className="lg-card-title">Chào mừng trở lại</div>
            <div className="lg-card-sub">Đăng nhập vào hệ thống WarehouseGo</div>
          </div>

          <div className="lg-demo-row">
            <button type="button" className="lg-demo-btn lg-demo-admin" onClick={() => fillDemo('admin')}>👑 Demo Admin</button>
            <button type="button" className="lg-demo-btn lg-demo-staff" onClick={() => fillDemo('staff')}>👤 Demo Staff</button>
          </div>

          <div className="lg-divider">
            <div className="lg-divider-line" />
            <span className="lg-divider-text">HOẶC ĐĂNG NHẬP THỦ CÔNG</span>
            <div className="lg-divider-line" />
          </div>

          <form onSubmit={handleLogin}>
            <div className="lg-form-group">
              <label className="lg-label">Email</label>
              <div className="lg-input-wrap">
                <Mail size={15} className="lg-input-icon" style={{ color: focused === 'email' ? '#818cf8' : '#334155' }} />
                <input id="email" type="email" value={email} placeholder="admin@warehouse.com" required className="lg-input"
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
              </div>
            </div>

            <div className="lg-form-group">
              <label className="lg-label">Mật khẩu</label>
              <div className="lg-input-wrap">
                <Lock size={15} className="lg-input-icon" style={{ color: focused === 'pw' ? '#818cf8' : '#334155' }} />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} placeholder="••••••••" required className="lg-input" style={{ paddingRight: 44 }}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pw')} onBlur={() => setFocused(null)} />
                <button type="button" className="lg-pw-toggle" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="lg-error">
                <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
              </div>
            )}

            <button type="submit" disabled={loading} className="lg-submit">
              {loading
                ? <><div className="lg-spinner" />Đang đăng nhập...</>
                : <>Đăng nhập<ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="lg-footer">Hệ thống nội bộ · Chỉ nhân viên được cấp quyền mới có thể truy cập</p>
        </div>
      </div>
    </div>
  )
}
