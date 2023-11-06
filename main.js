document.addEventListener("DOMContentLoaded", function () {
  const loginSection = document.querySelector(".log_in");
  const quizSection = document.querySelector(".quiz_interface");
  const congratzSection = document.querySelector("#congratz");
  const usernameInput = document.querySelector(".username");
  const startButton = document.querySelector(".login_button");
  const nameSpan = document.querySelector("#name");
  const questionDiv = document.querySelector(".question");
  const questionNumberSpan = document.querySelector("#qno");
  const questionTextSpan = document.querySelector("#ques");
  const options = document.querySelectorAll(".option");
  const optionDiv = document.querySelector(".options");
  const errorMessageBox = document.querySelector("#error_msg");
  const submitButton = document.querySelector("#submit");
  const congratzMsg = document.querySelector("#congratz_msg");
  const congratzUsername = document.querySelector("#c_username");
  const finalScore = document.querySelector("#final_score");
  const retakeButton = document.querySelector("#retake");
  const exitButton = document.querySelector("#exit");
  const logoutLink = document.querySelector(".logout");

  const timerElement = document.querySelector(".timer");
  let totalTime = 10; // 10 minutes in seconds
  let timerInterval;

  document.getElementById("timeUpModal").style.display = "none";

  function updateTimerDisplay() {
    const minutes = String(Math.floor(totalTime / 60)).padStart(2, "0");
    const seconds = String(totalTime % 60).padStart(2, "0");
    timerElement.innerHTML = `<span id="minutes">${minutes}</span>:<span id="seconds">${seconds}</span>`;
  }

  function startTimer() {
    timerInterval = setInterval(function () {
      if (totalTime > 0) {
        totalTime--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        // Hide the questions
        questionDiv.style.display = "none";
        // Hide the options
        optionDiv.style.display = "none";
        // Hide the submit button
        submitButton.style.display = "none";
        // Show the time-up modal
        document.getElementById("timeUpModal").style.display = "block";
        document.getElementsByClassName("modal").style.display = "block";
      }
    }, 1000); // Update every second
  }

  // Handle the "OK" button click to close the modal
  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("timeUpModal").style.display = "none";
    showResult(); // to display the score after click on "ok" in the dialog box
  });

  logoutLink.addEventListener("click", logout);

  // Function to handle the logout action
  function logout() {
    // Clear the username input field
    usernameInput.value = "";

    currentQuestionIndex = 0;
    score = 0;

    // Clear the previous interval, if any
    clearInterval(timerInterval);
    totalTime = 602; // Reset the timer to 10 minutes in seconds(because 2 sec difference after logout)
    updateTimerDisplay(); // Update the timer display

    // Reset step progress bar
    const progressSteps = document.querySelectorAll(".progress-step");
    progressSteps.forEach((step) => {
      step.classList.remove("correct-step", "wrong-step");
    });

    // Reset options
    options.forEach((option) => {
      option.classList.remove("selected", "correct", "wrong", "hover");
    });

    // Hide the quiz and congratz sections
    quizSection.style.display = "none";
    congratzSection.style.display = "none";

    // Show the login section
    loginSection.style.display = "block";

    // Start the timer again
    startTimer();
  }

  let currentQuestionIndex = 0;
  let score = 0;

  const quizData = [
    {
      question: 'Which of the following words is a synonym for "ubiquitous"?',
      options: ["Scarce", "Abundant", "Pervasive", "Sporadic"],
      correctAnswer: 2,
    },
    {
      question:
        "Which programming language is known for its use in artificial intelligence and data science?",
      options: ["Java", "Python", "C++", "Ruby"],
      correctAnswer: 1,
    },
    {
      question:
        "If all cats are mammals, and Fluffy is a cat, what can you conclude?",
      options: [
        "Fluffy is not a mammal.",
        "Fluffy is a mammal.",
        "All mammals are cats.",
        "Some mammals are cats.",
      ],
      correctAnswer: 1,
    },
    {
      question: "Who led the Bolshevik Revolution in Russia in 1917?",
      options: [
        "Nicholas II",
        "Joseph Stalin",
        "Leon Trotsky",
        "Vladimir Lenin",
      ],
      correctAnswer: 3,
    },
    {
      question:
        "Which data structure follows the Last-In-First-Out (LIFO) principle?",
      options: ["Queue", "Stack", "Linked List", "Array"],
      correctAnswer: 1,
    },
    {
      question: 'What is the opposite of "expand"?',
      options: ["Shrink", "Increase", "Stretch", "Enlarge"],
      correctAnswer: 0,
    },
    {
      question:
        "What is the phenomenon where a wave changes direction as it passes from one medium to another?",
      options: ["Diffraction", "Reflection", "Refraction", "Dispersion"],
      correctAnswer: 2,
    },
    {
      question:
        "How many degrees are in the sum of the interior angles of a hexagon?",
      options: ["120 degrees", "180 degrees", "90 degrees", "720 degrees"],
      correctAnswer: 3,
    },
    {
      question: 'Who painted the famous artwork "Starry Night"?',
      options: [
        "Vincent van Gogh",
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Michelangelo",
      ],
      correctAnswer: 0,
    },
    {
      question:
        "In a logic puzzle, if Ann is taller than Bob, and Bob is shorter than Carla, who is the tallest?",
      options: ["Ann", "Bob", "Carla", "Not enough information"],
      correctAnswer: 2,
    },
  ];

  // Hide quiz and congratz sections initially
  quizSection.style.display = "none";
  congratzSection.style.display = "none";

  startButton.addEventListener("click", startQuiz);

  function startQuiz() {
    // Clear the previous interval, if any
    clearInterval(timerInterval);
    // Call startTimer to begin the countdown
    startTimer();
    const username = usernameInput.value;
    if (username.trim() === "") {
      // Display an alert message if the username is empty
      alert("Please enter a Username");
      return;
    }

    // Hide the login section and show the quiz section
    loginSection.style.display = "none";
    quizSection.style.display = "block";

    // Initialize the quiz
    currentQuestionIndex = 0;
    score = 0;

    // Update the username displayed in the quiz section
    nameSpan.textContent = `${"Welcome! " + username}`;

    // Display the first question
    showQuestion(currentQuestionIndex);
  }

  function showQuestion(index) {
    const question = quizData[index];
    questionNumberSpan.textContent = `${index + 1 + ". "}`;
    questionTextSpan.textContent = question.question;

    for (let i = 0; i < options.length; i++) {
      options[i].textContent = question.options[i];
      options[i].classList.remove("selected", "correct", "wrong", "hover");
    }

    // Handle option click events
    options.forEach((option, i) => {
      option.addEventListener("click", () => {
        const selectedAnswer = i;
        options.forEach((opt, j) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // Disable the 'Submit' button until an option is selected
        submitButton.disabled = false;
      });
    });
  }

  errorMessageBox.style.display = "none";

  // Add event listener for the "Submit" button
  submitButton.addEventListener("click", () => {
    const selectedAnswer = getSelectedOption();
    if (selectedAnswer === undefined) {
      // Display the error message
      errorMessageBox.style.display = "block";
      return;
    } else {
      // Hide the error message
      errorMessageBox.style.display = "none";
    }

    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
      options[selectedAnswer].classList.remove("selected");

      // Highlight the correct option in green
      options[correctAnswer].classList.add("correct");
      score++;

      // Add a class to the corresponding step progress bar item for a correct answer
      const progressStep = document.querySelector(
        `#qn${currentQuestionIndex + 1}`
      );
      progressStep.classList.add("correct-step");
    } else {
      // Highlight the selected option in red if it is wrong
      options[selectedAnswer].classList.add("wrong");

      options[selectedAnswer].classList.remove("selected");
      // Highlight the selected option in green if it is correct
      options[correctAnswer].classList.add("correct");

      // Add a class to the corresponding step progress bar item for a wrong answer
      const progressStep = document.querySelector(
        `#qn${currentQuestionIndex + 1}`
      );
      progressStep.classList.add("wrong-step");
    }

    // Disable all options
    options.forEach((option) => option.classList.add("hover"));
    submitButton.disabled = true;

    // Delay moving to the next question to allow time for feedback
    setTimeout(() => {
      nextQuestion();
    }, 1200);
  });

  function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
      // Display the next question
      showQuestion(currentQuestionIndex);
      submitButton.disabled = false; // Re-enable the "Submit" button for the next question
    } else {
      // End of the quiz
      showResult();
    }
  }

  function showResult() {
    clearInterval(timerInterval); // Stop the timer
    quizSection.style.display = "none";
    congratzSection.style.display = "block";

    let message = ""; // Initialize an empty message

    // Determine the message based on the score
    if (score === 10) {
      message = "Champion!!!🏆";
    } else if (score === 9) {
      message = "Master!!!🎓";
    } else if (score === 8) {
      message = "Smart!!!😎";
    } else if (score === 7) {
      message = "Well done!!!👌";
    } else if (score === 6) {
      message = "Good!!!👍";
    } else {
      message = "Try harder!!!😐";
    }

    if (currentQuestionIndex < quizData.length) {
      //const percentageScore = (score / quizData.length) * 100;
      //finalScore.textContent = percentageScore.toFixed(2) + "%";

      // Last question, show the user's score
      finalScore.textContent = score + " out of " + quizData.length;

      // Display the special message based on score
      finalScore.insertAdjacentHTML(
        "afterend",
        `<p id="scoreMessage">${message}</p>`
      );
    } else {
      // Display the special message based on score
      finalScore.insertAdjacentHTML(
        "afterend",
        `<p id="scoreMessage">${message}</p>`
      );
      // Last question, show the user's score
      finalScore.textContent = score + " out of " + quizData.length;
    }
    congratzMsg.textContent = "Quiz Completed...";
    congratzUsername.textContent = `${usernameInput.value}!!!`;
  }

  retakeButton.addEventListener("click", restartQuiz);
  exitButton.addEventListener("click", exitQuiz);

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    // Clear the previous interval, if any
    clearInterval(timerInterval);
    totalTime = 600; // Reset the timer to 10 minutes in seconds
    updateTimerDisplay(); // Update the timer display

    // Reset step progress bar
    const progressSteps = document.querySelectorAll(".progress-step");
    progressSteps.forEach((step) => {
      step.classList.remove("correct-step", "wrong-step");
    });

    // Reset options
    options.forEach((option) => {
      option.classList.remove("selected", "correct", "wrong", "hover");
    });

    // Clear the final score
    finalScore.textContent = "";

    const scoreMessage = document.getElementById("scoreMessage");
    if (scoreMessage) {
      scoreMessage.remove();
    }

    // Show the first question
    showQuestion(currentQuestionIndex);

    congratzSection.style.display = "none";
    loginSection.style.display = "none";
    quizSection.style.display = "block";

    // Start the timer again
    startTimer();
  }

  function exitQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    // Clear the previous interval, if any
    clearInterval(timerInterval);
    totalTime = 603; // Reset the timer to 10 minutes in seconds
    updateTimerDisplay(); // Update the timer display

    // Reset step progress bar
    const progressSteps = document.querySelectorAll(".progress-step");
    progressSteps.forEach((step) => {
      step.classList.remove("correct-step", "wrong-step");
    });

    // Reset options
    options.forEach((option) => {
      option.classList.remove("selected", "correct", "wrong", "hover");
    });

    // Clear the final score
    finalScore.textContent = "";
    //clear the username
    nameSpan.textContent = "";

    const scoreMessage = document.getElementById("scoreMessage");
    if (scoreMessage) {
      scoreMessage.remove();
    }

    congratzSection.style.display = "none";
    loginSection.style.display = "block";
    usernameInput.value = "";

    // Start the timer again
    startTimer();
  }

  function getSelectedOption() {
    for (let i = 0; i < options.length; i++) {
      if (options[i].classList.contains("selected")) {
        return i;
      }
    }
    return undefined;
  }
});
