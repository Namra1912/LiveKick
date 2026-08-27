# LiveKick play-book: Workspace Custom Rules & Instructions

## 🎨 1. THE "NIGHT-PITCH" DESIGN SYSTEM (Strict Visual Tokens)
Any implementation of LiveKick or premium dashboards must strictly follow these tailored color tokens, textures, and dimensions to avoid generic AI-look:

### A. Colors & Gradients
*   **Base Background:** `#080c11` (Dark stadium navy/slate).
*   **Main Page Wrapper:** `#0d1520` (Deep stadium surface).
*   **Surface Containers:** `#0d1520` (Standard cards, tabs, fields).
*   **Raised Surface:** `#111820` (Hovered cards, active segments).
*   **Hairlines & Borders:** `#1e2a35` (Fine 1px grids).
*   **Primary Text:** `#f1f5f9` (Bone white for high readability).
*   **Muted Text:** `#94a3b8` (Secondary text gray).
*   **Faint Text:** `#475569` (Darker structural gray).
*   **Accent Color (Pitch Green):** `#00B370` (Signature pitch green primary accent).
*   **Accent Secondary (Gold):** `#f59e0b` (Gold semantic accent for favorites, coins, MOTD).
*   **Accent Red (Live/Loss):** `#f87171` (Warning red / live status dot).
*   **Banned Colors:** Pure `#000` (except score cell background), pure white text, typical AI-purple gradients, default slate/blue gray colors.

### B. Ambient Stadium Glows
*   **Signature Glows:** Use radial gradients to simulate stadium floodlights hitting the pitch:
    ```css
    /* Restrained glowing background orbs */
    background: radial-gradient(circle, rgba(245,185,66,0.16) 0%, rgba(245,185,66,0) 70%);
    background: radial-gradient(circle, rgba(79,174,122,0.10) 0%, rgba(79,174,122,0) 70%);
    ```
*   **Restraint:** Keep these glows on the parent containers (`main` / `phone-wrapper`). Never put them on every single card.

---

## 2. TYPOGRAPHY & SCALING
*   **Display Headings & Scores:** Use `'Big Shoulders Display', sans-serif` for match score numbers, team names on hero elements, large wallet metrics, and titles. Ensure it is uppercase and styled with tight tracking (`tracking-tight` or `tracking-[-0.02em]`).
*   **Body & Descriptions:** Use `'Inter', sans-serif` with standard tracking and line height `1.5` for news descriptions, match details, and regular labels.
*   **Timers, Scores, Stats & Numbers:** Use `'JetBrains Mono', monospace` for all live minutes, timestamps, odds metrics, position numbers, and database indicators.
*   **Emphasis:** To emphasize words, use italics of the same font family. Do not mix families inside a single string.

---

## 3. UI COMPONENTS & MICRO-INTERACTIONS

### A. The Retro Scoreboard Digit
*   Match score numbers must be built using distinct scoreboard cells:
    ```html
    <div class="scoreboard">
      <div class="digit">2</div>
      <span class="colon">–</span>
      <div class="digit dim">1</div>
    </div>
    ```
*   **Styling:** A digit box has a completely black background (`#000`), glowing accent text color (`#f5b942`), 4px corner radius, inner glow shadow (`inset 0 0 6px rgba(245,185,66,0.25)`), and border (`1px solid #2a2210`). Completed matches dim the digits (`digit dim`).

### B. Double-Bezel Card Structure
*   All project cards, match lists, and transfer cards must use nested beveling to give physical depth:
    - **Outer Rim:** `border border-[#233129] rounded-[14px] bg-[#131f1a]`
    - **Favorite Indicator:** A favorite card gets a thick left border (`border-l-[3px] border-l-[#4fae7a]`).

### C. Segmented Controls & Interactive Options
*   **Pills & Segments:** Segmented controls have a dark base (`bg-[#131f1a]`), border (`border-[#233129]`), and custom border-radius (`10px`).
*   **Tactile Active State:** Active buttons toggle background to `#182720` and text to `#f4f1ea`. Buttons scale down on click (`active:scale-[0.98]`) to simulate physical buttons.
*   **Predictor Options:** The predictor buttons toggle border to accent color `#f5b942` and background to translucent amber glow `rgba(245,185,66,0.08)` when selected.

---

## 🎓 4. ARCHITECTURAL & TECHNICAL BLUEPRINT

### A. Atomic Wallet & Predictor Settlement
*   **The Race Condition Risk:** When settling multiple match predictions, reading a user's wallet balance, computing the payout, and updating the balance can lead to duplicate transactions or lost updates.
*   **Hard Rule:** ALWAYS perform updates atomically in MongoDB using operator increments:
    ```js
    await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { walletBalance: payoutAmount, totalPredictions: 1 } },
      { new: true, session }
    );
    ```

### B. Rate-Limit & Caching Pipeline
*   **Rate Limits:** Free external football APIs only allow ~10 requests/minute. Directly fetching from client side will crash.
*   **Hard Rule:** Decouple all data fetching from client interaction. Set up a central Express server acting as the single source of truth caching match feeds, league tables, and transfer records to MongoDB.
*   **Cron Jobs:** Use `node-cron` to execute updates:
    - Match syncs every 60–90 seconds.
    - Transfer syncs run 1–2 times daily.
*   **Client Response:** Always return cached data with a `lastSynced` tag so the client can display "last synced 41s ago".

### C. Auth & Protection Flow
*   **JWT Storage:** Save access tokens in state/memory, and refresh tokens exclusively inside HTTP-Only secure cookies. Never expose token keys to LocalStorage or client-accessible scripts.
*   **Refreshing:** Include automatic interceptors on Axios client to trigger `/api/auth/refresh` on expired tokens seamlessly.

---

## 🚀 5. LINT & QUALITY CHECKLIST
*   [ ] No basic gray/white background, slate buttons, or generic Lucide icons.
*   [ ] Emojis are replaced by clean SVG icon tags or custom vector icons.
*   [ ] Live scoreboard components use the custom retro digits box.
*   [ ] Form labels sit strictly above the input fields with standard spacing.
*   [ ] Screen/tab transitions leverage Framer Motion or clean CSS keyframe fade-in transitions.
*   [ ] No fake screenshot mock layouts or empty grid dividers.

---

## 📚 6. USER'S REACT LEARNING STATUS (Persistent Reference)

**Last updated: Aug 1, 2026**

### Completed ✅
- 12 hands-on React projects (01 through 12-AssemblyEndgame)
- Full fundamentals: JSX, components, props, `useState`, `useEffect`, forms, `fetch` API, `localStorage`, conditional rendering, mapping arrays, lifting state
- HuXn WebDev Part 1 (~15 hrs watched): all fundamentals + events + styling

### Remaining Before Starting LiveKick (~1h 32m) ⏳
Watch these two blocks — nothing else needed before building:

**Block 1 — Missing Hooks (~47 mins) from [https://youtu.be/qnwFpjIqsrA](https://youtu.be/qnwFpjIqsrA):**
- `useContext` → [3:17:16](https://youtu.be/qnwFpjIqsrA?t=3h17m16s) (~10 min)
- `useReducer` → [3:27:02](https://youtu.be/qnwFpjIqsrA?t=3h27m02s) (~16 min)
- `useRef` → [3:43:40](https://youtu.be/qnwFpjIqsrA?t=3h43m40s) (~8 min)
- Custom Hooks → [3:51:59](https://youtu.be/qnwFpjIqsrA?t=3h51m59s) (~13 min)

**Block 2 — React Router (~45 mins):**
- Web Dev Simplified React Router v6: [https://www.youtube.com/watch?v=Ul3y1LXxzdU](https://www.youtube.com/watch?v=Ul3y1LXxzdU)
- Topics: `BrowserRouter`, `Routes`, `Route`, `useParams`, `<Outlet>`, `useNavigate`, `<NavLink>`

### Rule for answering study/learning questions
When this user asks what to learn or study next for React / LiveKick:
- Do NOT suggest more pre-study beyond the two blocks above
- After those 1h 32m, they are 100% ready to build LiveKick frontend with mock data
- Concepts like Protected Routes, Socket.io, useMemo, Framer Motion are learned WHILE BUILDING — not before
- LiveKick build order: Navbar+Sidebar shell → Home Feed → Match Detail → Standings → Transfers → Predictions → Tactics Lab → Login/Signup

---

## 📌 7. GIT COMMIT STRATEGY & PACING (Strict Workflow)
To maintain a high-quality, authentic developer git history (targeting ~200-270 commits at full project completion):
- **No artificial/trivial micro-commits**: Never commit 1-line typos or junk spam.
- **Clean feature scoping**: Break each prompt or page feature into 2 to 4 clean, logical, Conventional Commit messages (e.g., `feat(auth): ...`, `style(nav): ...`, `fix(scroll): ...`, `docs(...): ...`).
- **Atomic modularity**: Keep components, hooks, styling, and route wiring in focused, well-described commits so the GitHub history reads like a senior engineer's production repository.
