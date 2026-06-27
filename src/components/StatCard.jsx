export default function StatCard({ title, value, unit, sub, accent = '#6366f1', icon }) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`,
      }}>
      {/* Accent blob */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15 pointer-events-none"
        style={{ background: accent, filter: 'blur(16px)' }}/>
      {/* Top accent bar */}
      <div className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}/>

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}15` }}>
            <span style={{ color: accent }}>{icon}</span>
          </div>
        )}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-800">
          {value === null || value === undefined ? '--' : value}
        </span>
        {unit && <span className="text-base font-medium text-slate-400 pb-0.5">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
    </div>
  );
}