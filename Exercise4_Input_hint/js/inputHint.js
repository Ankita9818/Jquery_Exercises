function InputHint(options) {
  this.formSearch = $(options.formName);
  this.searchInput = this.formSearch.find(options.searchInputName);
  this.searchLabel = this.formSearch.find(options.searchLabelName);
  this.classToAdd = options.classToAdd;
}

InputHint.prototype.init = function() {
  this.hintText = this.searchLabel.remove().text();
  this.searchInput.attr('value', this.hintText).addClass(this.classToAdd);
  this.focus();
  this.blur();
};

InputHint.prototype.focus = function() {
  var _this = this;
  this.searchInput.bind('focus',function() {
    if(!_this.searchInput.val() || _this.searchInput.val() == _this.hintText) {
      _this.searchInput.val('').removeClass(_this.classToAdd);
    }
  });
};

InputHint.prototype.blur = function() {
  var _this = this;
  this.searchInput.bind('blur', function() {
    if(!_this.searchInput.val()) {
      _this.searchInput.val(_this.hintText).addClass(_this.classToAdd);
    }
  });
};

$(document).ready(function() {
  var options = {
    formName : "#search",
    searchInputName : "input[type=text]",
    searchLabelName : "label",
    classToAdd : "hint"
  },
    inputHintObject = new InputHint(options);
  inputHintObject.init();
});