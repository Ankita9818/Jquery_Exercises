//Class Question
function Question(maxNumber) {
  this.questionNumber = 0;
  this.maxNumber = maxNumber;
}

//Function to get a random number
Question.prototype.getRandomNumber = function(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
};

//Function to get operands for the question
Question.prototype.getOperands = function() {
  this.questionNumber++;
    return {
      firstOperand : this.getRandomNumber(this.maxNumber),
      secondOperand : this.getRandomNumber(this.maxNumber),
      operator : OPERATOR_ARRAY[this.getRandomNumber(OPERATOR_ARRAY.length)]
    };
};

//Function which returns the question
Question.prototype.getQuestion = function() {
  var operands = this.getOperands(),
  result;
  switch(operands.operator) {
    case '+' : result = operands.firstOperand + operands.secondOperand;
               break;
    case '-' : result = operands.firstOperand - operands.secondOperand;
               break;
    case '*' : result = operands.firstOperand * operands.secondOperand;
               break;
    case '/' : result = operands.firstOperand / operands.secondOperand;
  }
  return {
    operands : operands,
    correctResult : result
  };
};

//Class Quiz
function Quiz(options) {
  this.$quizId = options.$quizId;
  this.$questionBlock = this.$quizId.find(options.$questionBlock);
  this.$question = this.$quizId.find(options.$question);
  this.$nextBtn = this.$quizId.find(options.$nextBtn);
  this.$answerInput = this.$quizId.find(options.$answerInput);
  this.$score = this.$quizId.find(options.$score);
  this.$questionNumber = this.$quizId.find(options.$questionNumber);
  this.$resultDiv = this.$quizId.find(options.$resultDiv);
  this.numberOfQuestions = options.numberOfQuestions;
  this.currentScore = 0;
  this.correctAnswers = [];
  this.maxNumber = options.maximumNumber;
  this.marks = options.marks;
}

//Function to initiate quiz
Quiz.prototype.start = function() {
  this.createQuestions();
  this.displayQuestionOrResult();
  this.evaluateResponse();
};

//Function which creates a question object
Quiz.prototype.createQuestions = function() {
  this.questionObject = new Question(this.maxNumber);
};

//Function which displays question and finally result screen
Quiz.prototype.displayQuestionOrResult = function() {
  (this.questionObject.questionNumber < this.numberOfQuestions) ? this.askQuestion() : this.displayFinalScreen();
};

Quiz.prototype.askQuestion = function() {
  this.question = this.questionObject.getQuestion();
  this.$questionNumber.html(this.questionObject.questionNumber);
  this.$question.html(this.question.operands.firstOperand + ' ' + this.question.operands.operator +
    ' ' + this.question.operands.secondOperand);
  this.$answerInput.focus();
};

//Function which calculates score and gets next question
Quiz.prototype.evaluateResponse = function() {
  var _this = this;
  this.$nextBtn.click(function() {
    if(_this.question.decision = (_this.$answerInput.val() == _this.question.correctResult)) {
      _this.currentScore += _this.marks;
    }
    _this.correctAnswers.push(_this.question);
    _this.$answerInput.val('');
    _this.$score.html('Your Score is ' + _this.currentScore);
    _this.displayQuestionOrResult();
  });
};

//Function to display the final score to user along with correct answers for the questions answered wrong
Quiz.prototype.displayFinalScreen = function() {
  this.$questionBlock.hide();
  this.$resultDiv.show().append(this.$score);
  this.$resultDiv.append($('<p>').text('Correct Answers for the questions which you answered wrong'));
  for (var index = 0; index < this.numberOfQuestions; index++) {
    if(!this.correctAnswers[index].decision) {
      var text = 'Question No. ' + (index + 1) + ' :-> ' + this.correctAnswers[index].operands.firstOperand + ' ' +
        this.correctAnswers[index].operands.operator + ' ' + this.correctAnswers[index].operands.secondOperand +
        " = " + this.correctAnswers[index].correctResult;
      this.$resultDiv.append($('<p>').text(text));
    }
  }
};

//Constant for operators
const OPERATOR_ARRAY = ['+','-','*','/'];
$(function() {
  var options = {
    $quizId : $('#quiz'),
    $questionBlock : '.questionBlock',
    $question : '.question',
    $nextBtn : '.next',
    $answerInput : '.answer',
    $score : '.score',
    $questionNumber : '.qno',
    $resultDiv : '.result',
    numberOfQuestions: 20,
    maximumNumber : 20,
    marks : 4
  },
    quiz = new Quiz(options);
  quiz.start();
});

