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
  this.score = 0;
  this.correctAnswers = [];
  this.questionObject = new Question(options.maximumNumber);
}

//Function to initiate quiz
Quiz.prototype.init = function() {
  this.displayQuestion();
  this.addClickHandler();
};

//Function which gets a question and displays it
Quiz.prototype.displayQuestion = function() {
  this.$resultDiv.hide();
  this.question = this.questionObject.getQuestion();
  if(this.questionObject.questionNumber > this.numberOfQuestions) {
    this.displayScore();
  }
  this.$questionNumber.html(this.questionObject.questionNumber);
  this.$question.html(this.question.operands.firstOperand + ' ' + this.question.operands.operator
    + ' ' + this.question.operands.secondOperand);
  this.$answerInput.focus();
};

//Function which calculates score and gets next question
Quiz.prototype.addClickHandler = function() {
  var _this = this;
  this.$nextBtn.click(function() {
    if(_this.$answerInput.val() == _this.question.correctResult) {
      _this.score += 1;
      _this.question.decision = true;
    }
    else {
      _this.question.decision = false;
    }
    _this.correctAnswers.push(_this.question);
    _this.$answerInput.val('');
    _this.$score.html('Your Score is ' + _this.score);
    _this.displayQuestion();
  });
};

//Function to display the score to user along with correct answers for the questions answered wrong
Quiz.prototype.displayScore = function() {
  this.$questionBlock.hide();
  this.$resultDiv.show().append($('<p>').text('Your Score is ' + this.score));
  this.$resultDiv.append($('<p>').text('Correct Answers for the questions which you answered wrong'));
  for (var index = 0; index < this.numberOfQuestions; index++) {
    if(!this.correctAnswers[index].decision) {
      var text = 'Question No. ' + (index + 1) + ' :-> ' + this.correctAnswers[index].operands.firstOperand + ' ' +
        this.correctAnswers[index].operands.operator + ' ' + this.correctAnswers[index].operands.secondOperand
        + " = " + this.correctAnswers[index].correctResult;
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
    maximumNumber : 20
  },
    quiz = new Quiz(options);
  quiz.init();
});
