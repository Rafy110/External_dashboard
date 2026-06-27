export default function ServiceTable({ services, title = 'Services' }) {
  const running = services.filter(s => s.state === 'running');
  const stopped = services.filter(s => s.state !== 'running');
  const all = [...stopped, ...running]; // stopped first

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</span>
        <div className="flex items-center gap-2">
          {stopped.length > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {stopped.length} stopped
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
            {running.length} running
          </span>
        </div>
      </div>

      {/* Stopped banner */}
      {stopped.length > 0 && (
        <div className="px-5 py-2 flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.04)', borderBottom: '1px solid rgba(239,68,68,0.08)' }}>
          <span className="text-xs font-medium text-red-500">⚠ {stopped.length} service{stopped.length > 1 ? 's' : ''} not running — check immediately</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-y-auto flex-1"
        style={{ maxHeight: 280, scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.2) transparent' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ position: 'sticky', top: 0, background: 'rgba(248,250,255,0.95)', backdropFilter: 'blur(8px)' }}>
              <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Service</th>
              <th className="px-5 py-2.5 text-right text-xs font-semibold uppercase tracking-widest text-slate-400">State</th>
            </tr>
          </thead>
          <tbody>
            {all.length === 0 && (
              <tr><td colSpan={2} className="px-5 py-8 text-center text-sm text-slate-400">Fetching services...</td></tr>
            )}
            {all.map((s, i) => (
              <tr key={i}
                className="transition-colors hover:bg-indigo-50/40"
                style={{
                  borderTop: '1px solid rgba(0,0,0,0.04)',
                  background: s.state !== 'running' ? 'rgba(239,68,68,0.03)' : 'transparent',
                }}>
                <td className="px-5 py-2.5 font-mono text-xs text-slate-600">{s.name}</td>
                <td className="px-5 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={s.state === 'running'
                      ? { background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }
                      : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }
                    }>
                    <span className="w-1.5 h-1.5 rounded-full"
                      style={{ background: s.state === 'running' ? '#22c55e' : '#ef4444',
                        boxShadow: s.state === 'running' ? '0 0 4px #22c55e' : '0 0 4px #ef4444' }}/>
                    {s.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}