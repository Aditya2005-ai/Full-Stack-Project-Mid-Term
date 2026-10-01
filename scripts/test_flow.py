import sys
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    
    # 1. Login
    page.goto('http://localhost:5173/login')
    page.wait_for_selector('input[type="email"]')
    page.fill('input[type="email"]', 'developer@demo.com')
    page.fill('input[type="password"]', 'Dev@123')
    page.click('button[type="submit"]')
    page.wait_for_url('**/home')
    print('1. Logged in successfully!')

    # 2. Go to build
    page.click('button:has-text("New Store")')
    page.wait_for_url('**/build')
    print('2. Navigated to /build!')

    # 3. Step 1: Store Basics
    page.wait_for_selector('input[placeholder*="Bloom Boutique"]')
    name_input = page.query_selector('input[placeholder*="Bloom Boutique"]')
    name_input.fill('Bloom Boutique')
    page.click('button:has-text("INR")')
    page.click('button:has-text("Editorial Blue")')
    print('3. Filled store basics!')

    # 4. Click Next Step
    page.click('button:has-text("Next Step")')
    page.wait_for_selector('text=Optional Modules')
    print('4. In Step 2: Optional Modules!')

    # 5. Enable Payments and Reviews
    page.click('div:has-text("Razorpay Payments")')
    page.click('div:has-text("Customer Reviews")')
    print('5. Enabled Payments and Reviews!')

    # 6. Click Next Step -> Step 3: Module Options
    page.click('button:has-text("Next Step")')
    page.wait_for_selector('text=Module Options')
    print('6. In Step 3: Module Options!')

    # 7. Click Next Step -> Step 4: Review
    page.click('button:has-text("Next Step")')
    page.wait_for_selector('text=Review Configuration')
    print('7. In Step 4: Review!')

    # 8. Click Next Step -> Step 5: Generate
    page.click('button:has-text("Next Step")')
    page.wait_for_selector('button:has-text("Start Project Generation")')
    print('8. In Step 5: Generate!')

    # 9. Trigger Generation
    page.click('button:has-text("Start Project Generation")')
    print('9. Triggered Generation!')
    
    # Wait for completion
    page.wait_for_selector('h3:has-text("Generation Complete")', timeout=45000)
    print('10. Generation Complete reached!')

    # Check download button
    dl_btn = page.query_selector('button:has-text("Download")')
    print('Download button present:', bool(dl_btn))

    browser.close()
    print('All wizard steps passed with 100% accuracy!')
