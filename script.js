const configContainer= document.querySelector(".config-container");
const quizContainer= document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const QuestionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer= document.querySelector(".result-container");


// start variable
const quiz_time_limit =10;
let currentTime = quiz_time_limit;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 5;
let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount=0;



//display the quiz result and hide the quiz container
const showQuizResult=()=>{
    quizContainer.style.display="none";
    resultContainer.style.display="block";

    const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`
    document.querySelector(".result-message").innerHTML= resultText;
}

//reset the timer
const resetTimer=()=>{
    clearInterval(timer);
    currentTime=quiz_time_limit;
    timerDisplay.textContent=`${currentTime}s`;
}

//initialize and start the timer for the current question
const startTimer =()=>{
    timer = setInterval(()=>{
        currentTime--;
        timerDisplay.textContent=`${currentTime}s`;

        if(currentTime<=0){
         clearInterval(timer);
         highlightCorrectAnswer();
         nextQuestionBtn.style.visibility = "visible";

         
    //Disable all answer options after one is selected so after the click on one we can't click/select any other
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

        }
    },1000);

}


//this whole func is to fetch randome question based on selected category
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLocaleLowerCase() === quizCategory.toLocaleLowerCase()).questions || [];//this will give us the all question
    
//Show the results if all questions have been used
if(questionIndexHistory.length>= Math.min(categoryQuestions.length, numberOfQuestions)){
    return showQuizResult();
}


    //filter out already asked questions and choose a random one- I have to understand this 
    const availableQuestions = categoryQuestions.filter((_,index) => !questionIndexHistory.includes(index))//filter by leaving this one
    const randomeQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    questionIndexHistory.push(categoryQuestions.indexOf(randomeQuestion));
    return randomeQuestion;
    
}

//highlight the correct answer option and add icon too
const highlightCorrectAnswer = ()=>{
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");

    const iconHTML = `<i class="ri-check-line"></i>`;
    correctOption.insertAdjacentHTML("beforeend",iconHTML);
}

//Handle the user's answer selection
const handleAnswer =(option, answerIndex)=>{
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect? 'correct': 'incorrect');
    clearInterval(timer)

    !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

    // //insert icon based on correctness
    // const iconHTML = (isCorrect ? <i class="ri-check-line"></i> : <i class="ri-close-circle-line"></i>);
    // option.insertAdjacentHTML("beforeend",iconHTML); I couldn't do it I have to ask with someone

    //Disable all answer options after one is selected so after the click on one we can't click/select any other
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
    nextQuestionBtn.style.visibility = "visible";
}

//render the current question and option in the quiz
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();       //[we remove const word here to make in global variable so that we can access throughout the app]
    if (!currentQuestion) return;
    resetTimer();
    startTimer();
    

    //create the ui
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector(".question-text").textContent = currentQuestion.question; // this one is for changing the question in the main 
    QuestionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`

    //create option <li> elements and append them and add click event listeners
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        console.log(index);
        li.addEventListener("click", () => handleAnswer(li, index));
    })
}

//start the quiz and render the random question
const startQuiz=()=>{
    configContainer.style.display="none";
quizContainer.style.display="block";

//update quiz category and no of question
 quizCategory = configContainer.querySelector(".category-option.active").textContent;
 numberOfQuestions = parseInt(configContainer.querySelector(".question-option.active").textContent);
    renderQuestion();
}


//highlight the selected option on click- category or no. of question
document.querySelectorAll(".category-option,.question-option").forEach(option =>{
    option.addEventListener("click", ()=>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
})
//reset the quiz and return to the configuration container
const resetQuiz=()=>{
    resetTimer();
    correctAnswerCount=0;
    questionIndexHistory.length=0;
    configContainer.style.display="block";
    resultContainer.style.display="none";
}


nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click", startQuiz);

