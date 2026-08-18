# DECISIONS.md — FlowState Home Page

## 1. Why this approach over the obvious alternative?

I could have gone with React or Next.js — that's the obvious choice these days. But for a landing page with a few interactions, I felt it would be overkill. Setting up a build system, worrying about hydration, and dealing with Node modules felt like unnecessary complexity for what this page actually needs to do.

I went with plain HTML, CSS, and JavaScript instead. It's simpler, loads faster, and has no build step to break during deployment. If I deploy this to Netlify or Vercel, it just works — no `next build` failures or dependency conflicts.

For dark mode, I used CSS custom properties. I've used Tailwind's `dark:` prefix before, and there is always the risk of forgetting to add the class to one element. With CSS variables, the theme toggles consistently across the page.

I also wanted the code to be readable. If someone opens this during a code review, they can understand what is happening without jumping between multiple abstractions. That felt more honest for this challenge.

---

## 2. One trade-off I made

The biggest trade-off was using static data instead of connecting to a real backend.

Right now, the stats and dashboard tasks are hardcoded. The "12,000 tasks completed" and "3,400 freelancers" numbers don't update in real time. The dashboard tasks are also static — they are there to demonstrate the product experience.

I made this choice because the assignment is about the home page experience, not the backend. I wanted to spend the available time getting the animations smooth, dark mode complete, and responsive layout polished. Building a backend would have taken time away from those priorities.

With a full week, I'd connect this to Supabase or Firebase, add authentication so the dashboard shows real user data, and let users create and drag tasks around. For this challenge, I prioritized UI polish over backend features.

---

## 3. Where I used AI tools and what I verified

I used Claude/ChatGPT to help with the initial structure, CSS scaffolding, and the Konami code implementation. AI was useful for generating boilerplate quickly, but I did not treat the output as finished code.

- **Dark mode:** AI generated the basic theme variables, but I manually checked the hero, stats, dashboard cards, feature grid, footer, and toast notification to make sure everything switched correctly.
- **Stat animation:** AI suggested `setInterval` for the counter. I replaced it with `requestAnimationFrame` because it follows the browser's refresh cycle and produces smoother animation. I also added a `data-animated` flag so counters do not restart every time they enter the viewport.
- **Responsive:** I tested the page at 390px and 1440px in Chrome DevTools. The AI's breakpoints were generic, so I adjusted padding, font sizes, and button widths for smaller screens.
- **Konami code:** The AI did not handle input fields. I added a check so the easter egg does not trigger while someone is typing in a text field.
- **Semantic HTML:** I replaced unnecessary `<div>` usage with `<header>`, `<nav>`, `<section>`, `<dl>`, `<ul>`, and `<footer>` where appropriate.
- **Interactive dashboard:** The AI initially provided static tasks. I built the click-to-toggle completion behavior, updated the remaining-task count, and added a small scale animation for feedback.

---

## Bonus — Easter Egg

I added a Konami code easter egg — `↑ ↑ ↓ ↓ ← → ← → B A`. When entered, it displays a toast notification and triggers colorful confetti. I built the confetti system from scratch rather than using a library.

---

## What I'd improve with more time

1. Connect the dashboard to a real backend with live data.
2. Add authentication so users see their own tasks.
3. Let users create, edit, and drag tasks.
4. Add analytics to understand which parts of the page users engage with.
5. Do more thorough accessibility testing, including keyboard navigation and screen readers.
6. Test across more browsers, including Safari, Firefox, and Edge.

Overall, I kept the implementation simple and focused on making the core experience polished, responsive, and honest. I'm happy with the result.
