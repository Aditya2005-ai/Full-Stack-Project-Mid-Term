import os
import sys
import time
import math
import subprocess
from playwright.sync_api import sync_playwright

try:
  sys.stdout.reconfigure(encoding='utf-8')
  sys.stderr.reconfigure(encoding='utf-8')
except:
  pass

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO_DIR = os.path.join(WORKSPACE, 'tmp', 'demo_capture')
FINAL_VIDEO = os.path.join(WORKSPACE, 'autonomous_mern_builder_demo.mp4')

os.makedirs(VIDEO_DIR, exist_ok=True)

# Helper: Injects custom cursor and ripple
CURSOR_JS = """
(() => {
  if (document.getElementById('demo-cursor')) return;
  const style = document.createElement('style');
  style.innerHTML = `
    #demo-cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      z-index: 2147483647;
      pointer-events: none;
      transform: translate(-2px, -2px);
      transition: opacity 0.2s ease;
    }
    .demo-ripple {
      position: fixed;
      border-radius: 50%;
      background: rgba(17, 24, 39, 0.25);
      border: 1.5px solid rgba(17, 24, 39, 0.4);
      transform: translate(-50%, -50%) scale(0.2);
      animation: ripple-anim 0.45s ease-out forwards;
      pointer-events: none;
      z-index: 2147483646;
    }
    @keyframes ripple-anim {
      0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.2); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
    }
    #demo-caption-bar {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(17, 24, 39, 0.92);
      backdrop-filter: blur(12px);
      color: #ffffff;
      padding: 10px 26px;
      border-radius: 9999px;
      font-size: 13.5px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15);
      z-index: 2147483640;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    #demo-caption-bar.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);

  const cursor = document.createElement('div');
  cursor.id = 'demo-cursor';
  cursor.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z" fill="#0f172a" stroke="#ffffff" stroke-width="1.8"/>
  </svg>`;
  document.body.appendChild(cursor);

  const cap = document.createElement('div');
  cap.id = 'demo-caption-bar';
  cap.innerHTML = `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#22c55e;"></span><span id="demo-cap-text"></span>`;
  document.body.appendChild(cap);

  window.__updateCursor = (x, y) => {
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  };
  window.__clickRipple = (x, y) => {
    const rip = document.createElement('div');
    rip.className = 'demo-ripple';
    rip.style.left = `${x}px`;
    rip.style.top = `${y}px`;
    rip.style.width = '32px';
    rip.style.height = '32px';
    document.body.appendChild(rip);
    setTimeout(() => rip.remove(), 500);
  };
  window.__setCaption = (text) => {
    const el = document.getElementById('demo-caption-bar');
    const txt = document.getElementById('demo-cap-text');
    if (!text) {
      el.classList.remove('visible');
    } else {
      txt.textContent = text;
      el.classList.add('visible');
    }
  };
})();
"""

curr_x = 960
curr_y = 540

def setup_page(page):
  page.evaluate(CURSOR_JS)
  page.evaluate(f"window.__updateCursor({curr_x}, {curr_y})")

def set_caption(page, text):
  try:
    page.evaluate(f"window.__setCaption({repr(text)})")
  except:
    pass

def smooth_move(page, target_x, target_y, duration=0.6, steps=30):
  global curr_x, curr_y
  start_x, start_y = curr_x, curr_y
  sleep_step = duration / steps
  for i in range(1, steps + 1):
    t = i / steps
    # Ease in-out cubic
    ease = 0.5 * (1 - math.cos(math.pi * t))
    x = int(start_x + (target_x - start_x) * ease)
    y = int(start_y + (target_y - start_y) * ease)
    try:
      page.evaluate(f"window.__updateCursor({x}, {y})")
    except:
      pass
    curr_x, curr_y = x, y
    time.sleep(sleep_step)

def click_coords(page, x, y, duration=0.5):
  smooth_move(page, x, y, duration=duration)
  time.sleep(0.08)
  try:
    page.evaluate(f"window.__clickRipple({x}, {y})")
  except:
    pass
  page.mouse.click(x, y)
  time.sleep(0.15)

def click_selector(page, selector, duration=0.5, timeout=5000):
  el = page.wait_for_selector(selector, timeout=timeout)
  box = el.bounding_box()
  if box:
    target_x = int(box['x'] + box['width'] / 2)
    target_y = int(box['y'] + box['height'] / 2)
    click_coords(page, target_x, target_y, duration=duration)
  else:
    el.click()

def hover_selector(page, selector, duration=0.5):
  el = page.query_selector(selector)
  if el:
    box = el.bounding_box()
    if box:
      target_x = int(box['x'] + box['width'] / 2)
      target_y = int(box['y'] + box['height'] / 2)
      smooth_move(page, target_x, target_y, duration=duration)
      time.sleep(0.1)

def record_full_demo():
  print("🚀 Starting Professional Demo Recording via Playwright...")
  
  with sync_playwright() as p:
    browser = p.chromium.launch(
      headless=True,
      args=['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
    )
    context = browser.new_context(
      viewport={'width': 1920, 'height': 1080},
      record_video_dir=VIDEO_DIR,
      record_video_size={'width': 1920, 'height': 1080}
    )
    page = context.new_page()

    # ====================================================
    # SCENE 1 — INTRO (0:00 - 0:08)
    # ====================================================
    print("🎬 Scene 1: Intro Landing Screen...")
    page.goto('http://localhost:5173/login')
    page.wait_for_selector('input[type="email"]')
    setup_page(page)

    # Inject Elegant SaaS Title Overlay
    page.evaluate("""
    (() => {
      const intro = document.createElement('div');
      intro.id = 'demo-intro-overlay';
      intro.style = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle at 50% 35%, #1e293b 0%, #0f172a 100%);
        z-index: 2147483645;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        transition: opacity 0.8s ease;
      `;
      intro.innerHTML = `
        <div style="background: #ffffff; color: #0f172a; width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin-bottom: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">M</div>
        <h1 style="font-size: 40px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 10px 0;">Autonomous MERN Builder</h1>
        <p style="font-size: 15px; color: #94a3b8; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin: 0;">Configure &bull; Generate &bull; Validate &bull; Download</p>
      `;
      document.body.appendChild(intro);
    })();
    """)
    smooth_move(page, 960, 580, duration=0.8)
    time.sleep(3.2)

    # Fade out intro overlay to reveal login
    page.evaluate("document.getElementById('demo-intro-overlay').style.opacity = '0';")
    time.sleep(0.9)
    page.evaluate("const el = document.getElementById('demo-intro-overlay'); if (el) el.remove();")

    # ====================================================
    # SCENE 2 — LOGIN (0:08 - 0:18)
    # ====================================================
    print("🎬 Scene 2: Authentication...")
    set_caption(page, "Secure user authentication")
    time.sleep(0.8)

    # Smooth cursor to email, click
    click_selector(page, 'input[type="email"]', duration=0.6)
    time.sleep(0.4)

    # Smooth cursor to password, click
    click_selector(page, 'input[type="password"]', duration=0.5)
    time.sleep(0.4)

    # Smooth cursor to Sign In button
    click_selector(page, 'button[type="submit"]', duration=0.6)
    
    # Wait for navigation to /home
    page.wait_for_url('**/home', timeout=6000)
    setup_page(page)
    time.sleep(1.2)

    # ====================================================
    # SCENE 3 — WORKSPACE (0:18 - 0:28)
    # ====================================================
    print("🎬 Scene 3: Workspace Navigation...")
    set_caption(page, "Create a new MERN application")
    time.sleep(0.8)

    # Hover across sidebar
    hover_selector(page, 'a[href="/home"]', duration=0.4)
    time.sleep(0.4)
    hover_selector(page, 'a[href="/builds"]', duration=0.4)
    time.sleep(0.4)
    hover_selector(page, 'a[href="/settings"]', duration=0.4)
    time.sleep(0.4)

    # Move to New Store / New Build button and click
    new_btn = page.query_selector('button:has-text("New Store")') or page.query_selector('button:has-text("New Build")') or page.query_selector('a[href="/build"]')
    if new_btn:
      box = new_btn.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.6)
    else:
      page.goto('http://localhost:5173/build')
    
    page.wait_for_url('**/build', timeout=6000)
    setup_page(page)
    time.sleep(1.0)

    # ====================================================
    # SCENE 4 — PROJECT CONFIGURATION (0:28 - 0:48)
    # ====================================================
    print("🎬 Scene 4: Project Configuration...")
    set_caption(page, "Configure store identity and branding")
    time.sleep(0.8)

    # Target Store Name input
    name_input = page.query_selector('input[type="text"]')
    if name_input:
      box = name_input.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      # Retype with realistic cadence
      name_input.fill('')
      for char in "Bloom Boutique":
        name_input.type(char, delay=40)
      time.sleep(0.5)

    # Currency selection (INR)
    select_el = page.query_selector('select')
    if select_el:
      box = select_el.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      select_el.select_option('INR')
      time.sleep(0.6)

    # Color Theme selection (hover and select Notion Minimal / Blue)
    theme_buttons = page.query_selector_all('button[title], button[style*="background"]')
    if len(theme_buttons) >= 2:
      box = theme_buttons[1].bounding_box()
      if box:
        click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      time.sleep(0.5)

    # Click Next Step -> Step 2
    click_selector(page, 'button:has-text("Next Step")', duration=0.6)
    time.sleep(1.2)

    # ====================================================
    # SCENE 5 — MODULE SELECTION (0:48 - 1:04)
    # ====================================================
    print("🎬 Scene 5: Module Selection...")
    set_caption(page, "Configure only the modules you need")
    time.sleep(0.8)

    # Highlight Core Modules banner
    core_banner = page.query_selector('.border-border')
    if core_banner:
      box = core_banner.bounding_box()
      if box:
        smooth_move(page, int(box['x'] + box['width']/2), int(box['y'] + 20), duration=0.5)
        time.sleep(0.6)

    # Enable Payments module
    pay_card = page.query_selector('div:has-text("Razorpay Payments")') or page.query_selector('button:has-text("Payments")')
    if pay_card:
      box = pay_card.bounding_box()
      if box:
        click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
        time.sleep(0.4)

    # Enable Reviews module
    rev_card = page.query_selector('div:has-text("Customer Reviews")') or page.query_selector('button:has-text("Reviews")')
    if rev_card:
      box = rev_card.bounding_box()
      if box:
        click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
        time.sleep(0.4)

    # Click Next Step -> Step 3: Module Options
    click_selector(page, 'button:has-text("Next Step")', duration=0.5)
    time.sleep(1.0)

    # Show categories & options
    cat_container = page.query_selector('div:has-text("Product Categories")')
    if cat_container:
      box = cat_container.bounding_box()
      if box:
        smooth_move(page, int(box['x'] + 150), int(box['y'] + 60), duration=0.4)
        time.sleep(0.8)

    # Click Next Step -> Step 4: Review
    click_selector(page, 'button:has-text("Next Step")', duration=0.5)
    time.sleep(1.2)

    # ====================================================
    # SCENE 6 — REVIEW (1:04 - 1:16)
    # ====================================================
    print("🎬 Scene 6: Review & Architecture Verification...")
    set_caption(page, "Review configuration before generation")
    time.sleep(1.0)

    # Smooth cursor over Resolved Module Map & File Tree
    tree_box = page.query_selector('div:has-text("Live Generated Project Structure")') or page.query_selector('.font-mono')
    if tree_box:
      box = tree_box.bounding_box()
      if box:
        smooth_move(page, int(box['x'] + 120), int(box['y'] + 80), duration=0.6)
        time.sleep(1.5)

    # Click Next Step -> Step 5: Generate
    click_selector(page, 'button:has-text("Next Step")', duration=0.6)
    time.sleep(1.2)

    # ====================================================
    # SCENE 7 — GENERATE PROJECT (1:16 - 1:36)
    # ====================================================
    print("🎬 Scene 7: Asynchronous Generation Pipeline...")
    set_caption(page, "Automatically generating and validating the MERN project")
    time.sleep(0.8)

    # Move to Start Project Generation button and click
    gen_btn = page.wait_for_selector('button:has-text("Start Project Generation")', timeout=5000)
    box = gen_btn.bounding_box()
    click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.6)

    # Observe live progress steps
    print("  Observing live generation pipeline steps...")
    t_gen_start = time.time()
    while time.time() - t_gen_start < 30:
      done_el = page.query_selector('h3:has-text("Generation Complete")')
      if done_el:
        break
      # Keep mouse gently oscillating or stationary near center
      time.sleep(0.8)

    time.sleep(1.5)

    # ====================================================
    # SCENE 8 — DOWNLOAD (1:36 - 1:46)
    # ====================================================
    print("🎬 Scene 8: Download Validated Project Archive...")
    set_caption(page, "Download the complete project")
    time.sleep(0.8)

    # Click Download bloom-boutique.zip button
    dl_btn = page.wait_for_selector('button:has-text("Download")', timeout=5000)
    box = dl_btn.bounding_box()
    click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.6)
    time.sleep(1.2)

    # Click Copy Setup Commands
    copy_btn = page.query_selector('button:has-text("Copy")')
    if copy_btn:
      box = copy_btn.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      time.sleep(1.2)

    # ====================================================
    # SCENE 9 — GENERATED PROJECT STRUCTURE (1:46 - 1:58)
    # ====================================================
    print("🎬 Scene 9: Generated Codebase Inspection...")
    page.goto('http://localhost:5173/vscode-preview.html')
    setup_page(page)
    set_caption(page, "Complete MERN project structure")
    time.sleep(1.0)

    # Smooth cursor across explorer tree
    smooth_move(page, 180, 240, duration=0.6)
    time.sleep(0.6)
    smooth_move(page, 180, 360, duration=0.6)
    time.sleep(0.6)
    smooth_move(page, 520, 280, duration=0.6)
    time.sleep(1.8)

    # ====================================================
    # SCENE 10 — FINAL RUNNING APPLICATION (1:58 - 2:10)
    # ====================================================
    print("🎬 Scene 10: Running Generated Application...")
    page.goto('http://localhost:5174/products')
    setup_page(page)
    set_caption(page, "From configuration to a working MERN application")
    time.sleep(1.2)

    # Filter categories: Click Electronics then Clothing
    cat_btn = page.query_selector('button:has-text("Electronics")')
    if cat_btn:
      box = cat_btn.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      time.sleep(0.8)

    cloth_btn = page.query_selector('button:has-text("Clothing")')
    if cloth_btn:
      box = cloth_btn.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      time.sleep(0.8)

    # Add to Cart on first product
    add_btn = page.query_selector('button:has-text("Add to Cart")')
    if add_btn:
      box = add_btn.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      time.sleep(1.0)

    # Click Cart in navbar
    cart_link = page.query_selector('a[href="/cart"]') or page.query_selector('button:has-text("Cart")')
    if cart_link:
      box = cart_link.bounding_box()
      click_coords(page, int(box['x'] + box['width']/2), int(box['y'] + box['height']/2), duration=0.5)
      time.sleep(1.5)

    # ====================================================
    # FINAL CLOSING CARD (2:06 - 2:10)
    # ====================================================
    print("🎬 Final Closing Card...")
    set_caption(page, None)
    page.evaluate("""
    (() => {
      const outro = document.createElement('div');
      outro.id = 'demo-outro-overlay';
      outro.style = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 100%);
        z-index: 2147483645;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        opacity: 0;
        transition: opacity 0.7s ease;
      `;
      outro.innerHTML = `
        <div style="background: #ffffff; color: #0f172a; width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">M</div>
        <p style="font-size: 14px; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px 0;">Production-Ready Code Generation</p>
        <h1 style="font-size: 36px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px 0; text-align: center;">From configuration to a working MERN application</h1>
        <div style="display: flex; align-items: center; gap: 14px; color: #cbd5e1; font-size: 13.5px; font-family: monospace; background: rgba(255,255,255,0.06); padding: 8px 24px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.12); margin-bottom: 22px;">
          <span>Configure</span> <span>→</span> <span>Generate</span> <span>→</span> <span>Validate</span> <span>→</span> <span>Download</span> <span>→</span> <span>Run</span>
        </div>
        <p style="font-size: 19px; font-weight: 700; color: #ffffff; margin: 0;">Autonomous MERN Builder</p>
      `;
      document.body.appendChild(outro);
      setTimeout(() => outro.style.opacity = '1', 50);
    })();
    """)
    time.sleep(4.5)

    print("✅ Recording completed! Closing browser context...")
    context.close()
    browser.close()

  # Identify captured webm file
  recorded_files = [os.path.join(VIDEO_DIR, f) for f in os.listdir(VIDEO_DIR) if f.endswith('.webm')]
  if not recorded_files:
    raise RuntimeError("No recorded webm video found in " + VIDEO_DIR)
  
  latest_webm = max(recorded_files, key=os.path.getmtime)
  print(f"Captured RAW WebM: {latest_webm}")

  # Convert to high-quality MP4 using ffmpeg
  print(f"🎬 Transcoding to 1080p 60fps MP4: {FINAL_VIDEO}...")
  cmd = [
    'ffmpeg.exe', '-y',
    '-i', latest_webm,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-r', '60',
    FINAL_VIDEO
  ]
  subprocess.run(cmd, check=True)
  print(f"🎉 Final Demo Video successfully created at: {FINAL_VIDEO}")

if __name__ == '__main__':
  record_full_demo()
