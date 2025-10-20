<h1 align="center">🧩 Todo App — React + Vite + TypeScript</h1>

<p align="center">
<b>Internal Engineering Wiki Document</b><br/>
A modular, type-safe Todo management app built with <b>React</b>, <b>Vite</b>, <b>Tailwind CSS</b>, and <b>Radix UI</b>.<br/>
This guide is intended for new engineers joining the team and code reviewers maintaining the service.
</p>

---

<h2>📘 Overview</h2>

<p>
The <b>Todo App</b> is a lightweight frontend application demonstrating modern component architecture,
context-based state management, and local persistence using browser storage.
</p>

<p><b>Key Technologies:</b></p>
<ul>
  <li>React 18 + TypeScript (strict mode)</li>
  <li>Vite 6 for instant dev environment</li>
  <li>Tailwind CSS v4 (zero config)</li>
  <li>Radix UI primitives for accessibility</li>
  <li>Jest + React Testing Library for tests</li>
</ul>

---

<h2>🚀 Quick Start</h2>

<details>
<summary><b>🧰 Installation & Setup</b></summary>
<br/>

<pre><code>
npm install
</code></pre>

Start local dev server:

<pre><code>npm run dev
</code></pre>

</details>

<details>
<summary><b>🧪 Run Tests</b></summary>
<br/>
All unit and integration tests use Jest + React Testing Library.
<pre><code>npm run test
npm run test -- --coverage
</code></pre>
Test files follow the convention:
<pre><code>src/&lt;module&gt;/&lt;ComponentName&gt;.test.tsx</code></pre>
</details>

<details>
<summary><b>🧱 Build for Production</b></summary>
<br/>
<pre><code>npm run build
npm run preview
</code></pre>
The production build outputs static files under <code>dist/</code>.
</details>

---

<h2>🏗️ Architecture Overview</h2>

<pre><code>src/
├── components/
│   ├── layout/          → Header, Filters, Stats
│   ├── todo/            → TodoList, TodoItem, TodoForm
│   └── ui/              → Reusable Radix primitives
│
├── context/
│   └── TodoContext.tsx  → Global reducer & actions
│
├── hooks/
│   └── useLocalStorage.ts → Persistent state hook
│
├── lib/
│   └── filterUtils.ts     → Business logic (filters & stats)
│
├── types/
│   └── todo.ts            → Shared enums & interfaces
│
└── App.tsx                → Root component
</code></pre>

<p>
Data flow follows a unidirectional model:
</p>

<pre><code>UI → Context Dispatch(Action) → Reducer → State → UI Re-render</code></pre>

---

<h2>🧩 Data Model</h2>

<pre><code>export enum TodoState {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Todo {
  taskId: string;
  userId: string;
  description: string;
  dueDate: string;
  state: TodoState;
}
</code></pre>

All todos are persisted in <code>localStorage</code> under <code>todos</code>.

---

<h2>🎨 Design System</h2>

<details>
<summary><b>🌗 Theming</b></summary>
<ul>
  <li>Supports light and dark themes via <code>prefers-color-scheme</code>.</li>
  <li>All styles use Tailwind utility classes only — no CSS files.</li>
  <li>Theme context supports "light", "dark", and "system" modes.</li>
</ul>
</details>

<details>
<summary><b>📱 Responsive Layout</b></summary>
<ul>
  <li>Mobile-first grid system</li>
  <li>Adaptive layout for small, medium, and large screens</li>
</ul>
</details>

<details>
<summary><b>♿ Accessibility</b></summary>
<ul>
  <li>Keyboard navigable dialogs & menus (via Radix UI)</li>
  <li>ARIA-compliant form labels & roles</li>
  <li>Color contrast meets WCAG AA</li>
</ul>
</details>

---

<h2>🧪 Testing Strategy</h2>

<table>
  <thead>
    <tr><th>Test File</th><th>Purpose</th></tr>
  </thead>
  <tbody>
    <tr><td><code>filterUtils.test.ts</code></td><td>Tests filtering and statistics logic</td></tr>
    <tr><td><code>TodoForm.test.tsx</code></td><td>Validates form rendering and submission</td></tr>
  </tbody>
</table>

<p>Each PR must pass <code>npm run test</code> and achieve 90%+ coverage.</p>

---

<h2>🧭 Developer Workflow</h2>

<details>
<summary><b>🌿 Branch Naming</b></summary>
<ul>
  <li><code>feature/&lt;short-description&gt;</code> → new features</li>
  <li><code>fix/&lt;ticket-id&gt;</code> → bug fixes</li>
  <li><code>chore/&lt;task&gt;</code> → maintenance / tooling updates</li>
</ul>
</details>

<details>
<summary><b>🧾 Commit Message Convention</b></summary>
<p>We follow the <b>Conventional Commits</b> format:</p>

<pre><code>feat: add TodoForm validation
fix: correct date range filter logic
chore: update Jest configuration
refactor: simplify TodoContext reducer
</code></pre>
</details>

<details>
<summary><b>🔀 Pull Request Process</b></summary>
<ol>
  <li>Every PR must link to a Jira ticket or issue ID.</li>
  <li>Run <code>npm run lint && npm run test</code> before pushing.</li>
  <li>Ensure all tests pass and coverage ≥ 90%.</li>
  <li>Request review from at least one senior engineer.</li>
  <li>Use <code>squash and merge</code> with a clean commit title.</li>
</ol>
</details>

<details>
<summary><b>🛡️ Branch Protection Rules</b></summary>
<ul>
  <li>Main branch is protected (no direct commits).</li>
  <li>Require at least 1 code review approval.</li>
  <li>Require successful Jest & Lint workflows.</li>
  <li>Require branch to be up-to-date with main before merge.</li>
</ul>
</details>

---

<h2>💬 Code Review Template</h2>

<pre><code>### Summary
Briefly describe what this PR changes.

### Screenshots (if UI)
[Attach before/after screenshots]

### Tests
- [ ] Unit tests added or updated
- [ ] Coverage maintained

### Checklist
- [ ] Follows naming conventions
- [ ] TypeScript strict mode passes
- [ ] Lint passes (npm run lint)
- [ ] Includes descriptive commit message
</code></pre>

---

<h2>🧩 Common Issues & Fixes</h2>

<details>
<summary><b>🧩 “Cannot use JSX unless the '--jsx' flag is provided”</b></summary>
<p>Add the following to <code>tsconfig.json</code>:</p>
<pre><code>{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true
  }
}
</code></pre>
</details>

<details>
<summary><b>⚠️ Jest: "jest-environment-jsdom cannot be found"</b></summary>
<p>Install JSDOM test environment:</p>
<pre><code>npm install --save-dev jest-environment-jsdom
</code></pre>
</details>

<details>
<summary><b>📦 Tests fail due to Radix UI refs</b></summary>
<p>Ignore React ref warnings using:</p>
<pre><code>jest.spyOn(console, "error").mockImplementation(() => {});</code></pre>
</details>

---

<h2>🚀 Future Roadmap</h2>

<ul>
  <li>Replace <code>localStorage</code> with REST or GraphQL backend</li>
  <li>Add user authentication</li>
  <li>Support priority & tags</li>
  <li>Add drag-and-drop (React DnD)</li>
  <li>Implement CI/CD with GitHub Actions</li>
</ul>

---

<h2>🧑‍💻 Onboarding Checklist</h2>

<ol>
  <li>Clone repo and run <code>npm run dev</code></li>
  <li>Understand <code>TodoContext.tsx</code> for state flow</li>
  <li>Read <code>filterUtils.ts</code> for business logic</li>
  <li>Run <code>npm run test</code> and verify success</li>
  <li>Follow PR & commit conventions</li>
</ol>

---

<h2>📄 License</h2>

<p>MIT © 2025 <a href="https://github.com/yourname">Mia Yan</a></p>

<p align="center">
  <sub>Maintained by the Frontend Platform Team — built with ❤️ using React, Vite, and Tailwind CSS</sub>
</p>
