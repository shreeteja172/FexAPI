<script setup>
import { useData } from "vitepress";
const { isDark } = useData();
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        <span>Open Source CLI Tool</span>
      </div>
      <h1 class="hero-title">
        Mock APIs for<br />
        <span class="hero-accent">frontend developers.</span>
      </h1>
      <p class="hero-description">
        Define your endpoints in a schema file. Run one command.<br />
        Get a local server with realistic fake data — powered by Faker.js.
      </p>
      <div class="hero-actions">
        <a href="/getting-started/introduction" class="btn-primary">
          Get Started
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <div class="install-cmd" @click="copyInstall">
          <code>npx fexapi init</code>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </div>
      </div>
      <div class="hero-terminal">
        <div class="terminal-bar">
          <div class="terminal-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="terminal-title">terminal</span>
          <div style="width: 52px"></div>
        </div>
        <div class="terminal-body">
          <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-cmd">npx fexapi init</span>
          </div>
          <div class="terminal-line terminal-output">
            <span>What port? (default: 3000)</span>
            <span class="terminal-dim">4000</span>
          </div>
          <div class="terminal-line terminal-output">
            <span>? Enable CORS?</span>
            <span class="terminal-highlight">Yes</span>
          </div>
          <div class="terminal-line terminal-output">
            <span>? Generate sample schemas?</span>
            <span class="terminal-highlight">Yes</span>
          </div>
          <div class="terminal-line terminal-output terminal-gap"></div>
          <div class="terminal-line terminal-output">
            <span class="terminal-success">✓</span>
            <span>Created fexapi/schema.fexapi</span>
          </div>
          <div class="terminal-line terminal-output">
            <span class="terminal-success">✓</span>
            <span>Created fexapi/schemas/user.yaml</span>
          </div>
          <div class="terminal-line terminal-output terminal-gap"></div>
          <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-cmd">npx fexapi dev --watch</span>
          </div>
          <div class="terminal-line terminal-output">
            <span>Mock API running at</span>
            <span class="terminal-link">http://localhost:4000</span>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h3>Zero Config</h3>
          <p>
            One command to scaffold. One command to serve. No Express, no
            database, no boilerplate.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
              />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h3>Schema-Driven</h3>
          <p>
            Define endpoints in a readable <code>.fexapi</code> schema file or
            YAML. Generates data from your definitions.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3>Faker.js Built-in</h3>
          <p>
            Realistic names, emails, UUIDs, dates. Use any Faker.js method path
            in your custom schemas.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h3>Watch Mode</h3>
          <p>
            Edit your schema, see changes instantly. The dev server auto-reloads
            when files change.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          <h3>CORS Ready</h3>
          <p>
            Single config flag enables CORS headers. Works with React, Vue,
            Angular — any frontend.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h3>REST Endpoints</h3>
          <p>
            GET, POST, PUT, DELETE. Define any HTTP method with typed fields and
            get structured JSON back.
          </p>
        </div>
      </div>
    </section>

    <section class="workflow">
      <h2 class="section-title">How it works</h2>
      <p class="section-subtitle">
        Four steps from zero to a working mock API.
      </p>
      <div class="workflow-steps">
        <div class="workflow-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Initialize</h4>
            <code>npx fexapi init</code>
            <p>Scaffolds config files and a schema template.</p>
          </div>
        </div>
        <div class="workflow-connector"></div>
        <div class="workflow-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Define</h4>
            <code>schema.fexapi</code>
            <p>Write your endpoints and field types.</p>
          </div>
        </div>
        <div class="workflow-connector"></div>
        <div class="workflow-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Generate</h4>
            <code>npx fexapi generate</code>
            <p>Compiles your schema into an API spec.</p>
          </div>
        </div>
        <div class="workflow-connector"></div>
        <div class="workflow-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h4>Serve</h4>
            <code>npx fexapi dev --watch</code>
            <p>Starts the server with hot reload.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="cta-content">
        <h2>Ready to start?</h2>
        <p>Get a mock API running in under 2 minutes.</p>
        <div class="cta-actions">
          <a href="/getting-started/quick-start" class="btn-primary">
            Quick Start Guide
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="https://github.com/shreeteja172/fexapi"
            class="btn-secondary"
            target="_blank"
          >
            GitHub
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <p>
        Released under the MIT License. Built by
        <a href="https://github.com/shreeteja172" target="_blank"
          >Shreeteja Mutukundu</a
        >.
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  methods: {
    async copyInstall() {
      try {
        await navigator.clipboard.writeText("npx fexapi init");
      } catch {}
    },
  },
};
</script>

<style scoped>
.home-container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  padding: 80px 0 64px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-bottom: 32px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.hero-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
}

.hero-accent {
  color: var(--vp-c-brand-1);
}

.hero-description {
  font-size: 17px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  max-width: 540px;
  margin: 0 auto 36px;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 56px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: border-color 0.15s;
}

.btn-secondary:hover {
  border-color: var(--vp-c-text-3);
}

.install-cmd {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: border-color 0.15s;
}

.install-cmd:hover {
  border-color: var(--vp-c-text-3);
}

.install-cmd code {
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.install-cmd svg {
  color: var(--vp-c-text-3);
}

.hero-terminal {
  max-width: 560px;
  margin: 0 auto;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  text-align: left;
  background: var(--vp-c-bg-soft);
}

.dark .hero-terminal {
  background: #0a0a0a;
  border-color: #1e1e1e;
}

.terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dark .terminal-bar {
  border-bottom-color: #1e1e1e;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}

.dark .terminal-dots span {
  background: #2a2a2a;
}

.terminal-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.terminal-body {
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.8;
}

.terminal-line {
  display: flex;
  gap: 8px;
}

.terminal-gap {
  height: 8px;
}

.terminal-prompt {
  color: var(--vp-c-text-3);
  user-select: none;
}

.terminal-cmd {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.terminal-output {
  color: var(--vp-c-text-2);
}

.terminal-dim {
  color: var(--vp-c-text-3);
}

.terminal-highlight {
  color: #22c55e;
}

.terminal-success {
  color: #22c55e;
}

.terminal-link {
  color: var(--vp-c-brand-1);
}

.features {
  padding: 64px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  background: var(--vp-c-divider);
}

.feature-card {
  padding: 28px;
  background: var(--vp-c-bg);
}

.dark .feature-card {
  background: var(--vp-c-bg-soft);
}

.feature-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
}

.dark .feature-icon {
  background: var(--vp-c-bg-mute);
}

.feature-card h3 {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.feature-card p {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.feature-card code {
  font-size: 12.5px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  font-family: var(--vp-font-family-mono);
}

.workflow {
  padding: 64px 0;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  text-align: center;
  margin: 0 0 8px;
}

.section-subtitle {
  font-size: 15px;
  color: var(--vp-c-text-2);
  text-align: center;
  margin: 0 0 48px;
}

.workflow-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 200px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  margin-bottom: 16px;
}

.dark .step-number {
  background: var(--vp-c-bg-soft);
}

.step-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 6px;
}

.step-content code {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  display: inline-block;
  margin-bottom: 8px;
}

.step-content p {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}

.workflow-connector {
  width: 40px;
  height: 1px;
  background: var(--vp-c-divider);
  margin-top: 18px;
  flex-shrink: 0;
}

.cta {
  padding: 64px 0;
}

.cta-content {
  text-align: center;
  padding: 48px 32px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.dark .cta-content {
  background: #0a0a0a;
  border-color: #1e1e1e;
}

.cta-content h2 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}

.cta-content p {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin: 0 0 28px;
}

.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.home-footer {
  padding: 32px 0 48px;
  text-align: center;
  border-top: 1px solid var(--vp-c-divider);
}

.home-footer p {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.home-footer a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.home-footer a:hover {
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 0 40px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .workflow-steps {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .workflow-connector {
    width: 1px;
    height: 24px;
    margin: 0;
  }

  .cta-actions {
    flex-direction: column;
  }
}

@media (max-width: 960px) and (min-width: 769px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
