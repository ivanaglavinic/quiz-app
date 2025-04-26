let correctAnswersCount = 0;
let questionsAnsweredCount = 0;
let answeredQuestionIndices = new Set();

// JS2 - Week 2
function sortAlphabetical(questions) {
  return [...questions].sort((a, b) => {
    const questionA = a.question.toLowerCase();
    const questionB = b.question.toLowerCase();
    if (questionA < questionB) {
      return -1;
    }
    if (questionA > questionB) {
      return 1;
    }
    return 0;
  });
}
function sortRandom(questions) {
  return [...questions].sort(() => Math.random() - 0.5);
}

// JS2 - Week 1
document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");
  const answerInputs = document.querySelectorAll(".answer");
  const randomizeButton = document.createElement("button");
  randomizeButton.textContent = "Randomize Options";
  randomizeButton.type = "button";
  randomizeButton.id = "randomizeBtn";
  quizForm.insertBefore(
    randomizeButton,
    quizForm.querySelector('button[type="submit"]')
  );

  // JS2 - Week 1
  randomizeButton.addEventListener("click", () => {
    const answersContainer = Array.from(answerInputs);
    const parent = answersContainer[0].parentNode;
    const submitButton = quizForm.querySelector('button[type="submit"]');

    const detachedAnswers = answersContainer.map((div) =>
      parent.removeChild(div)
    );

    for (let i = detachedAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [detachedAnswers[i], detachedAnswers[j]] = [
        detachedAnswers[j],
        detachedAnswers[i],
      ];
    }

    detachedAnswers.forEach((div) => parent.appendChild(div));
    if (submitButton && submitButton.parentNode === parent) {
      parent.appendChild(submitButton);
    }
  });

  // JS2 - Week 2
  const questionListContainer = document.getElementById("questionsContainer");
  let fetchedQuestions = [];

  // JS3 - Week 1
  async function fetchQuizQuestions() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/ivanaglavinic/ivanaglavinic.github.io/refs/heads/main/questions.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      fetchedQuestions = data;
      displayQuizQuestions(data);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      questionListContainer.textContent = "Failed to load quiz questions.";
    }
  }

  // JS2 - Week 2
  function displayQuizQuestions(questions) {
    questionListContainer.innerHTML = "";
    questions.forEach((question, questionIndex) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("quiz-item");
      const questionHeading = document.createElement("h3");
      questionHeading.textContent = question.question;
      questionDiv.appendChild(questionHeading);
      const shuffledOptions = [...question.options];
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      const randomizedOptions = shuffleArray(shuffledOptions);
      const optionsList = document.createElement("div");
      optionsList.classList.add("optionsList");
      randomizedOptions.forEach((option, shuffledIndex) => {
        const answerButton = document.createElement("button");
        answerButton.textContent = `${String.fromCharCode(
          97 + shuffledIndex
        )}. ${option.text}`;
        answerButton.classList.add("answer-button");
        answerButton.dataset.questionIndex = questionIndex;
        answerButton.dataset.optionText = option.text;
        answerButton.addEventListener("click", function () {
          const qIndex = parseInt(this.dataset.questionIndex);
          const clickedOptionText = this.dataset.optionText;
          const originalCorrectOption = questions[qIndex].options.find(
            (opt) => opt.isCorrect
          );
          const allAnswerButtons =
            this.parentNode.querySelectorAll(".answer-button");
          if (clickedOptionText === originalCorrectOption.text) {
            this.classList.add("correct-answer");
            correctAnswersCount++;
          } else {
            this.classList.add("incorrect-answer");
          }
          allAnswerButtons.forEach((button) => {
            const buttonText = button.dataset.optionText;
            const originalOption = questions[qIndex].options.find(
              (opt) => opt.text === buttonText
            );
            if (originalOption && originalOption.isCorrect) {
              button.classList.add("correct-answer");
            }
            button.disabled = true;
          });
          if (!answeredQuestionIndices.has(qIndex)) {
            questionsAnsweredCount++;
            answeredQuestionIndices.add(qIndex);
          }
          checkQuizEnd();
        });
        optionsList.appendChild(answerButton);
      });
      questionDiv.appendChild(optionsList);

      // JS2 - Week 2
      const revealButton = document.createElement("button");
      revealButton.textContent = "Reveal Answer";
      revealButton.addEventListener("click", () => {
        const optionsContainer = questionDiv.querySelector(".optionsList");
        const answerButtons =
          optionsContainer.querySelectorAll(".answer-button");
        answerButtons.forEach((button) => {
          const buttonText = button.dataset.optionText;
          const originalOption = question.options.find(
            (opt) => opt.text === buttonText
          );
          if (originalOption && originalOption.isCorrect) {
            button.classList.add("correct-answer");
          }
          button.disabled = true;
        });
        revealButton.disabled = true;
      });
      questionDiv.appendChild(revealButton);
      questionListContainer.appendChild(questionDiv);
    });
  }

  // JS2 - Week 2
  function displayFilteredQuestions(questions) {
    questionListContainer.innerHTML = "";
    if (questions.length === 0) {
      questionListContainer.textContent =
        "No questions found matching your search.";
      return;
    }

    questions.forEach((question, questionIndex) => {
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("quiz-item");
      const questionHeading = document.createElement("h3");
      questionHeading.textContent = question.question;
      questionDiv.appendChild(questionHeading);
      const optionsList = document.createElement("div");
      optionsList.classList.add("optionsList");
      question.options.forEach((option, optionIndex) => {
        const answerButton = document.createElement("button");
        answerButton.textContent = `${String.fromCharCode(97 + optionIndex)}. ${
          option.text
        }`;
        answerButton.classList.add("answer-button");
        answerButton.dataset.questionIndex = questionIndex;
        answerButton.dataset.optionText = option.text;
        answerButton.addEventListener("click", function () {
          const qIndex = parseInt(this.dataset.questionIndex);
          const clickedOptionText = this.dataset.optionText;
          const originalCorrectOption = questions[qIndex].options.find(
            (opt) => opt.isCorrect
          );
          const allAnswerButtons =
            this.parentNode.querySelectorAll(".answer-button");
          if (clickedOptionText === originalCorrectOption.text) {
            this.classList.add("correct-answer");
            correctAnswersCount++;
          } else {
            this.classList.add("incorrect-answer");
          }
          allAnswerButtons.forEach((button) => {
            const buttonText = button.dataset.optionText;
            const originalOption = questions[qIndex].options.find(
              (opt) => opt.text === buttonText
            );
            if (originalOption && originalOption.isCorrect) {
              button.classList.add("correct-answer");
            }
            button.disabled = true;
          });
          if (!answeredQuestionIndices.has(qIndex)) {
            questionsAnsweredCount++;
            answeredQuestionIndices.add(qIndex);
          }
          checkQuizEnd();
        });
        optionsList.appendChild(answerButton);
      });

      questionDiv.appendChild(optionsList);
      const revealButton = document.createElement("button");
      revealButton.textContent = "Reveal Answer";
      revealButton.addEventListener("click", () => {
        const optionsContainer = questionDiv.querySelector(".optionsList");
        const answerButtons =
          optionsContainer.querySelectorAll(".answer-button");
        answerButtons.forEach((button) => {
          const buttonText = button.dataset.optionText;
          const originalOption = question.options.find(
            (opt) => opt.text === buttonText
          );
          if (originalOption && originalOption.isCorrect) {
            button.classList.add("correct-answer");
          }
          button.disabled = true;
        });
        revealButton.disabled = true;
      });
      questionDiv.appendChild(revealButton);
      questionListContainer.appendChild(questionDiv);
    });
  }

  // JS3 - Week 2
  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.trim() === "") {
      displayQuizQuestions(fetchedQuestions);
    } else if (fetchedQuestions && fetchedQuestions.length > 0) {
      const filteredQuestions = fetchedQuestions.filter((question) =>
        question.question.toLowerCase().includes(searchTerm)
      );
      displayFilteredQuestions(filteredQuestions);
    }
  });

  // JS2 - Week 1
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const questionInput = document.getElementById("questionInput");
    const answerTexts = document.querySelectorAll(".answerInput");
    const correctAnswerRadio = document.querySelector(
      'input[name="correctAnswer"]:checked'
    );
    if (!correctAnswerRadio) {
      alert("Please select the correct answer.");
      return;
    }
    const questionText = questionInput.value;
    const options = [];
    answerTexts.forEach((input, index) => {
      options.push({
        text: input.value,
        isCorrect: parseInt(correctAnswerRadio.value) === index,
      });
    });

    const newQuizQuestion = {
      id: Date.now(),
      question: questionText,
      options: options,
      explanation: "",
    };
    console.log("New question submitted:", newQuizQuestion);
    fetchedQuestions.push(newQuizQuestion);
    displayQuizQuestions(fetchedQuestions);
    questionInput.value = "";
    answerTexts.forEach((input) => (input.value = ""));
    document
      .querySelectorAll('input[name="correctAnswer"]')
      .forEach((radio) => (radio.checked = false));
    document.querySelectorAll(".answerInput").forEach((input) => {
      input.classList.remove("correct", "incorrect");
    });
  });

  // JS2 - Week 3
  const player1NameInput = document.getElementById("player1Name");
  const player2NameInput = document.getElementById("player2Name");
  const startQuizBtn = document.getElementById("startQuizBtn");
  const playerSetupDiv = document.getElementById("playerSetup");
  const scoreboardDiv = document.getElementById("scoreboard");
  const name1Span = document.getElementById("name1");
  const name2Span = document.getElementById("name2");
  const score1Span = document.getElementById("score1");
  const score2Span = document.getElementById("score2");

  startQuizBtn.addEventListener("click", () => {
    const player1Name = player1NameInput.value.trim();
    const player2Name = player2NameInput.value.trim();

    if (player1Name && player2Name) {
      name1Span.textContent = player1Name;
      name2Span.textContent = player2Name;
      score1Span.textContent = "0";
      score2Span.textContent = "0";

      playerSetupDiv.style.display = "none";
      startQuizBtn.style.display = "none";
      scoreboardDiv.style.display = "block";
      startTimer();
    } else {
      alert("Please enter names for both players.");
    }
  });

  // JS2 - Week 3
  const correctButtons = document.querySelectorAll(".correctBtn");
  const wrongButtons = document.querySelectorAll(".wrongBtn");

  correctButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const player = button.dataset.player;
      if (player === "1") {
        score1Span.textContent = parseInt(score1Span.textContent) + 1;
      } else if (player === "2") {
        score2Span.textContent = parseInt(score2Span.textContent) + 1;
      }
    });
  });

  wrongButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const player = button.dataset.player;
      if (player === "1") {
        score2Span.textContent = parseInt(score2Span.textContent) + 1;
      } else if (player === "2") {
        score1Span.textContent = parseInt(score1Span.textContent) + 1;
      }
    });
  });

  // JS3 - Week 1
  const sortOrderSelect = document.getElementById("sortOrder");
  sortOrderSelect.addEventListener("change", () => {
    const selectedOption = sortOrderSelect.value;
    let sortedQuestions = [...fetchedQuestions];

    if (selectedOption === "alphabetical") {
      sortedQuestions = sortAlphabetical(sortedQuestions);
    } else if (selectedOption === "random") {
      sortedQuestions = sortRandom(sortedQuestions);
    }

    displayQuizQuestions(sortedQuestions);
  });

  // JS3 - Week 3
  function checkQuizEnd() {
    console.log("checkQuizEnd() called");
    const totalQuestions = fetchedQuestions.length;
    console.log(
      "Total questions:",
      totalQuestions,
      "Answered questions:",
      questionsAnsweredCount,
      "Correct answers:",
      correctAnswersCount
    );

    if (correctAnswersCount >= 10) {
      alert(
        `Congratulations! You reached 10 correct answers. Quiz finished! Your final score is ${correctAnswersCount}/${totalQuestions}.`
      );
      window.location.reload();
      disableAllQuizInteraction();
    } else if (questionsAnsweredCount === totalQuestions) {
      alert(
        `You have answered all the questions. Quiz finished! Your final score is ${correctAnswersCount}/${totalQuestions}.`
      );
      window.location.reload();
      disableAllQuizInteraction();
    } else if (minutes === 0 && seconds === 0 && timerInterval) {
      alert("Time's up! Quiz finished.");
      window.location.reload();
      disableAllQuizInteraction();
    }
  }

  // JS3 - Week 3
  function disableAllQuizInteraction() {
    const answerButtons = document.querySelectorAll(".answer-button");
    answerButtons.forEach((button) => {
      button.disabled = true;
    });
    const revealButtons = document.querySelectorAll(".revealButton");
    revealButtons.forEach((button) => {
      button.disabled = true;
    });
    const sortOrderSelect = document.getElementById("sortOrder");
    if (sortOrderSelect) {
      sortOrderSelect.disabled = true;
    }
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.disabled = true;
    }
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
      searchButton.disabled = true;
    }
    clearInterval(timerInterval);
  }

  // JS3 - Week 3
  const timerDisplay = document.getElementById("timerDisplay");
  let timerInterval;
  let seconds = 60;
  let minutes = 0;

  function startTimer() {
    timerInterval = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else {
        clearInterval(timerInterval);
        alert("Time's up! Quiz finished.");
        disableAllQuizInteraction();
        return;
      }

      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      timerDisplay.textContent = `Time left: ${formattedTime}`;
    }, 1000);
  }

  fetchQuizQuestions();
});

let fetchedQuestions;
