import { CodeBlock } from "./components/code-block";
import { Navbar } from "./components/navbar";
import styles from "./page.module.css";

const navItems = [
  { label: "Problems", href: "#problems" },
  { label: "Quick Start", href: "#quick-start" },
  { label: "Examples", href: "#request-examples" },
  { label: "Run", href: "#run" },
];

const quickStartSchema = `port: 4100

GET /users:
  id:uuid
  name:name
  email:email
  age:number

DELETE /users:
  id:uuid`;

const corsConfig = `module.exports = {
  port: 3000,
  cors: true,
  delay: 200,
  routes: {
    "/users": { count: 50, schema: "user" }
  }
};`;

const getResponse = `{
  "users": [
    {
      "id": "f8fb13e8-beb3-4f0e-a7be-83584bfaf496",
      "name": "Rosa Abbott",
      "email": "rosa@example.com",
      "age": 54
    }
  ]
}`;

const qaItems = [
  {
    id: "problem-init",
    problem: "fexapi init does not create files",
    fix: "Run the command inside a project that has a package.json. FexAPI resolves project root by searching for package.json in parent directories.",
    code: `pnpm dlx fexapi init\n\n# if files already exist\nfexapi init --force`,
  },
  {
    id: "problem-generate",
    problem: "fexapi generate fails with schema errors",
    fix: "Routes must use METHOD /path: followed by at least one field in name:type format, and field types must be valid.",
    code: `# valid\nGET /users: id:uuid,name:name,email:email\n\n# also valid multiline\nGET /users:\n  id:uuid\n  name:name\n  email:email`,
  },
  {
    id: "problem-options",
    problem: "Unknown option(s) or Duplicate option(s)",
    fix: "Only supported flags are accepted per command. For serve use --host, --port, --log. For dev use --watch, --host, --port, --log.",
    code: `fexapi serve --host 127.0.0.1 --port 4000 --log\nfexapi dev --watch --host 127.0.0.1 --port 4000 --log`,
  },
  {
    id: "problem-404",
    problem: "Route returns 404 Route not found",
    fix: "A route must exist in runtime config routes or in fexapi/generated.api.json. If neither is present, not found responses include availableRoutes.",
    code: `fexapi generate\nfexapi serve\n\n# then call one route from schema file\ncurl http://127.0.0.1:4000/users`,
  },
  {
    id: "problem-cors",
    problem: "Frontend blocked by CORS",
    fix: "Enable cors in fexapi.config.js. Server then includes Access-Control-Allow-* headers and handles OPTIONS preflight with 204.",
    code: corsConfig,
  },
  {
    id: "problem-watch",
    problem: "Changes are not reloading in dev mode",
    fix: "Use fexapi dev --watch and edit watched files under fexapi/, fexapi.config.js, fexapi.config.json, or schemas/*.yaml.",
    code: `fexapi dev --watch --log`,
  },
  {
    id: "problem-status",
    problem: "Unexpected status code",
    fix: "By implementation: GET returns 200, POST returns 201, PUT/PATCH returns 200, DELETE returns 200, OPTIONS returns 204, unknown route returns 404.",
    code: `curl -X POST http://127.0.0.1:4000/users -H "Content-Type: application/json" -d '{"name":"Alice"}'`,
  },
  {
    id: "problem-count",
    problem: "GET count parameter not behaving as expected",
    fix: "count is clamped from 1 to 50 and defaults to 5. Non-numeric values fall back to default.",
    code: `curl "http://127.0.0.1:4000/users?count=1"\ncurl "http://127.0.0.1:4000/users?count=99"`,
  },
  {
    id: "problem-json",
    problem: "Invalid JSON body on POST/PUT/PATCH",
    fix: "Malformed JSON body is ignored. FexAPI still returns generated data and merges valid parsed body fields when parsing succeeds.",
    code: `curl -X PUT http://127.0.0.1:4000/users -H "Content-Type: application/json" -d '{bad}'`,
  },
];

export default function Home() {
  return (
    <div id="top" className={styles.page}>
      <Navbar title="FexAPI" items={navItems} />
      <main className={styles.main}>
        <section className={styles.darkStage}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>FexAPI Support</p>
            <h1>Ship faster when something breaks.</h1>
            <p>
              Focused answers for real FexAPI issues. Open a problem, apply the
              command, and move on.
            </p>
            <div className={styles.heroStats}>
              <article>
                <strong>9</strong>
                <span>Core fixes</span>
              </article>
              <article>
                <strong>5m</strong>
                <span>Average recovery</span>
              </article>
              <article>
                <strong>CLI</strong>
                <span>Copy-run workflow</span>
              </article>
            </div>
          </section>

          <section className={styles.quickFilters}>
            <a href="#problem-init">Init</a>
            <a href="#problem-generate">Generate</a>
            <a href="#problem-404">404 Route</a>
            <a href="#problem-cors">CORS</a>
            <a href="#problem-watch">Watch</a>
            <a href="#problem-status">Status Code</a>
          </section>

          <section id="problems" className={styles.problemFeed}>
            {qaItems.map((item) => (
              <article key={item.id} id={item.id} className={styles.qaItem}>
                <div className={styles.problemBubble}>
                  <span className={styles.problemLabel}>Problem</span>
                  <p>{item.problem}</p>
                </div>
                <div className={styles.answerCard}>
                  <span className={styles.answerLabel}>Answer</span>
                  <p>{item.fix}</p>
                  <CodeBlock language="bash" code={item.code} />
                </div>
              </article>
            ))}
          </section>

          <section className={styles.composer}>
            <span>Need another fix?</span>
            <div className={styles.composerInput}>
              Describe a FexAPI issue to add here.
            </div>
          </section>
        </section>

        <section className={styles.lightStage}>
          <div id="quick-start" className={styles.supportCard}>
            <h2>Quick Start</h2>
            <CodeBlock
              language="bash"
              code={`fexapi init\nfexapi generate\nfexapi dev --watch --log`}
            />
            <CodeBlock language="txt" code={quickStartSchema} />
          </div>

          <div id="request-examples" className={styles.supportCard}>
            <h2>Request and Response</h2>
            <CodeBlock
              language="bash"
              code={`curl "http://127.0.0.1:4000/users?count=1"\n\ncurl -X POST http://127.0.0.1:4000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice"}'\n\ncurl -X DELETE http://127.0.0.1:4000/users`}
            />
            <CodeBlock language="json" code={getResponse} />
          </div>

          <div id="run" className={styles.supportCard}>
            <h2>Run in Production</h2>
            <CodeBlock
              language="bash"
              code={`pnpm install\npnpm --filter ./apps/cli build\nnode apps/cli/dist/index.js serve --host 0.0.0.0 --port 4000`}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
