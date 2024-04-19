from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
import anthropic
import markdown

app = Flask(__name__)
CORS(app)

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if API_KEY is None:
    raise ValueError("Anthropic API key not found in environment variables.")

CLIENT = anthropic.Anthropic(api_key=API_KEY)

SYSTEM_ROLE = """
You are an expert in ethics conducting a comprehensive analysis of this situation. 
Follow established ethical frameworks and principles. 
Please keep your responses very concise and precise. 
Always use markdown format for clarity (e.g., headings, code blocks, bold, > quotes, - unordered lists). 
For each step, please provide a detailed analysis in the corresponding tags (<problem>, <principles>, <dimensions>, <actions>, <consequences>, or <answer>). 
For example, a well-structured response for the first step might look like this: 
<step_tag>
<thinking>
My analysis of this step involves considering [insert relevant factors or principles].
This leads me to conclude that [insert conclusion].
</thinking>
[Insert response]
</step_tag>
Please ONLY use `<answer>` tags once, ALWAYS around final response. 
If you are unable to respond, reply 'incomplete' with no explanation."
"""

STEPS = [
    ("Identify the ethical problem or dilemma in the following situation: {prompt}.", "<problem>"),
    ("Apply relevant ethical codes, principles, or frameworks to the identified problem", "<principles>"),
    ("Considering the principles, determine the nature and dimensions of the ethical dilemma, considering all stakeholders and potential consequences", "<dimensions>"),
    ("Given the dimensions, generate potential courses of action to address the ethical dilemma", "<actions>"),
    ("For each course of action, what are the potential consequences, and how do they align with the principles?", "<consequences>"),
    ("Based on the analysis, what is the most ethically justifiable course of action, and why does it align with the relevant principles and minimize harm to stakeholders?", "<answer>")
]

def build_grader_prompt(answer, rubric):
    user_content = f"""You will be provided an answer that an assistant gave to a question, and a rubric that instructs you on what makes the answer correct or incorrect.
    
    Here is the answer that the assistant gave to the question.
    <answer>{answer}</answer>
    
    Here is the rubric on what makes the answer correct or incorrect.
    <rubric>{rubric}</rubric>
    
    An answer is correct if it entirely meets the rubric criteria, and is otherwise incorrect.
    First, think through whether the answer is correct or incorrect based on the rubric inside <thinking></thinking> tags. Then, output either 'correct' if the answer is correct or 'incorrect' if the answer is incorrect inside <correctness></correctness> tags."""

    messages = [{'role': 'user', 'content': user_content}]
    return messages

def get_completion(messages):
    completion = []
    for message in messages:
        completion.append(message.text)
    return ''.join(completion)

def grade_completion(output, rubric):
    try:
        messages = build_grader_prompt(output, rubric)
        completion = CLIENT.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=256,
            temperature=0.2,
            messages=messages
        ).content

        if isinstance(completion, list):
            completion_text = ''.join([block.text for block in completion])
        else:
            completion_text = completion

        pattern = r'<correctness>(.*?)</correctness>'
        match = re.search(pattern, completion_text, re.DOTALL)
        if match:
            correctness = match.group(1).strip()
            if correctness == 'correct':
                score = 100
            else:
                pattern = r'<score>(.*?)</score>'
                match = re.search(pattern, completion_text, re.DOTALL)
                if match:
                    score = int(match.group(1).strip())
                else:
                    score = 0
            return {"result": correctness, "score": score}
        else:
            return {"result": "Unknown", "score": 0}
    except Exception as e:
        raise RuntimeError(f"Error during grading: {str(e)}") from e
    
def ethical_analysis(prompt: str, anthropic_client: anthropic.Anthropic) -> str:
    try:
        # Replace {prompt} with the actual prompt
        step_templates = [step.format(prompt=prompt) for step, tag in STEPS]
        combined_prompt = "\n".join([f"{step}\n{tag}" for step, tag in zip(step_templates, STEPS)])

        response = anthropic_client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2048,
            temperature=0.2,
            system=SYSTEM_ROLE,
            messages=[
                {
                    "role": "user",
                    "content": combined_prompt
                }
            ]
        ).content

        # Print the raw response from Claude
        # print("Raw response from Claude:")
        # print(response)

        # Extract the analysis result from the response
        analysis_result = get_completion(response)

        return {"analysis": analysis_result}
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"error": {"message": str(e), "type": "internal_server_error"}}

@app.route('/analysis', methods=['POST'])
def analyze_ethics():
    try:
        data = request.json
        situation = data.get('situation')
        if not situation:
            return jsonify({
                "type": "error",
                "error": {
                    "type": "invalid_request_error",
                    "message": "Situation not provided."
                }
            }), 400

        analysis_results = ethical_analysis(situation, CLIENT)
        return jsonify(analysis_results)
    except Exception as e:
        return jsonify({
            "type": "error",
            "error": {
                "type": "internal_server_error",
                "message": str(e)
            }
        }), 500
        
@app.route('/eval', methods=['POST'])
def evaluate_completion():
    try:
        data = request.json
        prompt = data.get('prompt')
        completion = data.get('completion')
        rubric = data.get('rubric')
        if not prompt or not completion or not rubric:
            return jsonify({"error": "Prompt, completion, or rubric not provided"}), 400

        result = grade_completion(completion, rubric)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/steps', methods=['GET'])
def get_steps():
    steps_with_tags = [
        ("<prompt>" + step + "</prompt>", tag)
        for step, tag in STEPS
    ]
    return jsonify(steps_with_tags)

if __name__ == '__main__':
    app.run(debug=True)
