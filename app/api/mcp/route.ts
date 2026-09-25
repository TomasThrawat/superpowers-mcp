import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const UPSTREAM_REF = process.env.SUPERPOWERS_REF || "main";
const RAW_BASE =
  "https://raw.githubusercontent.com/obra/superpowers";

const SKILLS = {
  brainstorming: "brainstorming/SKILL.md",
  "using-git-worktrees": "using-git-worktrees/SKILL.md",
  "writing-plans": "writing-plans/SKILL.md",
  "executing-plans": "executing-plans/SKILL.md",
  "subagent-driven-development": "subagent-driven-development/SKILL.md",
  "test-driven-development": "test-driven-development/SKILL.md",
  "systematic-debugging": "systematic-debugging/SKILL.md",
  "requesting-code-review": "requesting-code-review/SKILL.md",
  "receiving-code-review": "receiving-code-review/SKILL.md",
  "finishing-a-development-branch":
    "finishing-a-development-branch/SKILL.md",
  "verification-before-completion":
    "verification-before-completion/SKILL.md",
  "diagnosing-superpowers": "diagnosing-superpowers/SKILL.md"
} as const;

const SKILL_NAMES = Object.keys(SKILLS) as [
  keyof typeof SKILLS,
  ...(keyof typeof SKILLS)[]
];

const WORKFLOW = [
  ["brainstorming", "Refine the request into a concrete design before coding."],
  ["using-git-worktrees", "Create an isolated branch/worktree and verify a clean baseline."],
  ["writing-plans", "Turn the approved design into small, testable implementation tasks."],
  ["executing-plans or subagent-driven-development", "Execute the plan with checkpoints and review."],
  ["test-driven-development", "Use RED-GREEN-REFACTOR during implementation."],
  ["requesting-code-review", "Review the implementation before finishing."],
  ["verification-before-completion", "Verify the actual result before claiming completion."],
  ["finishing-a-development-branch", "Complete the branch using the project workflow."]
] as const;

async function loadSkill(skill: keyof typeof SKILLS): Promise<string> {
  const url = `${RAW_BASE}/${UPSTREAM_REF}/skills/${SKILLS[skill]}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "superpowers-mcp/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Unable to fetch upstream Superpowers skill "${skill}" (HTTP ${response.status}).`
    );
  }

  return response.text();
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "superpowers_workflow",
      {
        title: "Superpowers Workflow",
        description:
          "Return the recommended Superpowers software-development workflow and the skill to use at each phase.",
        inputSchema: z.object({})
      },
      async () => ({
        content: [
          {
            type: "text",
            text: [
              `Superpowers upstream: obra/superpowers @ ${UPSTREAM_REF}`,
              "No LLM is used by this MCP wrapper; it exposes Superpowers' workflow and skill documents to the connected agent.",
              "",
              ...WORKFLOW.map(
                ([phase, purpose], index) =>
                  `${index + 1}. ${phase}: ${purpose}`
              ),
              "",
              "Use superpowers_get_skill to load the complete upstream SKILL.md for a phase."
            ].join("\n")
          }
        ]
      })
    );

    server.registerTool(
      "superpowers_skill_catalog",
      {
        title: "Superpowers Skill Catalog",
        description:
          "List the Superpowers skills exposed by this MCP server.",
        inputSchema: z.object({})
      },
      async () => ({
        content: [
          {
            type: "text",
            text: [
              `Source: https://github.com/obra/superpowers/tree/${UPSTREAM_REF}/skills`,
              "",
              ...SKILL_NAMES.map((skill) => `- ${skill}`)
            ].join("\n")
          }
        ]
      })
    );

    server.registerTool(
      "superpowers_get_skill",
      {
        title: "Get Superpowers Skill",
        description:
          "Fetch the complete upstream SKILL.md for one approved Superpowers skill.",
        inputSchema: z.object({
          skill: z.enum(SKILL_NAMES)
        })
      },
      async ({ skill }) => {
        try {
          const markdown = await loadSkill(skill);
          return {
            content: [
              {
                type: "text",
                text: [
                  `Source: ${RAW_BASE}/${UPSTREAM_REF}/skills/${SKILLS[skill]}`,
                  "",
                  markdown
                ].join("\n")
              }
            ]
          };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text:
                  error instanceof Error
                    ? error.message
                    : "Unknown upstream skill fetch error."
              }
            ]
          };
        }
      }
    );
  },
  {
    capabilities: { tools: {} },
    serverInfo: {
      name: "superpowers-mcp",
      version: "1.0.0"
    },
    instructions:
      "Remote MCP adapter for obra/superpowers. Prefer superpowers_workflow first, then fetch the exact skill needed with superpowers_get_skill."
  }
);

export { handler as GET, handler as POST };
