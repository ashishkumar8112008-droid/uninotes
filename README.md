# UniNotes Weekly Planner ✏️

A minimal, high-fidelity digital weekly planner web application inspired by Google Sheets templates and printable pastel stationery design. 

The application is built entirely using vanilla frontend technologies (HTML, CSS, JavaScript) without third-party frameworks, making it lightweight, fast, and extremely easy to deploy.

---

## 🎨 Design Philosophy & Aesthetic

Unlike generic futuristic dashboards, **UniNotes Weekly Planner** replicates a physical paper notebook planner layout:
- **Clean Off-White Base**: Stationaries styled on a warm desk background.
- **Thin Dark Outlines**: Structured with `rgb(72, 63, 95)` borders for a retro sketch appearance.
- **Harmonious Pastel Accents**: Hand-picked RGB pastel shades assigned to each weekday.
- **Notebook Paper Lines**: Styled text areas and checklist slots using repeating background gradients for a lined loose-leaf binder feel.
- **Serif Heading Typography**: Classy, print-ready *Lora* font paired with clean *Poppins* body text.
- **Zero Heavy Shadows/Glassmorphism**: Avoids modern gloss trends in favor of flat paper realism.

### Weekday Palette
* **Sunday** ➔ Light Blue (`rgb(213, 240, 242)`)
* **Monday** ➔ Peach (`rgb(255, 219, 205)`)
* **Tuesday** ➔ Light Orange (`rgb(255, 228, 186)`)
* **Wednesday** ➔ Light Green (`rgb(225, 236, 192)`)
* **Thursday** ➔ Light Pink (`rgb(255, 217, 232)`)
* **Friday** ➔ Light Yellow (`rgb(255, 239, 191)`)
* **Saturday** ➔ Light Purple (`rgb(230, 220, 245)`)

---

## ✨ Features

1. **Top Section Focus & Priorities**:
   - **Weekly Focus**: A lined notepad text box for typing affirmations, focus points, or weekly quotes.
   - **Weekly Priorities**: A five-point checkable checklist to write down primary weekly targets.

2. **Habit Tracker Grid**:
   - Track key habits (e.g. *Read 30 minutes*, *Sleep 8 hours*, etc.) daily (Monday to Sunday).
   - Add new custom habits dynamically with brand-coded checkbox accents.
   - View weekly progress percentages and progress bars updating in real-time.

3. **Daily Planner Cards**:
   - Mon-Sun cards displaying auto-calculated dates.
   - **Circular Progress Ring**: Shows completion percentages inside each card header.
   - **Task Checklist**: Add tasks, check off items, double-click text to inline-edit, or delete.
   - **8th Card Grid Balance**: A "Weekly Review" card for note-taking.

4. **Multi-Theme Support**:
   - **Classic Pastel**: Warm desk grey background with clear off-white sheets.
   - **Warm Cream**: Comforting cream base and pages.
   - **Pastel Dusk**: A soft dark mode that maintains muted pastel accents.

5. **Printable Page Optimization**:
   - Press **Print Planner** to open a print view with media queries formatting the sheet to fit A4 paper landscape/portrait.
   - Automatically hides UI controls, inputs, and delete buttons.

6. **Local Storage Synchronization**:
   - Saves all checklists, habits, priority notes, date picker selectors, and theme values locally. Data persists even after a page refresh.

---

## 🛠️ Technical Stack

- **Structure**: Semantic HTML5 markup.
- **Styling**: Vanilla CSS3 (Custom Variables, Flexbox, CSS Grid).
- **Icons**: Font Awesome (CDN) for social icons and inline SVGs.
- **Logic**: Vanilla ES6 JavaScript (State Management, DOM Event Delegation, LocalStorage API).

---

## 🚀 How to Run Locally

Since this project has no build tools or package manager requirements, you can run it directly:

### Option 1: File Browser
1. Clone this repository to your machine.
2. Double-click [index.html](file:///d:/100%20Project/uninotes/index.html) (or drag it into your browser) to run.

### Option 2: Live Server (Recommended for developers)
If you use VS Code:
1. Open the folder in VS Code.
2. Click **Go Live** at the bottom-right status bar (using the Live Server extension).
3. Access the planner at `http://127.0.0.1:5500/index.html`.

Alternatively, serve it via Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 👤 Credits & Links
- Designed and Developed by **Ashish Kumar**
- LinkedIn: [Ashish Kumar](https://www.linkedin.com/in/ashish-kumar-859842250)
- GitHub: [@ashishkumar8112008-droid](https://github.com/ashishkumar8112008-droid)
