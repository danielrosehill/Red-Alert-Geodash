Deploy the geodash app to ubuntuvm (Tailscale).

Steps:
1. Copy the changed frontend and backend files to the private repo on ubuntuvm:
   ```
   scp www/static/components.js www/static/dashboard.js ubuntuvm:/home/daniel/repos/github/RE_Geodash_Private/www/static/
   scp www/dashboard.html www/tablet.html www/settings.html www/alerts-news.html www/history.html www/news.html www/tv.html www/index.html ubuntuvm:/home/daniel/repos/github/RE_Geodash_Private/www/
   ```
   Also copy backend files if changed:
   ```
   scp backend/server.py ubuntuvm:/home/daniel/repos/github/RE_Geodash_Private/backend/
   ```
2. Rebuild and restart the Docker container:
   ```
   ssh ubuntuvm "cd /home/daniel/repos/github/RE_Geodash_Private && docker compose build geodash && docker compose up -d geodash"
   ```
3. Verify the container is healthy:
   ```
   ssh ubuntuvm "docker ps --filter name=geodash-app --format '{{.Status}}'"
   ```

Notes:
- The private repo is at `ubuntuvm:/home/daniel/repos/github/RE_Geodash_Private`
- The public repo (this one) and private repo are NOT connected (no submodules)
- Container runs on port 8083 (maps to internal 8765)
- InfluxDB runs alongside in `geodash-influxdb` container
- Only copy files that have actually changed to keep the Docker layer cache efficient
