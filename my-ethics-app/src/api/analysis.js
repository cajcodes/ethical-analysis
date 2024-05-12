import { Anthropic } from 'anthropic';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { situation } = req.body;
  if (!situation) {
    return res.status(400).json({
      type: "error",
      error: {
        type: "invalid_request_error",
        message: "Situation not provided."
      }
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      type: "error",
      error: {
        type: "internal_server_error",
        message: "Anthropic API key not found in environment variables."
      }
    });
  }

  const client = new Anthropic(apiKey);

  try {
    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      temperature: 0.2,
      system: SYSTEM_ROLE,
      messages: [
        {
          role: "user",
          content: buildPrompt(situation)
        }
      ]
    });

    res.json({ analysis: response.content });
  } catch (error) {
    res.status(500).json({
      type: "error",
      error: {
        type: "internal_server_error",
        message: error.message
      }
    });
  }
}

const buildPrompt = (prompt) => {
  const steps = [
    `Identify the ethical problem or dilemma in the following situation: ${prompt}. <problem>`,
    "Apply relevant ethical codes, principles, or frameworks to the identified problem <principles>",
    "Considering the principles, determine the nature and dimensions of the ethical dilemma, considering all stakeholders and potential consequences <dimensions>",
    "Given the dimensions, generate potential courses of action to address the ethical dilemma <actions>",
    "For each course of action, what are the potential consequences, and how do they align with the principles? <consequences>",
    "Based on the analysis, what is the most ethically justifiable course of action, and why does it align with the relevant principles and minimize harm to stakeholders? <answer>"
  ];
  return steps.join('\n');
};
