# Health Check Configuration

## Docker Health Check

The application includes a health check in the Docker Compose configuration:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Monitoring Health

### Check Container Health Status

```bash
# View container health status
docker compose ps

# View detailed health check logs
docker inspect aexpo-app --format='{{json .State.Health}}' | jq
```

### Manual Health Check

```bash
# From the VPS
curl -f http://localhost:3000 || echo "Health check failed"

# From outside (if exposed)
curl -f http://your-vps-ip:3000 || echo "Health check failed"
```

## Automatic Restart

The container is configured with `restart: unless-stopped`, which means:
- Container will automatically restart if it crashes
- Container will restart after system reboot
- Container won't restart if manually stopped

## Monitoring Solutions

### Basic Monitoring with Docker

```bash
# Check resource usage
docker stats aexpo-app

# View logs in real-time
docker compose logs -f --tail=100
```

### Advanced Monitoring (Optional)

Consider using:
- **Prometheus + Grafana** for metrics
- **ELK Stack** for log aggregation
- **Uptime Robot** for external monitoring
- **Sentry** for error tracking

## Troubleshooting Failed Health Checks

If health checks fail:

1. **Check application logs**
   ```bash
   docker compose logs app
   ```

2. **Verify port binding**
   ```bash
   docker compose ps
   sudo lsof -i :3000
   ```

3. **Test manually**
   ```bash
   docker exec aexpo-app wget --quiet --tries=1 --spider http://localhost:3000
   ```

4. **Restart container**
   ```bash
   docker compose restart app
   ```

## Custom Health Check Endpoint

If you want to add a dedicated health check endpoint to your Nuxt.js app:

### Create server endpoint

`server/api/health.ts`:
```typescript
export default defineEventHandler((event) => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
})
```

### Update Docker health check

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Test the endpoint

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```
