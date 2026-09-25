# Superpowers MCP

Remote MCP HTTP adapter for [obra/superpowers](https://github.com/obra/superpowers).

## What this does

Superpowers is a development methodology made of composable skills and instructions rather than a standalone code-generation runtime. This project exposes that workflow through MCP so a remote MCP client can:

- inspect the recommended Superpowers workflow
- list the supported skills
- fetch an upstream `SKILL.md` on demand

The server does not require an LLM and does not store project code.

## MCP endpoint

After deployment:

`https://<your-domain>/api/mcp`

Health check:

`https://<your-domain>/api/health`

The implementation uses Vercel's `mcp-handler` 2.x with the MCP TypeScript SDK v2 and Streamable HTTP, which supports the current MCP protocol generation and stateless compatibility for 2025-era clients.

## Upstream

Skills are fetched from:

`https://github.com/obra/superpowers`

Set `SUPERPOWERS_REF` to a tag or commit when you need reproducibility. The default is `main`.

## Local development

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Then connect an MCP client to `http://localhost:3000/api/mcp`.

## License

The wrapper code in this repository is MIT licensed. The upstream Superpowers project is separately licensed under MIT.
