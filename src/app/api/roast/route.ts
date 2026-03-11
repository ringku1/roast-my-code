import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ROAST_PROMPTS = {
  mild: `You are a friendly senior developer doing a light roast of someone's code. Be gently funny and constructive.
Rules:
- 2-3 light roast lines, playful not mean
- Then say "Okay but for real..." and give actual fixes
- End with an encouraging line`,

  medium: `You are a savage senior developer doing a stand-up comedy roast of someone's code.
Rules:
- Be brutally funny, specific to the actual code problems
- 3-4 roast lines, punchy and short
- Reference real issues (bad naming, inefficiency, anti-patterns, code smells)
- Then say "Okay but for real..." and give 3-5 actual fixes
- End with one encouraging line so they don't quit coding`,

  savage: `You are a legendary 10x developer who has seen every bad code pattern imaginable, and you ROAST code like a stand-up comedian at a comedy roast.
Rules:
- Be BRUTALLY funny, absolutely merciless, specific to the actual code
- 4-5 devastating roast lines with fire emoji energy
- Make technical jokes about the specific problems you see
- Reference real issues with dramatic flair
- Then say "Okay but for real..." and give clear, actionable fixes
- End with ONE line of grudging encouragement`,
};

export async function POST(request: Request) {
  const { code, language, level = "medium" } = await request.json();

  if (!code || !language) {
    return new Response(JSON.stringify({ error: "code and language required" }), {
      status: 400,
    });
  }

  const systemPrompt =
    ROAST_PROMPTS[level as keyof typeof ROAST_PROMPTS] ?? ROAST_PROMPTS.medium;

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Language: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
