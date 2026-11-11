# BizSkill Operations ERP (Print & Signs)

WordPress plugin running at system.printandsigns.in.

## How a release works
1. Make the change.
2. Bump the version in **both** places in `bizskill-operations-erp.php`:
   - header line ` * Version: X.Y.Z`
   - `const VERSION='X.Y.Z'`
3. Add a line at the top of `readme.txt`: `* vX.Y.Z: what changed`
4. Push to `main`.

GitHub Actions then checks the two versions match, runs a PHP syntax check, builds
`bizskill-operations-erp.zip` and publishes Release `vX.Y.Z`.
Pushes that do not change the version do **not** create a release and do **not** reach the live site.

It also moves the **`release` branch** to that commit. The live site uses the
**Deployer for Git** plugin linked to `release`, so a new version deploys automatically
(via the GitHub webhook) or when you click Deploy in WordPress → Deployer for Git.

## Private repository
The free Deployer for Git works only with public repositories. A private repository needs Deployer for Git Pro
and a fine-grained token (Contents: Read, this repo only) entered in the Deployer package settings.

## Rollback
Restore the previous code, give it a **higher** version number (e.g. 2.10.103), push.
Or download an older Release ZIP and upload it in WordPress (Plugins → Add Plugin → Upload → Replace current).
Always take a backup first: Settings → BizSkill ERP Backup → Download Backup.

## Contents
- `bizskill-operations-erp.php` – the plugin
- `assets/` – CSS, JS, icons
