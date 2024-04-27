# Ethical Dilemma Analyzer
## Chain-of-Thought Prompting and Evaluation Demo

I'm excited to share this project I've been building: an ethical dilemma analyzer!  This is the first app where I've used Claude 3 for development from start to finish, and it's been a blast.  The Sonnet model shone as the agent, expertly guided by Opus. Inside the app, I leverage the efficient Haiku model, proving that with clever prompting, even smaller models can deliver high-quality results (and keep costs down!).  The app itself is built with a Flask backend and a React frontend for a smooth user experience.

[Live Demo](https://ethical-analysis.onrender.com) 

![Screenshots of app](/screenshots/screenshots-app.png)

### Backend (ethics-prompt-chain.py)
The Flask backend is the brain of the operation, utilizing the Claude 3 Haiku model to analyze ethical dilemmas and evaluate user responses. The backend is responsible for:
* Chain-of-Thought Reasoning: Breaking down complex ethical dilemmas into a series of logical steps, allowing for a more nuanced and comprehensive analysis.
* Prompt and Response Evaluation: Assessing user responses to each step of the dilemma, assigning a grade out of 100 based on the coherence and ethical soundness of the response.

### Frontend (my-ethics-app)
The React frontend provides a user-friendly interface for users to engage with the application. Built using MaterialUI, the frontend features:
* User Input: A simple and intuitive interface for users to enter an ethical dilemma.
 Modal Interface: A modal window that opens to display the responses to each step of the dilemma, complete with buttons for navigating to the next step and evaluating the current response.
 Real-time Feedback: Upon evaluating a response, the frontend displays the score out of 100, providing users with immediate feedback on their performance.

### How it Works
* A user enters an ethical dilemma into the frontend interface.
* The frontend sends the dilemma to the Flask backend, which breaks it down into a series of logical steps using chain-of-thought reasoning.
* The backend returns the steps to the frontend, which displays them in a modal window.
* The user responds to each step, and upon clicking the "Evaluate" button, the response is sent to the backend for evaluation.
* The backend assesses the response using Claude 3 and returns a score out of 100, which is displayed to the user in real-time.

### Getting Started
To run the application, navigate to the project directory and execute the following commands:

````pip install -r requirements.txt
python ethics-prompt-chain.py
cd my-ethics-app
npm install
npm start````

Open a web browser and navigate to http://localhost:3000 to access the application.
