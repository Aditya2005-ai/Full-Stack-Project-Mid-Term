import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('tmp/demo_record', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        record_video_dir='tmp/demo_record',
        record_video_size={'width': 1920, 'height': 1080}
    )
    page = context.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_selector('h1')
    print('Page title:', page.title())
    context.close()
    browser.close()
print('Recorded test.')
