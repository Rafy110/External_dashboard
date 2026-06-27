import Gauge from '../components/Gauge';
import StatCard from '../components/StatCard';

export default function ComingSoon({ name }) {
  return (
    <div className="flex-1 overflow-auto p-8 relative"
      style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #eff6ff 100%)' }}>

      {/* Bg blobs */}
      <div className="fixed top-20 right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}/>
      <div className="fixed bottom-20 left-72 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}/>

      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-slate-800">{name}</h2>
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            Awaiting connection
          </span>
        </div>
        <p className="text-sm text-slate-400">
          This project will display live metrics once the Prometheus endpoint is connected via the jump server.
        </p>
      </div>

      {/* Preview layout dimmed */}
      <div className="opacity-20 pointer-events-none select-none relative z-10">
        <div className="rounded-2xl p-6 mb-5"
          style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.95)', boxShadow: '0 4px 24px rgba(99,102,241,0.08)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Resource Utilization</p>
          <div className="flex flex-wrap gap-12 justify-around">
            <Gauge label="CPU" value={null} size={140}/>
            <Gauge label="Memory" value={null} size={140}/>
            <Gauge label="Disk Used" value={null} size={140}/>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Uptime" value="--"/>
          <StatCard title="Network" value="--" unit="KB/s"/>
          <StatCard title="Services OK" value="--"/>
          <StatCard title="Stopped / Alerts" value="-- / --"/>
        </div>
      </div>

      {/* Connection steps */}
      <div className="mt-8 rounded-2xl p-6 relative z-10"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(99,102,241,0.15)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        }}>
        <p className="text-sm font-bold text-slate-700 mb-4">How to connect {name}</p>
        <div className="flex flex-col gap-3">
          {[
            { step: '1', text: `Configure Nginx reverse proxy on jump server to expose Prometheus for ${name}` },
            { step: '2', text: 'Update PROM_URL in src/api.js with the correct endpoint and project label filter' },
            { step: '3', text: "Change status from 'soon' to 'live' in Sidebar.jsx — this page populates automatically" },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                {item.step}
              </span>
              <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}