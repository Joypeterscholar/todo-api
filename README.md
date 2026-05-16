# ✅ Todo API — GitHub Actions Demo

A production-style **Express.js REST API** wired up with **5 GitHub Actions workflows** — all free, all automatic.

---

## 🗂️ Project Structure

```
todo-api/
├── .github/
│   └── workflows/
│       ├── ci.yml            # CI pipeline (lint → test → build → smoke test)
│       ├── deploy.yml        # Auto deploy to Render on push to main
│       ├── pr-checks.yml     # PR labels, title check, welcome comment
│       ├── maintenance.yml   # Weekly security audit + daily stale cleanup
│       └── release.yml       # Auto GitHub Release on version tag
├── src/
│   ├── app.js                # Express app (routes + logic)
│   └── server.js             # Entry point
├── tests/
│   └── app.test.js           # 16 unit + integration tests
├── render.yaml               # Render.com deploy config
├── package.json
└── .eslintrc.json
```

---

## ⚙️ The 5 Workflows

| # | File | Trigger | What it does |
|---|------|---------|--------------|
| 1 | `ci.yml` | Every push & PR | Lint → Test (×3 Node versions) → Build → Smoke test |
| 2 | `deploy.yml` | Push to `main` only | Deploys to Render, health-checks production |
| 3 | `pr-checks.yml` | PR opened/updated | Labels PR, validates title, posts checklist comment |
| 4 | `maintenance.yml` | Mon 9am + daily midnight | Security audit + stale issue cleanup |
| 5 | `release.yml` | Git tag push (`v*.*.*`) | Runs tests, packages app, creates GitHub Release |

---

## 🚀 Full Setup (zero cost)

### Step 1 — Create your GitHub repo

```bash
git init
git add .
git commit -m "feat: initial todo API with GitHub Actions"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-api.git
git push -u origin main
```

Go to the **Actions** tab on GitHub — the CI pipeline runs immediately! ✅

---

### Step 2 — Deploy free on Render.com

1. Sign up free at [render.com](https://render.com)
2. **New → Web Service → Connect GitHub** → select your repo
3. Render detects `render.yaml` automatically
4. Click **Deploy** — it installs, builds, and starts your app
5. You get a URL like `https://todo-api-xxxx.onrender.com`

Now configure the deploy workflow:

**In Render:**
- Go to your service → **Settings** → **Deploy Hook**
- Copy the hook URL (looks like `https://api.render.com/deploy/srv-xxx?key=xxx`)

**In GitHub → Settings → Secrets and Variables → Actions:**
- Add **Secret:** `RENDER_DEPLOY_HOOK_URL` = (paste the hook URL)
- Add **Variable:** `APP_URL` = `https://todo-api-xxxx.onrender.com`

Now every push to `main` automatically deploys! 🚀

---

### Step 3 — Enable coverage reports (optional, free)

1. Sign up free at [codecov.io](https://codecov.io) with GitHub
2. Find your repo and copy the **token**
3. In GitHub → Settings → Secrets: add `CODECOV_TOKEN` = (paste token)

Done — coverage reports appear on every PR.

---

### Step 4 — Create labels for auto-labelling

In your GitHub repo → **Issues → Labels → New label**, create these:

| Label | Color |
|-------|-------|
| `feature` | `#0075ca` |
| `bug` | `#d73a4a` |
| `hotfix` | `#e4e669` |
| `documentation` | `#0075ca` |
| `chore` | `#e4e669` |
| `refactor` | `#cfd3d7` |
| `tests` | `#0e8a16` |
| `ci/cd` | `#5319e7` |
| `stale` | `#ededed` |

---

### Step 5 — Create your first release

```bash
git tag v1.0.0
git push origin v1.0.0
```

Watch the **Release workflow** run → it creates a GitHub Release with changelog + zip! 🎉

---

## 🧪 Run Locally

```bash
npm install
npm test         # run all 16 tests
npm run lint     # check code style
npm start        # start server on port 3003
```

Test the API manually:
```bash
# Health check
curl http://localhost:3003/health

# Create a todo
curl -X POST http://localhost:3003/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn GitHub Actions"}'

# Get all todos
curl http://localhost:3003/todos

# Mark as done (replace 1 with your todo's id)
curl -X PATCH http://localhost:3003/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3003/todos/1
```

---

## 📚 GitHub Actions Concepts Used

| Concept | Where |
|---------|-------|
| `on: push / pull_request` | ci.yml, deploy.yml |
| `on: schedule` (cron) | maintenance.yml |
| `on: push tags` | release.yml |
| `on: workflow_dispatch` (manual trigger) | maintenance.yml |
| Job chaining with `needs:` | ci.yml, release.yml |
| Matrix strategy (parallel jobs) | ci.yml |
| `fail-fast: false` | ci.yml |
| Conditional jobs (`if:`) | deploy.yml, maintenance.yml |
| `concurrency` (cancel duplicates) | ci.yml |
| `timeout-minutes` | ci.yml, deploy.yml |
| `environment:` + URL | deploy.yml |
| `$GITHUB_ENV` (pass data between steps) | ci.yml smoke-test |
| `$GITHUB_STEP_SUMMARY` (rich job summaries) | deploy.yml, maintenance.yml |
| `actions/upload-artifact` | ci.yml, release.yml |
| `actions/download-artifact` | release.yml |
| `actions/github-script` (JS in workflow) | pr-checks.yml |
| `actions/stale` | maintenance.yml |
| `softprops/action-gh-release` | release.yml |
| `codecov/codecov-action` | ci.yml |
| `secrets` | deploy.yml |
| `vars` (non-secret variables) | deploy.yml |
| Coverage thresholds | package.json + jest |
| Health check via curl | ci.yml, deploy.yml |
| Git log changelog generation | release.yml |
| PR title validation (Conventional Commits) | pr-checks.yml |
| Auto-commenting on PRs | pr-checks.yml |

---

## 🆓 Everything Is Free

| Tool | Plan | Cost |
|------|------|------|
| GitHub Actions | Free plan | 2,000 min/month free |
| Render.com | Free tier | $0 |
| Codecov | Free for public repos | $0 |
| GitHub Releases | Always free | $0 |
| Stale action | Free | $0 |

> **Note:** GitHub Free gives 2,000 CI minutes/month for private repos, unlimited for public repos.

