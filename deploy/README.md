# Deploy artifacts

These Dockerfiles and Kubernetes manifests are **deployable**. They do **not** mean a live cluster is running.

## Verify manifests (no cluster required)

```bash
# Install kubeconform, then:
kubeconform -summary -strict deploy/k8s/*.yaml
```

Or with kubectl against a real API:

```bash
kubectl apply --dry-run=client -f deploy/k8s/
```

## Images

```bash
docker build -t runracks/backend:local Backend
docker build -t runracks/frontend:local Frontend
```

## Honesty

- Applying these manifests to a cluster is a separate ops step.
- Until that happens, readiness evidence must say Kubernetes is **configured in-repo**, not **running in production**.
- Secrets in `deploy/k8s/config.yaml` are placeholders — rotate before any real apply.
