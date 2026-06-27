import axios from 'axios';

const PROM_URL = 'http://localhost:9090';

export function buildPrometheusSelector(projectId, extraLabels = {}) {
  const labels = { project: projectId, ...extraLabels };

  if (projectId === 'local-pc') {
    labels.job = 'local-pc';
  } else if (projectId === 'mplace') {
    labels.job = 'mplace-cloudwatch';
    labels.exported_job = 'mplacestaging';
  }

  const parts = Object.entries(labels).map(([key, value]) => `${key}="${value}"`);
  return `{${parts.join(', ')}}`;
}

export function getMetricConfig(projectId) {
  if (projectId === 'mplace') {
    return {
      cpuQuery: 'max(aws_ec2_cpuutilization_average{job="mplace-cloudwatch",project="mplace",exported_job="aws_ec2"})',
      memQuery: 'max(mplacestaging_mem_used_percent_average{job="mplace-cloudwatch",project="mplace",exported_job="mplacestaging"})',
      diskQuery: 'max(mplacestaging_used_percent_average{job="mplace-cloudwatch",project="mplace",exported_job="mplacestaging"})',
      uptimeQuery: '(time() - process_start_time_seconds{job="mplace-cloudwatch",project="mplace"}) / 3600',
      networkQuery: 'vector(0)',
      serviceQuery: 'mplacestaging_service_status_average{job="mplace-cloudwatch",project="mplace",exported_job="mplacestaging"}',
      alertQuery: 'max(mplacestaging_service_alert_status_average{job="mplace-cloudwatch",project="mplace",exported_job="mplacestaging"}) or vector(0)',
    };
  }

  return {
    cpuQuery: '100 - (avg by (instance) (rate(windows_cpu_time_total{mode="idle"}[1m])) * 100)',
    memQuery: '100 - (windows_memory_available_bytes / windows_memory_physical_total_bytes * 100)',
    diskQuery: '100 - ((windows_logical_disk_free_bytes{volume="C:"} / windows_logical_disk_size_bytes{volume="C:"}) * 100)',
    uptimeQuery: '(time() - windows_system_system_up_time) / 3600',
    networkQuery: 'rate(windows_net_bytes_total[1m])',
    serviceQuery: 'windows_service_state{state="running"}',
    alertQuery: 'count(ALERTS{alertstate="firing"}) or vector(0)',
  };
}

export async function queryPrometheus(promql) {
  const res = await axios.get(`${PROM_URL}/api/v1/query`, {
    params: { query: promql },
  });
  return res.data.data.result;
}

export async function queryRange(promql, minutes = 30) {
  const now = Math.floor(Date.now() / 1000);
  const start = now - minutes * 60;
  const res = await axios.get(`${PROM_URL}/api/v1/query_range`, {
    params: { query: promql, start, end: now, step: '60' },
  });
  return res.data.data.result;
}