export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <section style={{ maxWidth: 760 }}>
        <h1>Superpowers MCP</h1>
        <p>
          Remote MCP HTTP adapter for the open-source Superpowers coding
          workflow.
        </p>
        <p>
          MCP endpoint: <code>/api/mcp</code>
        </p>
        <p>
          Health: <a href="/api/health">/api/health</a>
        </p>
      </section>
    </main>
  );
}
