# Motivation Hub 🔥

A premium-style motivational website built with plain HTML, CSS, and JavaScript. It is designed to be easy to customize, mobile-friendly, and ready for GitHub Pages.

Features included:
- Dark luxury theme with gold accents
- Daily motivational quotes with copy button
- AI-style motivation video section
- Downloadable wallpaper pack
- Daily discipline challenge tracker
- Play/pause motivational music demo
- User sign-up, login, and profile pages
- AI motivation chatbot demo
- Leaderboard, points, and streak tracking
- Membership and donation sections
- Ad spaces clearly labeled
- LocalStorage-based progress and demo preferences

Project structure:
- `index.html` — homepage
- `pricing.html` — premium pricing and donations
- `signup.html` — sign-up page
- `login.html` — login page
- `profile.html` — profile page
- `style.css` — all styling
- `script.js` — interactivity and local storage logic
- `assets/wallpapers/` — downloadable wallpaper SVG files

How to run locally:
1. Open the project folder in your code editor.
2. Open `index.html` in a browser, or run a lightweight local server from the project folder:
   ```bash
   python3 -m http.server 8000
   ```
3. Then visit:
   ```text
   http://localhost:8000
   ```

Deploy to GitHub Pages for free:
1. Push this project to a GitHub repository.
2. In your repository, go to Settings → Pages.
3. Under "Build and deployment", choose:
   - Source: Deploy from a branch
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
4. Save the settings.
5. GitHub will give you a public URL like:
   ```text
   https://yourusername.github.io/motivation-hub/
   ```

Notes:
- This demo uses local browser storage instead of real payment or AI APIs.
- Buttons are interactive but not connected to live backend services.
- You can replace the demo content with real branding, real AI tools, or a real backend later.

Customization ideas:
- Replace the quote list in `script.js`
- Add your own branding/logo in the navigation
- Add real music files, a backend database, or Stripe integration when ready
- Expand the challenge system or leaderboard data

This project is intentionally beginner-friendly and ready to grow into a real motivational brand.
