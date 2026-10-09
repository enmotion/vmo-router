# Real browser verification — 2026-10-09

Application: Vite development example at http://127.0.0.1:1980/.
Execution: Playwright browser tools, real browser DOM and navigation (not happy-dom).

Verified:
- Menu navigation dynamically registers SampleA routes with separate names and URL parameters.
- SampleA1 retains input after switching away and back (KeepAlive enabled).
- SampleA2 resets input after switching away and back (KeepAlive disabled).
- history.back() and history.forward() restore the expected dynamic URL.
- Reload restores SampleA2 at /sample-a2/enmotion2/test and renders the expected enmotion2 prop. The global unload protection was disabled for this reload so the restoration check could complete without a native modal.
- SampleB input `mod` activates leave protection. Closing the Element Plus confirmation twice keeps the current URL; OK permits navigation.
- Reload after a user click triggers a native beforeunload dialog. Tool modal interception prevents asserting accepted/dismissed reload outcomes, so those outcomes and actual tab closing remain unverified.
- Console inspection reported zero runtime errors. One invalid-param warning came from the example's 404 navigation passing a `name` param to a path without that parameter; removed that unused param in SampleC/SampleE. Repeated SampleC → internal 404 navigation reached /test/404 with zero new console warnings/errors.

Browser-discovered fix:
The example transition's enter hook accepted `done` but never called it, leaving animation classes active. Its hidden measurement clone also retained duplicated input DOM. The enter timer now hides and clears the clone and calls `done`. Navigation/cache checks passed after this fix.

Scope limitations: one browser environment, development build. Cross-browser, production browser execution and tab-close behavior are not established by these checks.

Post-fix validation: 73 automated tests passed, all four use.lib coverage metrics remained 100%, production build passed. The transition regression checks consecutive replacements complete and release cloned input DOM.
