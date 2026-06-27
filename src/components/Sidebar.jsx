import { NavLink } from 'react-router-dom';

const PROJECTS = [
  { id: 'local-pc', name: 'My PC', env: 'Local', status: 'live' },
  { id: 'mplace', name: 'Mplace', env: 'Staging', status: 'live' },
  { id: 'pwc', name: 'PWC', env: 'Staging', status: 'soon' },
  { id: 'staftr', name: 'Staftr', env: 'Staging', status: 'soon' },
];

const NAV_ICONS = {
  overview: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  project: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="2" fill="currentColor"/>
    </svg>
  ),
};

export default function Sidebar() {
  return (
    <aside className="w-56 flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99,102,241,0.1)',
        boxShadow: '4px 0 24px rgba(99,102,241,0.06)',
      }}>

      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 6v6L9 16 2 12V6L9 2z" stroke="white" strokeWidth="1.3" fill="none"/>
              <circle cx="9" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">Ops Console</div>
            <div className="text-xs text-slate-400">10Pearls</div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-3" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)' }}/>

      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        <NavLink to="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={({ isActive }) => isActive
            ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.08))', color: '#6366f1', boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.2)' }
            : { color: '#64748b' }}>
          {({ isActive }) => (<>
            <span style={{ color: isActive ? '#6366f1' : '#94a3b8' }}>{NAV_ICONS.overview}</span>
            Overview
          </>)}
        </NavLink>

        <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Projects
        </div>

        {PROJECTS.map(p => (
          <NavLink key={p.id} to={`/project/${p.id}`}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={({ isActive }) => isActive
              ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.08))', color: '#6366f1', boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.2)' }
              : { color: '#64748b' }}>
            {({ isActive }) => (<>
              <div className="flex items-center gap-2.5">
                <span style={{ color: isActive ? '#6366f1' : '#94a3b8' }}>{NAV_ICONS.project}</span>
                <div>
                  <div className="text-sm" style={{ color: isActive ? '#6366f1' : '#475569' }}>{p.name}</div>
                  <div className="text-xs text-slate-400">{p.env}</div>
                </div>
              </div>
              {p.status === 'live'
                ? <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399' }}/>
                : <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium">soon</span>
              }
            </>)}
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 mb-4 mt-2 rounded-xl px-3 py-2.5 flex items-center gap-2"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: '0 0 6px #34d399' }}/>
        <span className="text-xs text-slate-500">Prometheus</span>
        <span className="ml-auto text-xs font-semibold text-emerald-500">Live</span>
      </div>
    </aside>
  );
}