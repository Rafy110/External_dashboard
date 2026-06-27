# Local Dashboard

This project is a React + Vite dashboard for monitoring system health and project metrics. It is designed to show live CPU, memory, disk, uptime, network, service health, and alert information for different environments such as Local PC and Mplace.

## What this app does

- Shows an overview page with project cards
- Opens a project-specific dashboard for live metrics
- Pulls data from Prometheus using configured selectors
- Displays CPU, memory, disk, uptime, network, services, and alerts

## Main folders

- src/pages: overview and dashboard pages
- src/components: UI components such as gauges, stat cards, and service tables
- src/api.js: Prometheus query configuration and metric selectors
- public: static assets

## Ports

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

## Prometheus setup

See [PROMETHEUS_CONFIG.md](PROMETHEUS_CONFIG.md) for the Prometheus scrape configuration used by this dashboard.

## Requirements

See [REQUIREMENTS.md](REQUIREMENTS.md) for the required software and environment details.

## Notes

- The dashboard depends on Prometheus being up and reachable.
- The Mplace section depends on exporter metrics being available under the expected labels and names.
- If disk, service, or alert values are empty, the exporter must expose those metrics in Prometheus.
