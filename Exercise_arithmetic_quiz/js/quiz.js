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
  this.operatorArray = ['+','-','*','/'];
  this.score = 0;
  this.questionNumber = 0;
  this.correctAnswers = [];
}

Quiz.prototype.init = function() {
  this.askQuestion();
  this.addClickHandler();
};

Quiz.prototype.askQuestion = function() {
  this.$resultDiv.hide();
  this.questionNumber++;
  if(this.questionNumber > this.numberOfQuestions) {
    this.printScore();
  }
  var firstOperand = Math.floor(Math.random() * 20),
    secondOperand = Math.floor(Math.random() * 20),
    operator = this.operatorArray[Math.floor(Math.random() * 4)];
  this.$questionNumber.html(this.questionNumber);
  switch(operator) {
    case '+' : result = firstOperand + secondOperand;
               this.$question.html(firstOperand + ' + ' + secondOperand);
               break;
    case '-' : result = firstOperand - secondOperand;
               this.$question.html(firstOperand + ' - ' + secondOperand);
               break;
    case '*' : result = firstOperand * secondOperand;
               this.$question.html(firstOperand + ' * ' + secondOperand);
               break;
    case '/' : result = firstOperand / secondOperand;
               this.$question.html(firstOperand + ' / ' + secondOperand);
  }
  this.$answerInput.focus();
  this.solutionObject = {
    operand1 : firstOperand,
    operand2 : secondOperand,
    operator : operator,
    correctresult : result
  }
};

Quiz.prototype.addClickHandler = function() {
  var _this = this;
  this.$nextBtn.click(function() {
    if(_this.$answerInput.val() == result) {
      _this.score += 1;
      _this.solutionObject.decision = true;
    }
    else {
      _this.solutionObject.decision = false;
    }
    _this.correctAnswers[_this.questionNumber] = _this.solutionObject;
    _this.$answerInput.val('');
    _this.$score.html('Your Score is ' + _this.score);
    _this.askQuestion();
  });
};

Quiz.prototype.printScore = function() {
  this.$questionBlock.hide();
  this.$resultDiv.show();
  this.$resultDiv.append($('<p>').text('Your Score is ' + this.score));
  this.$resultDiv.append($('<p>').text('Correct Answers for the questions which you answered wrong'));
  for (var index = 1; index <= this.numberOfQuestions; index++) {
    if(!this.correctAnswers[index].decision) {
      var text = 'Question No. ' + index + ' :-> ' + this.correctAnswers[index].operand1 + ' ' +
        this.correctAnswers[index].operator + ' ' + this.correctAnswers[index].operand2 + " = " +
        this.correctAnswers[index].correctresult;
      this.$resultDiv.append($('<p>').text(text));
    }
  }
};

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
    numberOfQuestions: 20
  },
    quiz = new Quiz(options);
  quiz.init();
});