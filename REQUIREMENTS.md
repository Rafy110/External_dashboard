# Requirements and setup

## Software requirements

- Node.js 20 or newer
- npm 10 or newer
- Git
- Prometheus 3.x or 2.x
- A browser for the dashboard UI

## Frontend dependencies

The app uses:

- React 19
- Vite 8
- Tailwind CSS 3
- React Router 7
- Axios
- Recharts

## Runtime requirements

- A running Prometheus instance
- A reachable metrics exporter for the dashboard data
- Access to the CloudWatch exporter endpoint for Mplace metrics

## Ports used

- Frontend dev server: http://localhost:5173
- Vite preview: http://localhost:4173
- Prometheus UI/API: http://localhost:9090
- CloudWatch exporter metrics: http://13.233.166.72:9106/metrics

## Quick start

```bash
npm install
npm run dev
```

## Build check

```bash
npm run build
```
