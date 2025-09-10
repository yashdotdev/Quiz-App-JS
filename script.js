const quizContainer = document.querySelector(".question-box");
const question = document.querySelector("#question-text");
const submitBtn = document.querySelector("#submit-btn");
const options = document.querySelectorAll(".options li button");
let score = document.querySelector("#score");

let currentScore = 0;

let questions = [];
let currentIndex = 0;
let quesNumber = 1;

async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&type=multiple"
    );
    if (!response.ok) {
      throw new Error("Something went wrong!! Unable to fetch the data");
    }

    const data = await response.json();
    questions = data.results; // storing all the questions from api
    // console.log(questions); // All questions array

    showQues();
  } catch {
    console.log(error);
    // question.innerHTML = `<h3 style='color': red"></h3>`;
  }
}

function shuffle(array) {
  return array.sort(() => Math.floor(Math.random() - 0.5));
}

function showQues() {
  let questionObject = questions[currentIndex];

  // fetching the question text and injecting it in the dom
  let currentQuestion = questionObject.question;
  question.innerHTML = `${quesNumber}. ${currentQuestion}`;
  // console.log(currentQuestion); // it would log the current question

  // console.log(questionObject.correct_answer); // logging the correct answer in the console

  let allOptions = shuffle([
    ...questionObject.incorrect_answers,
    questionObject.correct_answer,
  ]);

  options.forEach((element, index) => {
    element.innerHTML = allOptions[index];
    // console.log(options);
    element.onclick = () => {
      handleOptionClick(element.innerHTML, questionObject);
    };
  });
}

function handleOptionClick(selectedAnswer, questionObject) {
  if (selectedAnswer === questionObject.correct_answer) {
    
    if (currentIndex >= 10) {
      options.forEach((btn) => {
        btn.disabled = true;
      })
      return;
    }
    
    currentIndex++;
    quesNumber++;
    currentScore++;
    score.innerHTML = `Score: ${currentScore}`;
    // console.log(currentScore);

  } else if (selectedAnswer !== questionObject.correct_answer) {
    if(currentIndex === 10) {
      return;
    }
    currentIndex++;
    quesNumber++;
  }
  
  showQues();
}

fetchQuestions();

submitBtn.addEventListener("click", submitQuiz);

function submitQuiz() {
  question.remove();

  options.forEach((btn) => {
    // btn.innerHTML = "";
    btn.remove();
  });

  submitBtn.remove();

  score.innerHTML = `<h3>Quiz Submitted! ✅ </h3>
    <p>Correct: ${currentScore}</p>
    <p>Incorrect: ${(quesNumber - currentScore) - 1}</p>`;

  return;
}
