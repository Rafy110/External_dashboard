import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMetricConfig, queryPrometheus } from '../api';
import Gauge from '../components/Gauge';
import StatCard from '../components/StatCard';
import ServiceTable from '../components/ServiceTable';
import LiveChart from '../components/LiveChart';
import ComingSoon from './ComingSoon';

const PROJECT_NAMES = {
  'local-pc': 'My PC (Local)',
  mplace: 'Mplace · Staging',
  pwc: 'PWC · Staging',
  staftr: 'Staftr · Staging',
};

function formatUptime(h) {
  if (!h) return null;
  const hrs = parseFloat(h);
  return hrs < 24 ? `${hrs.toFixed(1)}h` : `${(hrs/24).toFixed(1)}d`;
}

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const isLive = projectId === 'local-pc' || projectId === 'mplace';
  const [cpu, setCpu] = useState(null);
  const [mem, setMem] = useState(null);
  const [disk, setDisk] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [network, setNetwork] = useState(null);
  const [services, setServices] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef([]);

  async function fetchAll() {
    try {
      const config = getMetricConfig(projectId);

      const [cpuR, memR, diskR, uptR, netR, svcRunR, svcStopR, alertR] = await Promise.all([
        queryPrometheus(config.cpuQuery),
        queryPrometheus(config.memQuery),
        queryPrometheus(config.diskQuery),
        queryPrometheus(config.uptimeQuery),
        queryPrometheus(config.networkQuery),
        projectId === 'mplace'
          ? queryPrometheus(config.serviceQuery)
          : queryPrometheus('windows_service_state{state="running"}'),
        projectId === 'mplace'
          ? Promise.resolve([])
          : queryPrometheus('windows_service_state{state="stopped"}'),
        queryPrometheus(config.alertQuery),
      ]);
      const cpuVal = cpuR.length ? parseFloat(cpuR[0].value[1]).toFixed(1) : null;
      const memVal = memR.length ? parseFloat(memR[0].value[1]).toFixed(1) : null;
      setCpu(cpuVal); setMem(memVal);
      if (diskR.length) setDisk(parseFloat(diskR[0].value[1]).toFixed(1));
      if (uptR.length) setUptime(parseFloat(uptR[0].value[1]));
      if (netR.length) setNetwork((netR.reduce((s,r) => s + parseFloat(r.value[1]),0)/1024).toFixed(1));
      // Combine running + stopped
      const running = projectId === 'mplace'
        ? svcRunR.filter(r => parseFloat(r.value[1]) === 1).map(r => ({ name: r.metric.ServiceName || r.metric.service || r.metric.instance_id || r.metric.instance || 'Service', state: 'running' }))
        : svcRunR.map(r => ({ name: r.metric.name, state: 'running' }));
      const stopped = projectId === 'mplace'
        ? svcRunR.filter(r => parseFloat(r.value[1]) !== 1).map(r => ({ name: r.metric.ServiceName || r.metric.service || r.metric.instance_id || r.metric.instance || 'Service', state: 'stopped' }))
        : svcStopR.map(r => ({ name: r.metric.name, state: 'stopped' }));
      setServices([...stopped, ...running]);
      setActiveAlerts(alertR.length ? parseInt(alertR[0].value[1]) : 0);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setError(null);
      const point = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: cpuVal ? parseFloat(cpuVal) : 0,
        mem: memVal ? parseFloat(memVal) : 0,
      };
      chartRef.current = [...chartRef.current.slice(-29), point];
      setChartData([...chartRef.current]);
    } catch (e) { setError(e.message); }
  }

  useEffect(() => {
    if (!isLive) return;
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [isLive, projectId]);

  if (!isLive) return <ComingSoon name={PROJECT_NAMES[projectId] || projectId}/>;

  const stoppedServices = services.filter(s => s.state !== 'running');

  return (
    <div className="flex-1 overflow-auto p-6 relative"
      style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #eff6ff 100%)' }}>

      {/* Bg blobs */}
      <div className="fixed top-20 right-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}/>
      <div className="fixed bottom-20 left-72 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}/>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">{PROJECT_NAMES[projectId]}</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Live
            </span>
            {stoppedServices.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                ⚠ {stoppedServices.length} stopped
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Metrics refresh every 15 seconds via Prometheus</p>
        </div>
        {lastUpdate && (
          <div className="text-xs px-3 py-1.5 rounded-full flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(99,102,241,0.15)', color: '#64748b', backdropFilter: 'blur(8px)' }}>
            <span className="w-1 h-1 rounded-full bg-emerald-400"/>
            {lastUpdate}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm relative z-10 flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          ⚠ {error}
        </div>
      )}

      {/* Gauges */}
      <div className="rounded-2xl p-6 mb-5 relative z-10"
        style={{
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.95)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        }}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resource Utilization</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400"/>Normal &lt;60%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"/>Warning 60–80%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"/>Critical &gt;80%</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-12 justify-around">
          <Gauge label="CPU" value={cpu} size={160}/>
          <Gauge label="Memory" value={mem} size={160}/>
          <Gauge label="Disk Used (C:)" value={disk} size={160}/>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 relative z-10">
        <StatCard title="System Uptime" value={formatUptime(uptime) ?? '--'} accent="#6366f1"
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}/>
        <StatCard title="Network I/O" value={network ?? '--'} unit="KB/s" accent="#8b5cf6"
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 3l4 4-4 4M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}/>
        <StatCard title="Services OK" value={services.filter(s=>s.state==='running').length || '--'}
          sub="healthy and running" accent="#22c55e"
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}/>
        <StatCard title="Stopped / Alerts"
          value={`${stoppedServices.length} / ${activeAlerts}`}
          sub={stoppedServices.length === 0 && activeAlerts === 0 ? 'All clear' : 'Needs attention'}
          accent={stoppedServices.length > 0 || activeAlerts > 0 ? '#ef4444' : '#22c55e'}
          icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L1 12h12L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 5v3M7 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>}/>
      </div>

      {/* Chart + Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 relative z-10">
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.95)', boxShadow: '0 4px 24px rgba(99,102,241,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">System Load</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded bg-indigo-400"/>CPU</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 rounded bg-rose-400"/>Memory</span>
            </div>
          </div>
          {chartData.length < 2 ? (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-5 h-5 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin"/>
              <span className="text-xs">Collecting data...</span>
            </div>
          ) : <LiveChart data={chartData}/>}
        </div>

        <ServiceTable services={services} title={projectId === 'mplace' ? 'Mplace Services' : 'Windows Services'}/>
      </div>

      {/* SLI */}
      <div className="rounded-2xl p-5 relative z-10"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 24px rgba(99,102,241,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">SLIs &amp; Targets</p>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)' }}>
            Configured on real servers
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'API Error Rate', target: '< 1%', note: 'Nginx/app metrics required' },
            { name: 'P95 Latency', target: '< 300ms', note: 'App instrumentation required' },
            { name: 'Uptime SLO', target: '99.9%', note: 'Alert rules required' },
          ].map(item => (
            <div key={item.name} className="rounded-xl p-4 relative overflow-hidden"
              style={{ background: 'rgba(99,102,241,0.04)', border: '1px dashed rgba(99,102,241,0.15)' }}>
              <p className="text-xs font-semibold text-slate-500 mb-2">{item.name}</p>
              <p className="text-2xl font-bold text-slate-300 mb-2">--</p>
              <p className="text-xs text-slate-400">Target: <span className="font-semibold text-indigo-400">{item.target}</span></p>
              <p className="text-xs text-slate-300 mt-0.5">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}