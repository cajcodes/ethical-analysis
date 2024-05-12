export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const stepsWithTags = [
    { step: "Identify the ethical problem or dilemma in the following situation: {prompt}.", tag: "<problem>" },
    { step: "Apply relevant ethical codes, principles, or frameworks to the identified problem", tag: "<principles>" },
    { step: "Considering the principles, determine the nature and dimensions of the ethical dilemma, considering all stakeholders and potential consequences", tag: "<dimensions>" },
    { step: "Given the dimensions, generate potential courses of action to address the ethical dilemma", tag: "<actions>" },
    { step: "For each course of action, what are the potential consequences, and how do they align with the principles?", tag: "<consequences>" },
    { step: "Based on the analysis, what is the most ethically justifiable course of action, and why does it align with the relevant principles and minimize harm to stakeholders?", tag: "<answer>" }
  ];

  res.json(stepsWithTags);
}
