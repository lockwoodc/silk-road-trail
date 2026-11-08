# Welcome to your SparkCloud Space

This is your own cloud development environment — a full **VS Code** editor backed by a real Linux
container, with a terminal, a dev toolchain, and **Sparky**, your built-in AI coding agent. Anything
you build here is saved to your space and waiting for you next time.

---

## ✨ What you can do here

- **Edit code** in a full VS Code editor, right in your browser.
- **Use the terminal** (`Terminal → New Terminal`) — it's a real shell with **passwordless `sudo`**.
  Node.js, npm, Python 3, pip, git and build tools are already installed.
- **Install anything** — `sudo apt-get install -y <pkg>`, `npm install`, `pip install`, etc.
- **Ask Sparky** (the spark ✦ button, bottom-right) to plan, write and edit files, run commands,
  install dependencies, scaffold projects, debug, and build whole features for you.
- **Run & share a web app** with a public link — see below.

---

## Sparky — your AI pair programmer

Click the **✦ Sparky** button in the bottom-right corner. Sparky can:

- Plan a task, then read, write, and edit your files
- Run shell commands (installs, builds, tests) and show you the live output
- Search the project, track a to-do list, and remember decisions across sessions
- Scaffold new projects and wire things up end-to-end

Just tell it what you want — e.g. *"set up a Vite + Svelte app and run it"* or *"fix the failing build"*.
Your chat history is saved, so you can pick up where you left off.

---

## Running a web app (getting a public URL)

Your space's web ports aren't exposed to the internet directly. To preview a web app, use the
**`start.sh`** script in this folder — it runs your app and opens a free public
`https://…trycloudflare.com` link.

1. Open `start.sh` and set `PORT` + `APP_CMD` (there are copy-paste examples for Vite, Next, Flask,
   Django, Express, and more) — **or just ask Sparky:** *"configure start.sh for my app"*.
2. Run it:
   ```bash
   ./start.sh
   ```
3. It prints your public URL. Press **Ctrl-C** to stop the app and tear down the tunnel.

> **Seeing "Blocked request. This host is not allowed."?** Dev servers (Vite, webpack, Next…) reject
> unknown hostnames. Allow all hosts in your config — for Vite, in `vite.config.js`:
> ```js
> export default { server: { host: true, allowedHosts: true } }
> ```
> Or ask Sparky: *"allow all hosts so my app works through the tunnel"*. (See the notes at the top
> of `start.sh` for other frameworks.)

---

## Saving, sleeping & waking

- Your files live in this space and **persist** between sessions — no need to re-download anything.
- Spaces **auto-hibernate after ~30 minutes of inactivity** to save resources. Your work is preserved;
  just open the space again to wake it (your files come right back).
- Memory and CPU are **shared dynamically** across what's running on the node — a lightly-loaded space
  gets to use plenty of resources.

---

## Tips

- Your app must listen on `0.0.0.0` (not just `127.0.0.1`) and on the `PORT` you set in `start.sh`.
- Use the integrated terminal for git: `git init`, commit, push to your own remote.
- Stuck or curious? **Ask Sparky.** It knows this environment and can do the work for you.

Happy building! ✦
- Live game: play link via SparkCloud Launch
