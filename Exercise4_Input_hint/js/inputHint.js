function Hint(options) {
  this.formSearch = $(options.formName);
  this.searchInput = this.formSearch.find(options.searchInputName);
  this.searchLabel = this.formSearch.find(options.searchLabelName);
  this.classToAdd = options.classToAdd;
}

Hint.prototype.init = function() {
  var hintText = this.searchLabel.remove().text();
  this.searchInput.attr('value', hintText).addClass(this.classToAdd);
  this.focus();
  this.blur(hintText);
};

Hint.prototype.focus = function() {
  var _this = this;
  this.searchInput.bind('focus',function() {
    $(this).val('').removeClass(_this.classToAdd);
  });
};

Hint.prototype.blur = function(hintText) {
  var _this = this;
  this.searchInput.bind('blur', function() {
    if(!$(this).val()) {
      $(this).val(hintText).addClass(_this.classToAdd);
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
    hintObject = new Hint(options);
  hintObject.init();
});