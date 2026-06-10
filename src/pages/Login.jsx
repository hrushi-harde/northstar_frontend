import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, animate } from 'framer-motion';
import {
  Zap, ArrowRight, Shield, BarChart3, MessageSquare,
  Eye, EyeOff, Sparkles, Lock, Mail, TrendingUp,
  Activity, Users, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login-bg.mp4';


const roles = [
  { label: 'Executive', email: 'sarah.chen@northstar.io',  desc: 'Org-wide visibility', icon: BarChart3,    color: '#a855f7', glow: 'rgba(168,85,247,0.4)'  },
  { label: 'Manager',   email: 'marcus.webb@northstar.io', desc: 'Team & projects',     icon: Shield,       color: '#ff6a00', glow: 'rgba(255,106,0,0.4)'   },
  { label: 'Employee',  email: 'james.liu@northstar.io',   desc: 'Updates & tasks',     icon: MessageSquare,color: '#22d3ee', glow: 'rgba(34,211,238,0.4)'  },
];

const features = [
  { icon: Activity,    label: 'Live Intelligence',  desc: 'Real-time signals across every team and project' },
  { icon: TrendingUp,  label: 'Fast Decisions',     desc: 'Priority surfaced in one focused command view'   },
  { icon: Users,       label: 'Team Clarity',       desc: 'Unified visibility from executive to employee'   },
  { icon: CheckCircle2,label: 'Elegant Workflow',   desc: 'Built for daily use by leadership teams'         },
];

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: (i = 0) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.65, ease, delay: i * 0.08 },
  }),
};

const cardAnim = {
  hidden:  { opacity: 0, x: 48, scale: 0.96, filter: 'blur(12px)' },
  visible: { opacity: 1, x: 0,  scale: 1,    filter: 'blur(0px)',
    transition: { duration: 0.8, ease } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const item = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.5, ease } },
};


function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2.2, ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [to]);
  return <>{val}{suffix}</>;
}


function RolePill({ role, selected, onClick }) {
  const Icon = role.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative', flex: '1 1 0', minWidth: 80,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5,
        padding: '11px 12px', borderRadius: 14, cursor: 'pointer',
        border: `1px solid ${selected ? role.color + '70' : 'rgba(255,160,60,0.18)'}`,
        background: selected
          ? `linear-gradient(145deg, ${role.color}22, ${role.color}0a)`
          : 'rgba(255,140,40,0.07)',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        boxShadow: selected ? `0 0 22px ${role.glow}` : 'none',
        transition: 'all 200ms ease',
      }}
    >
      <Icon size={13} style={{ color: role.color }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1, textShadow: '0 1px 8px rgba(0,0,0,0.80)' }}>{role.label}</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.70)', lineHeight: 1.3, textShadow: '0 1px 6px rgba(0,0,0,0.70)' }}>{role.desc}</span>
      {selected && (
        <motion.div layoutId="role-ring" style={{
          position: 'absolute', inset: -1, borderRadius: 14,
          border: `1px solid ${role.color}60`, pointerEvents: 'none',
        }} />
      )}
    </motion.button>
  );
}

/** Premium glass input */
function GlassInput({ icon: Icon, type, value, onChange, placeholder, required, label, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
        textShadow: '0 1px 6px rgba(0,0,0,0.70)',
      }}>
        {label}
      </label>
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        borderRadius: 12,
        border: `1px solid ${focused ? 'rgba(255,140,0,0.80)' : 'rgba(255,255,255,0.12)'}`,
        background: focused ? 'rgba(255,140,0,0.06)' : 'rgba(255,255,255,0.08)',
        boxShadow: focused ? '0 0 0 4px rgba(255,140,0,0.15)' : 'none',
        transition: 'all 220ms ease',
      }}>
        <Icon size={14} style={{
          position: 'absolute', left: 14,
          color: focused ? 'rgba(255,106,0,0.85)' : 'rgba(255,255,255,0.22)',
          transition: 'color 220ms ease', pointerEvents: 'none',
        }} />
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '13px 14px 13px 38px',
            background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: 13.5, fontFamily: 'inherit',
          }}
        />
        {rightSlot && <div style={{ position: 'absolute', right: 10 }}>{rightSlot}</div>}
      </div>
    </div>
  );
}


function LeftPanel() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 48px 48px 56px',
        position: 'relative',
        zIndex: 1,
      }}
    >
     
      <div style={{
        position: 'relative',
        borderRadius: 20,
        background: 'rgba(10, 12, 18, 0.72)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '36px 40px 32px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>

        {/* ── Brand mark ── */}
        <motion.div custom={0} variants={fadeUp}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, #ff6a00 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 28px rgba(255,106,0,0.40)',
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, textShadow: '0 2px 12px rgba(0,0,0,0.70)' }}>
              NorthStar
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 3, textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}>
              Executive Command Surface
            </div>
          </div>
        </motion.div>

        {/* Eyebrow badge */}
        <motion.div custom={1} variants={fadeUp}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 999, marginBottom: 20,
            background: 'rgba(255,106,0,0.10)',
            border: '1px solid rgba(255,106,0,0.25)',
          }}
        >
          <Sparkles size={11} color="#ff6a00" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#ff6a00', letterSpacing: '0.05em' }}>
            Premium operating system for leadership teams
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 custom={2} variants={fadeUp}
          style={{
            fontSize: 'clamp(32px, 3.8vw, 54px)',
            fontWeight: 800, lineHeight: 1.0,
            letterSpacing: '-0.04em', color: '#fff', margin: '0 0 16px',
            textShadow: '0 2px 20px rgba(0,0,0,0.80), 0 4px 40px rgba(0,0,0,0.50)',
          }}
        >
          Clarity for the{' '}
          <span style={{
            background: 'linear-gradient(135deg, #ff6a00 0%, #ff9a3d 45%, #a855f7 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            modern CEO
          </span>
          .
        </motion.h2>

        {/* Sub-copy */}
        <motion.p custom={3} variants={fadeUp}
          style={{
            fontSize: 14, lineHeight: 1.65,
            color: 'rgba(255,255,255,0.90)', margin: '0 0 28px',
            maxWidth: 400,
            textShadow: '0 1px 12px rgba(0,0,0,0.75)',
          }}
        >
          Command projects, teams, risks, and AI insights from a focused
          workspace designed like a premium enterprise product.
        </motion.p>

        {/* Feature list */}
        <motion.div custom={4} variants={fadeUp}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}
        >
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: 'transparent',
                border: '1px solid rgba(255,106,0,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={13} color="rgba(255,106,0,0.90)" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2, textShadow: '0 1px 10px rgba(0,0,0,0.80)' }}>
                  {label}
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', marginTop: 2, lineHeight: 1.4, textShadow: '0 1px 8px rgba(0,0,0,0.70)' }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div custom={5} variants={fadeUp}
          style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: 20,
          }}
        >
          {[
            { value: 98,  suffix: '%',  label: 'Uptime SLA'      },
            { value: 340, suffix: '+',  label: 'Enterprise teams' },
            { value: 12,  suffix: 'ms', label: 'Avg. response'   },
          ].map(({ value, suffix, label }, i) => (
            <div key={label} style={{
              flex: 1, padding: '0 16px 0 0', textAlign: 'left',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none',
              marginRight: i < 2 ? 16 : 0,
            }}>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.75))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.70))',
              }}>
                <Counter to={value} suffix={suffix} />
              </div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.65)', marginTop: 2, fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.65)' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}


function RightPanel({ email, setEmail, password, setPassword, showPassword, setShowPassword,
                      loading, error, handleLogin, selectRole }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 48px 40px 24px',
      position: 'relative', zIndex: 2,
    }}>
      {/* Soft orange accent glow behind card */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', right: '8%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,106,0,0.12), transparent 70%)',
        filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0,
      }} />
      {/* Soft purple accent glow behind card */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '15%', left: '2%',
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.10), transparent 70%)',
        filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0,
      }} />

   
      <motion.div
        variants={cardAnim}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 460,
          minWidth: 340,
          borderRadius: 20,
          background: 'rgba(10, 12, 18, 0.72)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
          zIndex: 1,
        }}
      >
        {/* Thin top accent line */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: '6%', right: '6%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.20) 35%, rgba(255,106,0,0.50) 65%, transparent)',
        }} />

        {/* Inner top glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -50, left: '50%',
          transform: 'translateX(-50%)',
          width: 300, height: 100,
          background: 'radial-gradient(ellipse, rgba(255,106,0,0.10), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Shine sweep animation */}
        <motion.div
          aria-hidden="true"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '200%', opacity: [0, 0.06, 0] }}
          transition={{ duration: 2.4, delay: 1.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '50%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            pointerEvents: 'none', zIndex: 2,
          }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ padding: '32px 36px 28px', position: 'relative', zIndex: 3 }}
        >
          {/* ── Brand row ── */}
          <motion.div variants={item}
            style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 28 }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #ff6a00, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(255,106,0,0.38)',
            }}>
              <Zap size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, textShadow: '0 2px 12px rgba(0,0,0,0.80)' }}>
                NorthStar
              </div>
              <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 3, textShadow: '0 1px 8px rgba(0,0,0,0.70)' }}>
                Executive Command Surface
              </div>
            </div>
            {/* Live indicator */}
            <div style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 9px', borderRadius: 999,
              background: 'rgba(52,211,153,0.09)',
              border: '1px solid rgba(52,211,153,0.20)',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', background: '#34d399',
                boxShadow: '0 0 6px rgba(52,211,153,0.9)',
                animation: 'ns-pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#34d399' }}>Live</span>
            </div>
          </motion.div>

          {/* ── Heading ── */}
          <motion.div variants={item} style={{ marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999, marginBottom: 11,
              background: 'rgba(255,106,0,0.09)',
              border: '1px solid rgba(255,106,0,0.22)',
            }}>
              <Sparkles size={10} color="#ff6a00" />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#ff6a00', letterSpacing: '0.08em' }}>
                Secure sign-in
              </span>
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: '#fff',
              letterSpacing: '-0.035em', lineHeight: 1.05, margin: 0,
              textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 4px 32px rgba(0,0,0,0.50)',
            }}>
              Welcome back
            </h1>
            <p style={{ marginTop: 7, fontSize: 13.5, color: 'rgba(255,255,255,0.90)', lineHeight: 1.5, textShadow: '0 1px 10px rgba(0,0,0,0.80)' }}>
              Access your executive workspace
            </p>
          </motion.div>

          {/* ── Role selector ── */}
          <motion.div variants={item} style={{ marginBottom: 22 }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)',
              marginBottom: 9, textShadow: '0 1px 6px rgba(0,0,0,0.70)',
            }}>
              Quick demo login
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              {roles.map((role) => (
                <RolePill
                  key={role.label} role={role}
                  selected={email === role.email}
                  onClick={() => selectRole(role.email)}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Divider ── */}
          <motion.div variants={item}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
          >
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.70)' }}>
              or enter manually
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </motion.div>

          {/* ── Form ── */}
          <form onSubmit={handleLogin}>
            <motion.div variants={item} style={{ marginBottom: 12 }}>
              <GlassInput
                icon={Mail} type="email" label="Email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.io" required
              />
            </motion.div>

            <motion.div variants={item} style={{ marginBottom: 18 }}>
              <GlassInput
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      background: 'none', border: 'none', padding: 4, cursor: 'pointer',
                      color: 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ marginBottom: 14, overflow: 'hidden' }}
                >
                  <div style={{
                    padding: '10px 13px', borderRadius: 11,
                    background: 'rgba(239,68,68,0.09)',
                    border: '1px solid rgba(239,68,68,0.22)',
                    color: '#fca5a5', fontSize: 12.5, lineHeight: 1.45,
                  }}>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Submit button ── */}
            <motion.div variants={item}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2, scale: 1.008 } : {}}
                whileTap={!loading ? { scale: 0.975 } : {}}
                style={{
                  position: 'relative', width: '100%', overflow: 'hidden',
                  padding: '13.5px 20px', borderRadius: 14, border: 'none',
                  background: loading
                    ? 'rgba(255,106,0,0.35)'
                    : 'linear-gradient(135deg, #ff6a00 0%, #ff8c2a 48%, #8b5cf6 100%)',
                  color: '#fff', fontSize: 13.5, fontWeight: 700,
                  letterSpacing: '0.01em', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none'
                    : '0 10px 30px rgba(255,120,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset',
                  transition: 'box-shadow 220ms ease, background 220ms ease',
                  fontFamily: 'inherit',
                }}
              >
                {/* Animated shine on button */}
                {!loading && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', top: 0, bottom: 0, width: '40%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                {loading ? (
                  <>
                    <div style={{
                      width: 15, height: 15,
                      border: '2px solid rgba(255,255,255,0.22)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      animation: 'ns-spin 0.65s linear infinite',
                    }} />
                    Signing in…
                  </>
                ) : (
                  <>Sign in <ArrowRight size={14} /></>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* ── Footer ── */}
          <motion.div variants={item}
            style={{
              marginTop: 20, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 8,
            }}
          >
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.50)', textShadow: '0 1px 6px rgba(0,0,0,0.70)' }}>Demo environment only</span>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.50)', textShadow: '0 1px 6px rgba(0,0,0,0.70)' }}>All data stays local</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}


export default function Login() {
  /* ── Auth state (untouched) ── */
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [videoReady,   setVideoReady]   = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('demo1234');
    setError('');
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          VIDEO BACKGROUND — fixed, login-route only
      ════════════════════════════════════════════════════════ */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0,
        overflow: 'hidden', background: '#04040a',
      }}>
        <motion.video
          ref={videoRef}
          src={loginBg}
          autoPlay loop muted playsInline
          onCanPlay={() => setVideoReady(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            /* Video hero — very slight blur for depth */
            filter: 'brightness(1.0) saturate(1.0) contrast(1.0) blur(3px)',
          }}
        />

        {/* Dark overlay for readability — video stays visible through it */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.35))',
        }} />
      </div>

      {/* ════════════════════════════════════════════════════════
          PAGE SHELL
      ════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', overflow: 'hidden',
      }}>
        {/* ── DESKTOP: split-screen ── */}
        <div className="login-split">
          {/* Left panel */}
          <div className="login-left-panel">
            <LeftPanel />
          </div>

          {/* Right panel — login card */}
          <div className="login-right-panel">
            <RightPanel
              email={email}           setEmail={setEmail}
              password={password}     setPassword={setPassword}
              showPassword={showPassword} setShowPassword={setShowPassword}
              loading={loading}       error={error}
              handleLogin={handleLogin} selectRole={selectRole}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SCOPED STYLES — responsive + keyframes
      ════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes ns-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ns-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        /* ── Split layout ── */
        .login-split {
          display: flex;
          min-height: 100vh;
          max-width: 100vw;
          overflow-x: hidden;
        }

        /* Left: branding glass card */
        .login-left-panel {
          flex: 0 0 55%;
          max-width: 55%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Right: login card */
        .login-right-panel {
          flex: 0 0 45%;
          max-width: 45%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 48px 40px 24px;
        }

        /* Tablet ≤ 1024px — stack, show only card */
        @media (max-width: 1024px) {
          .login-left-panel {
            display: none;
          }
          .login-right-panel {
            flex: 1 1 100%;
            max-width: 100%;
            padding: 40px 24px;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
          }
        }

        /* Mobile ≤ 600px */
        @media (max-width: 600px) {
          .login-right-panel {
            padding: 24px 16px;
          }
        }
      `}</style>
    </>
  );
}
