import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMetricConfig, queryPrometheus } from '../api';
import Gauge from '../components/Gauge';

function ProjectCard({ name, id, live, cpu, mem, disk, servicesUp, stoppedCount }) {
  return (
    <Link to={`/project/${id}`}
      className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group transition-all hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.95)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        textDecoration: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.15), 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.08), 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.95)'; }}>

      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: live
          ? 'linear-gradient(90deg, #6366f1, #818cf8, #6366f1)'
          : 'linear-gradient(90deg, #e2e8f0, #cbd5e1, #e2e8f0)' }}/>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">{name}</h3>
        {live ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            Live
          </div>
        ) : (
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-400">
            Coming soon
          </span>
        )}
      </div>

      {live ? (
        <>
          {stoppedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
              ⚠ {stoppedCount} service{stoppedCount > 1 ? 's' : ''} stopped
            </div>
          )}
          <div className="flex justify-around">
            <Gauge label="CPU" value={cpu} size={90}/>
            <Gauge label="MEM" value={mem} size={90}/>
            <Gauge label="DISK" value={disk} size={90}/>
          </div>
          <div className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
            <span className="text-xs text-slate-400">Services healthy</span>
            <span className="text-sm font-bold text-indigo-600">{servicesUp}</span>
          </div>
        </>
      ) : (
        <div className="flex justify-around opacity-20 pointer-events-none">
          <Gauge label="CPU" value={0} size={90}/>
          <Gauge label="MEM" value={0} size={90}/>
          <Gauge label="DISK" value={0} size={90}/>
        </div>
      )}
    </Link>
  );
}

export default function Overview() {
  const [localMetrics, setLocalMetrics] = useState({ cpu: null, mem: null, disk: null });
  const [mplaceMetrics, setMplaceMetrics] = useState({ cpu: null, mem: null, disk: null });
  const [running, setRunning] = useState(0);
  const [stopped, setStopped] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  async function fetchAll() {
    try {
      const localConfig = getMetricConfig('local-pc');
      const mplaceConfig = getMetricConfig('mplace');

      const [localCpuR, localMemR, localDiskR, localSvcRunR, localSvcStopR, mplaceCpuR, mplaceMemR, mplaceDiskR] = await Promise.all([
        queryPrometheus(localConfig.cpuQuery),
        queryPrometheus(localConfig.memQuery),
        queryPrometheus(localConfig.diskQuery),
        queryPrometheus(localConfig.serviceQuery),
        queryPrometheus('windows_service_state{state="stopped"}'),
        queryPrometheus(mplaceConfig.cpuQuery),
        queryPrometheus(mplaceConfig.memQuery),
        queryPrometheus(mplaceConfig.diskQuery),
      ]);

      setLocalMetrics({
        cpu: localCpuR.length ? parseFloat(localCpuR[0].value[1]).toFixed(1) : null,
        mem: localMemR.length ? parseFloat(localMemR[0].value[1]).toFixed(1) : null,
        disk: localDiskR.length ? parseFloat(localDiskR[0].value[1]).toFixed(1) : null,
      });
      setMplaceMetrics({
        cpu: mplaceCpuR.length ? parseFloat(mplaceCpuR[0].value[1]).toFixed(1) : null,
        mem: mplaceMemR.length ? parseFloat(mplaceMemR[0].value[1]).toFixed(1) : null,
        disk: mplaceDiskR.length ? parseFloat(mplaceDiskR[0].value[1]).toFixed(1) : null,
      });
      setRunning(localSvcRunR.length);
      setStopped(localSvcStopR.length);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    fetchAll();
    const i = setInterval(fetchAll, 30000);
    return () => clearInterval(i);
  }, []);

  const summaryCards = [
    { label: 'Projects monitored', value: '1', sub: '3 connecting soon', accent: '#6366f1', icon: '⬡' },
    { label: 'Services running', value: running || '--', sub: 'across all projects', accent: '#22c55e', icon: '◈' },
    { label: 'Services stopped', value: stopped || '0', sub: stopped > 0 ? 'Needs attention' : 'All clear', accent: stopped > 0 ? '#ef4444' : '#22c55e', icon: '⚠' },
    { label: 'Active incidents', value: '0', sub: 'All systems nominal', accent: '#6366f1', icon: '✦' },
  ];

  return (
    <div className="flex-1 overflow-auto p-8 relative"
      style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #eff6ff 100%)' }}>

      {/* Soft background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
      <div className="fixed bottom-0 left-64 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
      <div className="fixed top-1/2 left-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(30px)' }}/>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">All projects · centralized monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(99,102,241,0.15)', color: '#64748b', backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
              Refreshed {lastUpdate}
            </div>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
        {summaryCards.map((c, i) => (
          <div key={i} className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.95)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            }}>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
              style={{ background: c.accent, opacity: 0.1, filter: 'blur(12px)' }}/>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{c.label}</span>
              <span className="text-lg" style={{ color: c.accent }}>{c.icon}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{c.value}</p>
            <p className="text-xs mt-1" style={{ color: i === 2 && stopped > 0 ? '#ef4444' : '#94a3b8' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4 relative z-10">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
        <ProjectCard name="My PC (Local)" id="local-pc" live
          cpu={localMetrics.cpu} mem={localMetrics.mem} disk={localMetrics.disk}
          servicesUp={running} stoppedCount={stopped}/>
        <ProjectCard name="Mplace" id="mplace" live
          cpu={mplaceMetrics.cpu} mem={mplaceMetrics.mem} disk={mplaceMetrics.disk}
          servicesUp={running} stoppedCount={stopped}/>
        <ProjectCard name="PWC" id="pwc" live={false}/>
        <ProjectCard name="Staftr" id="staftr" live={false}/>
      </div>
    </div>
  );
}