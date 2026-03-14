#!/usr/bin/env python3
"""
Masterarbeit Präsentation — Cross-platform Setup & Launcher.

Works on macOS, Linux, and Windows.
Double-click Start_App.command (macOS) or start_app.bat (Windows),
or run directly: python3 start.py
"""

import subprocess
import sys
import os
import platform
import time
import threading
import webbrowser
import re
import json

# ── ANSI & Windows VT mode ──────────────────────────────────
if platform.system() == "Windows":
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        pass

BOLD  = "\033[1m"
DIM   = "\033[2m"
RESET = "\033[0m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
BLUE  = "\033[34m"
CYAN  = "\033[36m"
RED   = "\033[31m"
CLR   = "\033[K"       # clear to end of line
UP    = "\033[{}A"     # move cursor up N lines
HIDE  = "\033[?25l"    # hide cursor
SHOW  = "\033[?25h"    # show cursor

BAR_W = 36


# ── Step name constants ──────────────────────────────────────

STEPS_DE = [
    "Node.js pruefen",
    "Abhaengigkeiten installieren",
    "Praesentation starten",
]

STEPS_EN = [
    "Check Node.js",
    "Install dependencies",
    "Launch presentation",
]


# ── Localized messages ───────────────────────────────────────

MSG = {
    "de": {
        "error": "Fehler",
        "press_enter": "Druecken Sie Enter zum Beenden...",
        "check_ver": "Pruefe Version...",
        "min_node": "Node.js {ver} — mindestens v18 erforderlich.\n"
                    "  Bitte installieren: https://nodejs.org",
        "node_missing": "Node.js nicht gefunden.\n"
                        "  Bitte installieren: https://nodejs.org",
        "deps_exist": "node_modules/ vorhanden",
        "checking": "Pruefe...",
        "installing": "Installiere...",
        "install_failed": "npm install fehlgeschlagen",
        "up_to_date": "aktuell",
        "packages": "Pakete",
        "new": "neu",
        "check_port": "Pruefe Port...",
        "starting": "Starte...",
        "ready": "Bereit",
        "browser_auto": "Browser oeffnet sich automatisch",
        "to_exit": "Zum Beenden:",
        "app_closed": "Praesentation beendet.",
        "unexpected": "Unerwarteter Fehler:",
    },
    "en": {
        "error": "Error",
        "press_enter": "Press Enter to exit...",
        "check_ver": "Checking version...",
        "min_node": "Node.js {ver} — at least v18 required.\n"
                    "  Please install: https://nodejs.org",
        "node_missing": "Node.js not found.\n"
                        "  Please install: https://nodejs.org",
        "deps_exist": "node_modules/ exists",
        "checking": "Checking...",
        "installing": "Installing...",
        "install_failed": "npm install failed",
        "up_to_date": "up to date",
        "packages": "packages",
        "new": "new",
        "check_port": "Checking port...",
        "starting": "Starting...",
        "ready": "Ready",
        "browser_auto": "Browser opens automatically",
        "to_exit": "To exit:",
        "app_closed": "Presentation closed.",
        "unexpected": "Unexpected error:",
    },
}


# ── ASCII Art Logo ───────────────────────────────────────────

_KOLLO_TOP = [
    "██╗  ██╗   ██████╗   ██╗       ██╗        ██████╗ ",
    "██║ ██╔╝  ██╔═══██╗  ██║       ██║       ██╔═══██╗",
    "█████╔╝   ██║   ██║  ██║       ██║       ██║   ██║",
    "██╔═██╗   ██║   ██║  ██║       ██║       ██║   ██║",
    "██║  ██╗  ╚██████╔╝  ███████╗  ███████╗  ╚██████╔╝",
    "╚═╝  ╚═╝   ╚═════╝   ╚══════╝  ╚══════╝   ╚═════╝ ",
]

_KOLLO_BOT = [
    "  ██████╗   ██╗   ██╗  ██╗  ██╗   ██╗  ███╗   ███╗",
    " ██╔═══██╗  ██║   ██║  ██║  ██║   ██║  ████╗ ████║",
    " ██║   ██║  ██║   ██║  ██║  ██║   ██║  ██╔████╔██║",
    " ██║▄▄ ██║  ██║   ██║  ██║  ██║   ██║  ██║╚██╔╝██║",
    " ╚██████╔╝  ╚██████╔╝  ██║  ╚██████╔╝  ██║ ╚═╝ ██║",
    "  ╚══▀▀═╝    ╚═════╝   ╚═╝   ╚═════╝   ╚═╝     ╚═╝",
]


def print_logo():
    """Print Kolloquium ASCII art in RED."""
    print()
    for line in _KOLLO_TOP:
        print(f"  {RED}{BOLD}{line}{RESET}")
    print()
    for line in _KOLLO_BOT:
        print(f"  {RED}{BOLD}{line}{RESET}")
    print()
    print(f"    {DIM}Masterarbeit Pr\u00e4sentation \u00b7 Institut f\u00fcr Elektromobilit\u00e4t{RESET}")


# ── Cross-platform key input ────────────────────────────────

def _get_key():
    """Read a single keypress. Returns 'left', 'right', 'enter', or None."""
    if platform.system() == "Windows":
        import msvcrt
        ch = msvcrt.getch()
        if ch == b'\r':
            return "enter"
        if ch in (b'\xe0', b'\x00'):
            ch2 = msvcrt.getch()
            if ch2 == b'K':
                return "left"
            if ch2 == b'M':
                return "right"
        return None
    else:
        import termios
        import tty
        fd = sys.stdin.fileno()
        old = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            ch = sys.stdin.read(1)
            if ch in ('\r', '\n'):
                return "enter"
            if ch == '\x1b':
                ch2 = sys.stdin.read(1)
                if ch2 == '[':
                    ch3 = sys.stdin.read(1)
                    if ch3 == 'D':
                        return "left"
                    if ch3 == 'C':
                        return "right"
            return None
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old)


# ── Generic Box Selector ─────────────────────────────────────

def _render_boxes(labels, selected_idx, box_w=25):
    """Build two boxes side by side as a list of strings."""
    norm = []
    for lbl in labels:
        lines_list = lbl if isinstance(lbl, list) else [lbl]
        while lines_list and lines_list[-1] == "":
            lines_list = lines_list[:-1]
        norm.append(lines_list if lines_list else [""])

    max_lines = max(len(l) for l in norm)
    inner_height = max(3, max_lines)
    total_rows = 2 + inner_height

    gap = "   "
    lines = []

    for row in range(total_rows):
        parts = []
        for i, label_lines in enumerate(norm):
            color = GREEN if i == selected_idx else DIM
            w = box_w

            if row == 0:
                parts.append(f"{color}\u2554{'═' * w}\u2557{RESET}")
            elif row == total_rows - 1:
                parts.append(f"{color}\u255a{'═' * w}\u255d{RESET}")
            else:
                inner_row = row - 1
                top_pad = (inner_height - len(label_lines)) // 2
                li = inner_row - top_pad

                if 0 <= li < len(label_lines):
                    text = label_lines[li]
                    padded = text.center(w)
                    if li == 0:
                        indicator = "\u25ba  " if i == selected_idx else "   "
                        padded = indicator + padded[len(indicator):]
                    if i == selected_idx:
                        parts.append(
                            f"{color}\u2551{BOLD}{padded}{RESET}{color}\u2551{RESET}"
                        )
                    else:
                        parts.append(f"{color}\u2551{padded}\u2551{RESET}")
                else:
                    parts.append(f"{color}\u2551{' ' * w}\u2551{RESET}")

        lines.append(f"  {gap.join(parts)}")

    return lines, total_rows


def _interactive_select(labels, prompt, result_names):
    """Generic interactive two-option selector. Returns result_names[idx]."""
    selected = 0

    print(f"  {DIM}{prompt}  (\u25c4 \u25ba + Enter){RESET}")

    sys.stdout.write(HIDE)
    rendered = False
    box_lines = 0

    try:
        while True:
            if rendered:
                sys.stdout.write(UP.format(box_lines))

            rendered_lines, box_lines = _render_boxes(labels, selected)
            for line in rendered_lines:
                sys.stdout.write(f"\r{CLR}{line}\n")
            sys.stdout.flush()
            rendered = True

            key = _get_key()
            if key == "left":
                selected = 0
            elif key == "right":
                selected = 1
            elif key == "enter":
                break
    except Exception:
        sys.stdout.write(SHOW)
        print()
        choice = input(f"  [{'/'.join(result_names)}]: ").strip().lower()
        for i, name in enumerate(result_names):
            if choice == name:
                return name
        return result_names[0]
    finally:
        sys.stdout.write(SHOW)

    print()
    return result_names[selected]


# ── Language Selector ────────────────────────────────────────

_LANG_LABELS = ["D E U T S C H", "E N G L I S H"]


def select_language():
    """Interactive language selector. Returns 'de' or 'en'."""
    result = _interactive_select(
        _LANG_LABELS,
        "Sprache waehlen / Select language",
        ["de", "en"],
    )
    chosen = "Deutsch" if result == "de" else "English"
    print(f"  {GREEN}\u2713 {chosen}{RESET}")
    print()
    return result


# ── Step Display Engine ──────────────────────────────────────

class StepDisplay:
    """Manages rendering of all step progress bars."""

    PENDING = "pending"
    ACTIVE  = "active"
    DONE    = "done"
    FAILED  = "failed"

    ICONS = {
        "pending": f"{DIM}\u25cb{RESET}",   # ○
        "active":  f"{YELLOW}\u25cf{RESET}", # ●
        "done":    f"{GREEN}\u2713{RESET}",  # ✓
        "failed":  f"{RED}\u2717{RESET}",    # ✗
    }

    def __init__(self, step_names, header_fn=None):
        self.steps = []
        for name in step_names:
            self.steps.append({
                "name": name,
                "status": self.PENDING,
                "pct": 0,
                "detail": "",
                "result": "",
            })
        self.rendered = False
        self.total_lines = len(self.steps) * 2
        self.is_windows = platform.system() == "Windows"
        self.header_fn = header_fn
        self._last_render = 0

    def _bar_str(self, pct, status):
        """Build a colored progress bar string."""
        filled = int(pct * BAR_W / 100)
        empty = BAR_W - filled

        if status == self.DONE:
            color = GREEN
        elif status == self.FAILED:
            color = RED
        elif status == self.ACTIVE:
            color = YELLOW
        else:
            color = DIM

        bar_fill = f"{color}{'█' * filled}{RESET}"
        bar_empty = f"{DIM}{'░' * empty}{RESET}"
        return f"{bar_fill}{bar_empty}"

    def render(self, force=False):
        """Render all step bars. Overwrites previous render in-place."""
        now = time.time()
        if self.is_windows and self.rendered and not force:
            if (now - self._last_render) < 0.25:
                return
        self._last_render = now

        if self.rendered:
            if self.is_windows:
                os.system("cls")
                if self.header_fn:
                    self.header_fn()
            else:
                sys.stdout.write(UP.format(self.total_lines))

        for i, s in enumerate(self.steps):
            icon = self.ICONS[s["status"]]
            num = f"[{i+1}/{len(self.steps)}]"

            if s["status"] == self.DONE and s["result"]:
                right = f"{DIM}{s['result']}{RESET}"
            elif s["status"] == self.ACTIVE and s["detail"]:
                right = f"{YELLOW}{s['detail']}{RESET}"
            elif s["status"] == self.FAILED and s["result"]:
                right = f"{RED}{s['result']}{RESET}"
            else:
                right = ""

            if s["status"] == self.PENDING:
                name_str = f"{DIM}{s['name']}{RESET}"
            elif s["status"] == self.ACTIVE:
                name_str = f"{BOLD}{s['name']}{RESET}"
            elif s["status"] == self.DONE:
                name_str = f"{GREEN}{s['name']}{RESET}"
            else:
                name_str = f"{RED}{s['name']}{RESET}"

            line1 = f"  {icon} {DIM}{num}{RESET} {name_str}  {right}"
            sys.stdout.write(f"\r{CLR}{line1}\n")

            bar = self._bar_str(s["pct"], s["status"])
            pct_str = f"{s['pct']:3d}%"
            line2 = f"    {bar}  {BOLD}{pct_str}{RESET}"
            sys.stdout.write(f"\r{CLR}{line2}\n")

        sys.stdout.flush()
        self.rendered = True

    def set_active(self, idx):
        self.steps[idx]["status"] = self.ACTIVE
        self.steps[idx]["pct"] = 0
        self.steps[idx]["detail"] = ""
        self.render()

    def set_progress(self, idx, pct, detail=""):
        self.steps[idx]["pct"] = min(100, max(0, int(pct)))
        if detail:
            self.steps[idx]["detail"] = detail
        self.render()

    def set_done(self, idx, result=""):
        self.steps[idx]["status"] = self.DONE
        self.steps[idx]["pct"] = 100
        self.steps[idx]["detail"] = ""
        self.steps[idx]["result"] = result
        self.render(force=True)

    def set_failed(self, idx, result=""):
        self.steps[idx]["status"] = self.FAILED
        self.steps[idx]["detail"] = ""
        self.steps[idx]["result"] = result
        self.render(force=True)

    def animate_to(self, idx, target_pct, duration=0.4, detail=""):
        start_pct = self.steps[idx]["pct"]
        steps = max(1, int(duration / 0.03))
        for i in range(1, steps + 1):
            pct = start_pct + (target_pct - start_pct) * i / steps
            self.set_progress(idx, int(pct), detail)
            time.sleep(duration / steps)


# ── Helpers ──────────────────────────────────────────────────

def _box_line(text, w, color=CYAN, text_fmt=""):
    """Build a single box line with correct padding."""
    visible_len = len(text)
    padding = w - visible_len
    return (f"  {color}\u2551{RESET}"
            f"  {text_fmt}{text}{RESET}"
            f"{' ' * padding}{color}\u2551{RESET}")


def header():
    """Print application header."""
    w = 50
    print()
    print(f"  {CYAN}\u2554{'═' * w}\u2557{RESET}")
    # Each line: 2 leading spaces + text + padding = w chars between ║...║
    print(_box_line("Masterarbeit Praesentation", w - 2, text_fmt=BOLD))
    print(_box_line("SOH Elektrofahrzeuge", w - 2, text_fmt=""))
    print(_box_line("Auto-Setup & Start", w - 2, text_fmt=DIM))
    print(f"  {CYAN}\u255a{'═' * w}\u255d{RESET}")
    os_name = platform.system()
    os_map = {"Darwin": "macOS", "Linux": "Linux", "Windows": "Windows"}
    py = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"  {DIM}OS: {os_map.get(os_name, os_name)} | Python: {py}{RESET}")
    print()


def fatal(display, idx, msg, lang="de"):
    """Mark step failed, show cursor, print error, exit."""
    m = MSG[lang]
    display.set_failed(idx, m["error"])
    sys.stdout.write(SHOW)
    print()
    print(f"  {RED}{BOLD}{m['error']}:{RESET} {msg}")
    print()
    if platform.system() == "Windows":
        input(f"  {m['press_enter']}")
    sys.exit(1)


def run(cmd, capture=True, env=None):
    """Run a command, return (returncode, stdout)."""
    merged = os.environ.copy()
    if env:
        merged.update(env)
    r = subprocess.run(cmd, capture_output=capture, text=True, env=merged)
    return r.returncode, r.stdout.strip() if capture else ""


def _get_node_cmd():
    """Return the node command name (node or node.exe)."""
    if platform.system() == "Windows":
        return "node.exe"
    return "node"


def _get_npm_cmd():
    """Return the npm command name."""
    if platform.system() == "Windows":
        return "npm.cmd"
    return "npm"


def _get_npx_cmd():
    """Return the npx command name."""
    if platform.system() == "Windows":
        return "npx.cmd"
    return "npx"


# ── Steps ────────────────────────────────────────────────────

def step_check_node(d, idx, lang):
    """Step 1: Verify Node.js version."""
    m = MSG[lang]
    d.set_active(idx)
    d.animate_to(idx, 50, 0.3, m["check_ver"])

    node = _get_node_cmd()
    rc, ver_out = run([node, "--version"])

    if rc != 0:
        fatal(d, idx, m["node_missing"], lang)

    # Parse version (e.g. "v20.11.0" → 20)
    ver_str = ver_out.strip().lstrip("v")
    try:
        major = int(ver_str.split(".")[0])
    except (ValueError, IndexError):
        major = 0

    if major < 18:
        fatal(d, idx, m["min_node"].format(ver=ver_str), lang)

    d.animate_to(idx, 100, 0.3, "OK")
    d.set_done(idx, f"Node.js v{ver_str}")


def step_dependencies(d, idx, lang):
    """Step 2: Install npm dependencies."""
    m = MSG[lang]
    d.set_active(idx)

    npm = _get_npm_cmd()
    node_modules = os.path.join(os.getcwd(), "node_modules")

    if not os.path.isfile("package.json"):
        fatal(d, idx, "package.json not found!", lang)

    # Check if node_modules exists and is up to date
    has_modules = os.path.isdir(node_modules)

    if has_modules:
        d.set_progress(idx, 20, m["checking"])

        # Quick check: compare package.json mtime vs node_modules mtime
        pkg_mtime = os.path.getmtime("package.json")
        mod_mtime = os.path.getmtime(node_modules)

        if mod_mtime >= pkg_mtime:
            # Count installed packages
            pkg_count = 0
            pkg_lock = os.path.join(os.getcwd(), "package-lock.json")
            if os.path.isfile(pkg_lock):
                try:
                    with open(pkg_lock) as f:
                        lock_data = json.load(f)
                    pkg_count = len(lock_data.get("packages", {}))
                except Exception:
                    pass

            d.animate_to(idx, 100, 0.4, m["up_to_date"])
            result = m["deps_exist"]
            if pkg_count > 0:
                result += f" ({pkg_count} {m['packages']})"
            d.set_done(idx, result)
            return

    d.set_progress(idx, 10, m["installing"])

    # Run npm install with live output parsing
    t0 = time.time()
    proc = subprocess.Popen(
        [npm, "install"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    for line in proc.stdout:
        line = line.strip()
        if not line:
            continue

        # Parse npm output for progress
        if "added" in line:
            d.set_progress(idx, 90, line[:50])
        elif "npm warn" not in line:
            d.set_progress(idx, min(80, d.steps[idx]["pct"] + 5), line[:40])

    proc.wait()
    elapsed = time.time() - t0

    if proc.returncode != 0:
        fatal(d, idx, m["install_failed"], lang)

    # Count installed packages
    pkg_count = 0
    pkg_lock = os.path.join(os.getcwd(), "package-lock.json")
    if os.path.isfile(pkg_lock):
        try:
            with open(pkg_lock) as f:
                lock_data = json.load(f)
            pkg_count = len(lock_data.get("packages", {}))
        except Exception:
            pass

    d.animate_to(idx, 100, 0.3)
    d.set_done(idx, f"{pkg_count} {m['packages']} ({elapsed:.1f}s)")


def step_launch(d, idx, lang):
    """Step 3: Find port, launch Vite dev server, open browser."""
    m = MSG[lang]
    d.set_active(idx)
    d.animate_to(idx, 30, 0.2, m["check_port"])

    npx = _get_npx_cmd()

    # Find free port (start at 3000)
    port = 3000
    try:
        import socket
        while port < 3010:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(("localhost", port)) != 0:
                    break
                port += 1
    except Exception:
        pass

    d.animate_to(idx, 70, 0.2, f"Port {port}")
    d.animate_to(idx, 100, 0.3, m["starting"])
    d.set_done(idx, f"Port {port}")

    sys.stdout.write(SHOW)

    url = f"http://localhost:{port}"

    def open_browser():
        time.sleep(2.5)
        webbrowser.open(url)

    threading.Thread(target=open_browser, daemon=True).start()

    # Final banner
    w = 50
    print()
    print(f"  {'═' * w}")
    print(f"  {GREEN}{BOLD}\u2713 {m['ready']}{RESET} — {m['browser_auto']}")
    print(f"  {BOLD}{url}{RESET}")
    print()
    print(f"  {m['to_exit']} {YELLOW}Ctrl+C{RESET}")
    print(f"  {'═' * w}")
    print()

    try:
        subprocess.run(
            [npx, "vite", "--port", str(port), "--open", "false"],
            stderr=subprocess.DEVNULL,
        )
    except KeyboardInterrupt:
        print()
        print(f"  {DIM}{m['app_closed']}{RESET}")
        print()


# ── Main ─────────────────────────────────────────────────────

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    os.system("cls" if platform.system() == "Windows" else "clear")

    print_logo()
    header()

    lang = "de"
    sys.stdout.write(HIDE)

    step_names = STEPS_DE

    def _header_reprint():
        print_logo()
        header()

    d = StepDisplay(step_names, header_fn=_header_reprint)
    d.render()

    steps = [
        step_check_node,
        step_dependencies,
        step_launch,
    ]

    try:
        for i, fn in enumerate(steps):
            fn(d, i, lang)
    except SystemExit:
        sys.stdout.write(SHOW)
        raise
    except Exception as e:
        m = MSG.get(lang, MSG["de"])
        sys.stdout.write(SHOW)
        print()
        print(f"  {RED}{BOLD}{m['unexpected']}{RESET} {e}")
        print()
        if platform.system() == "Windows":
            input(f"  {m['press_enter']}")
        sys.exit(1)


if __name__ == "__main__":
    main()
