export default function Gauge({ label, value, unit = '%', size = 160 }) {
  const pct = Math.max(0, Math.min(100, parseFloat(value) || 0));
  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const offset = arcLength - (pct / 100) * arcLength;
  const rotation = 135;

  let color1, color2, shadow;
  if (pct < 60) {
    color1 = '#6366f1'; color2 = '#818cf8'; shadow = 'rgba(99,102,241,0.35)';
  } else if (pct < 80) {
    color1 = '#f59e0b'; color2 = '#fbbf24'; shadow = 'rgba(245,158,11,0.35)';
  } else {
    color1 = '#ef4444'; color2 = '#f87171'; shadow = 'rgba(239,68,68,0.35)';
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }}>
          <defs>
            <linearGradient id={`g-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
            <filter id={`glow-${label}`}>
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="9"
            strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round"/>
          {/* Arc */}
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={`url(#g-${label})`} strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            filter={`url(#glow-${label})`}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-slate-800" style={{ fontSize: size * 0.2, lineHeight: 1 }}>
            {value == null ? '--' : value}
          </span>
          <span className="text-slate-400 font-medium" style={{ fontSize: size * 0.1 }}>{unit}</span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: color1 }}>
        {label}
      </span>
    </div>
  );
}