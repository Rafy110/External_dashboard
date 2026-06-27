import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-xs shadow-xl"
      style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(99,102,241,0.15)', backdropFilter: 'blur(12px)' }}>
      <p className="font-semibold text-slate-500 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }}/>
          <span className="text-slate-500">{p.name}</span>
          <span className="ml-auto font-bold text-slate-800">{parseFloat(p.value).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function LiveChart({ data }) {
  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="rgba(99,102,241,0.06)" vertical={false}/>
          <XAxis dataKey="time"
            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter' }}
            axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter' }}
            axisLine={false} tickLine={false}/>
          <Tooltip content={<CustomTooltip/>} cursor={{ stroke: 'rgba(99,102,241,0.15)', strokeWidth: 1 }}/>
          <Area type="monotone" dataKey="cpu" name="CPU"
            stroke="#6366f1" strokeWidth={2.5} fill="url(#indigoGrad)"
            dot={false} activeDot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }}/>
          <Area type="monotone" dataKey="mem" name="Memory"
            stroke="#f43f5e" strokeWidth={2.5} fill="url(#roseGrad)"
            dot={false} activeDot={{ r: 5, fill: '#f43f5e', stroke: 'white', strokeWidth: 2 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}