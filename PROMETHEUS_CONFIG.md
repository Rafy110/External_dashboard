# Prometheus configuration

This dashboard expects Prometheus to scrape the following targets and labels.

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "local-pc"
    static_configs:
      - targets: ["localhost:9182"]
        labels:
          project: "local-pc"
          job: "local-pc"

  - job_name: "mplace-node"
    static_configs:
      - targets: ["<mplace-node-host>:9100"]
        labels:
          project: "mplace"
          job: "mplace-node"
          exported_job: "mplacestaging"

  - job_name: "mplace-cloudwatch"
    static_configs:
      - targets: ["13.233.166.72:9106"]
        labels:
          project: "mplace"
          job: "mplace-cloudwatch"
          exported_job: "mplacestaging"
    honor_timestamps: false
```

## Important notes

- The dashboard queries metrics for the Mplace project using the labels `project="mplace"` and `job="mplace-cloudwatch"`.
- The `honor_timestamps: false` setting is important for the CloudWatch exporter because the exporter can publish data with future timestamps.
- If disk, service, or alert values are empty, the exporter must expose those metrics with matching names in Prometheus.

## Local checks

```bash
curl http://localhost:9090/api/v1/targets
curl http://localhost:9090/api/v1/series?match[]=aws_ec2_cpuutilization_average
```
