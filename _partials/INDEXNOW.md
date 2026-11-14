# IndexNow

CloFix uses [IndexNow](https://www.indexnow.org/) so search engines can pick up changed URLs quickly.

## Key file
- Key file lives in the site root: `<key>.txt` (filename stem must match file contents).
- Must be publicly reachable at `https://clofix.com/<key>.txt` after deploy.

## Submit after deploy
```bash
# Changed HTML since last commit
python3 _partials/indexnow.py --git

# Specific pages
python3 _partials/indexnow.py /features /free-trial /waf-setup

# All sitemap URLs
python3 _partials/indexnow.py --sitemap
```

Run this **after** the updated files are live on `clofix.com`.
