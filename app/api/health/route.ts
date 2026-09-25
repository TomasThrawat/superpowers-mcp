export function GET() {
  return Response.json({
    ok: true,
    service: "superpowers-mcp",
    mcpEndpoint: "/api/mcp",
    upstream: "obra/superpowers",
    ref: process.env.SUPERPOWERS_REF || "main",
    llmRequired: false
  });
}
