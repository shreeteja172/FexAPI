import { CodeBlock } from "./components/code-block";
import { Navbar } from "./components/navbar";
import { Section } from "./components/section";
import { Sidebar } from "./components/sidebar";
import styles from "./page.module.css";

const navItems = [
  { label: "Getting Started", href: "#installation" },
  { label: "Usage", href: "#usage" },
  { label: "Routes", href: "#routes" },
  { label: "Config", href: "#configuration" },
];

const sidebarGroups = [
  {
    title: "Overview",
    items: [
      { label: "What is FexAPI", href: "#top" },
      { label: "Features", href: "#features" },
    ],
  },
  {
    title: "Setup",
    items: [
      { label: "Installation", href: "#installation" },
      { label: "Quick Start", href: "#quick-start" },
      { label: "Folder Structure", href: "#structure" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "CLI Commands", href: "#commands" },
      { label: "Request Examples", href: "#usage" },
      { label: "Error Handling", href: "#errors" },
      { label: "Deployment", href: "#deployment" },
    ],
  },
];

const schemaExample = `port: 4100

GET /users:
  id:uuid
  name:name
  email:email
  age:number

POST /users:
  id:uuid
  name:name
  email:email`;

const configExample = `module.exports = {
  port: 3000,
  cors: true,
  delay: 200,
  routes: {
    "/users": { count: 50, schema: "user" },
    "/posts": { count: 100, schema: "post" }
  }
};`;

const responseExample = `{
  "users": [
    {
      "id": "f8fb13e8-beb3-4f0e-a7be-83584bfaf496",
      "name": "Rosa Abbott",
      "email": "rosa@example.com",
      "age": 54
    }
  ]
}`;

export default function Home() {
  return (
    <div id="top" className={styles.page}>
      <Navbar title="FexAPI" items={navItems} />
      <div className={styles.layout}>
        <Sidebar groups={sidebarGroups} />
        <main className={styles.main}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>Developer Documentation</p>
            <h1>FexAPI</h1>
            <p>
              Mock API generation CLI for frontend development and testing.
              Define routes in a schema, generate artifacts, and run a local
              HTTP server with realistic Faker-based payloads.
            </p>
          </section>

          <Section id="features" title="Key Features">
            <ul className={styles.featureList}>
              <li>
                Schema parser for GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
              </li>
              <li>
                Data generation through built-in field types and Faker methods
              </li>
              <li>
                Runtime route config through fexapi.config.js and YAML schemas
              </li>
              <li>
                Watch mode with automatic server restart on config changes
              </li>
              <li>
                Optional CORS headers, OPTIONS handling, request logging, and
                delay
              </li>
            </ul>
          </Section>

          <Section id="installation" title="Installation">
            <p>Node.js 18+ is required.</p>
            <CodeBlock language="bash" code={`npm install -g fexapi`} />
            <p>Or use package runners:</p>
            <CodeBlock
              language="bash"
              code={`pnpm dlx fexapi init\n\nnpx fexapi init\n\nyarn dlx fexapi init`}
            />
          </Section>

          <Section id="quick-start" title="Quick Start">
            <CodeBlock
              language="bash"
              code={`fexapi init\nfexapi generate\nfexapi dev --watch --log`}
            />
            <p>Example schema file:</p>
            <CodeBlock language="txt" code={schemaExample} />
          </Section>

          <Section id="structure" title="Project Structure">
            <CodeBlock
              language="txt"
              code={`fexapi/
  schema.fexapi
  generated.api.json
  migrations/
    schema.json
  schemas/
    user.yaml
    post.yaml
fexapi.config.json
fexapi.config.js`}
            />
          </Section>

          <Section id="commands" title="CLI Commands">
            <div className={styles.commandGrid}>
              <article>
                <h3>fexapi init [--force]</h3>
                <p>
                  Scaffolds schema and config files with an interactive wizard.
                </p>
              </article>
              <article>
                <h3>fexapi generate</h3>
                <p>
                  Parses schema.fexapi and writes generated.api.json and
                  migrations.
                </p>
              </article>
              <article>
                <h3>fexapi format</h3>
                <p>
                  Rewrites schema.fexapi into readable multi-line field format.
                </p>
              </article>
              <article>
                <h3>fexapi serve [--host --port --log]</h3>
                <p>
                  Runs the server using runtime config and/or generated routes.
                </p>
              </article>
              <article>
                <h3>fexapi dev --watch [--host --port --log]</h3>
                <p>
                  Serve mode with automatic restart when config/schema files
                  change.
                </p>
              </article>
            </div>
          </Section>

          <Section id="usage" title="Request and Response Examples">
            <CodeBlock
              language="bash"
              code={`curl "http://127.0.0.1:4000/users?count=1"\n\ncurl -X POST http://127.0.0.1:4000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice"}'\n\ncurl -X DELETE http://127.0.0.1:4000/users`}
            />
            <p>Sample GET response shape:</p>
            <CodeBlock language="json" code={responseExample} />
          </Section>

          <Section id="routes" title="Route Resolution">
            <ol className={styles.orderedList}>
              <li>
                GET uses runtime routes from fexapi.config.js when configured.
              </li>
              <li>Otherwise routes from fexapi/generated.api.json are used.</li>
              <li>Unknown routes return 404 with availableRoutes list.</li>
              <li>
                POST returns 201, PUT/PATCH returns 200, DELETE returns 200.
              </li>
            </ol>
          </Section>

          <Section id="configuration" title="Configuration">
            <CodeBlock language="javascript" code={configExample} />
            <ul className={styles.featureList}>
              <li>port: default server port unless overridden by --port</li>
              <li>
                cors: enables Access-Control headers and OPTIONS preflight
              </li>
              <li>delay: adds response latency in milliseconds</li>
              <li>routes: maps GET endpoints to count and schema</li>
            </ul>
          </Section>

          <Section id="errors" title="Error Handling and Edge Cases">
            <ul className={styles.featureList}>
              <li>Port must be integer between 1 and 65535</li>
              <li>Invalid flags and duplicate flags fail command parsing</li>
              <li>Schema routes require unique method + path combinations</li>
              <li>
                Invalid field syntax or unknown field types fail generation
              </li>
              <li>
                Malformed JSON request body is ignored and fallback data is used
              </li>
            </ul>
          </Section>

          <Section id="deployment" title="Deployment">
            <p>
              Build CLI artifacts in the monorepo and run from dist in Node
              environments.
            </p>
            <CodeBlock
              language="bash"
              code={`pnpm install\npnpm --filter ./apps/cli build\nnode apps/cli/dist/index.js serve --host 0.0.0.0 --port 4000`}
            />
          </Section>
        </main>
      </div>
    </div>
  );
}
