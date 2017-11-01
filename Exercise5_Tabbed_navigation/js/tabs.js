function Tabs(options) {
  this.$divModule = options.divmodule;
  this.classToAdd = options.classToAdd;
}

Tabs.prototype.init = function() {
  this.$divModule.hide();
  this.$newList = $('<ul/>', {
    'class' : 'bordered-tab'
  });
  this.$newList.insertBefore(this.$divModule.eq(0));
  this.createList();
  this.handleClick();
  this.$divModule.eq(0).show();                        //To show the first tab by default
  this.$newList.find('li:first').addClass(this.classToAdd);
};

Tabs.prototype.createList = function() {
  var _this = this;
  this.$divModule.each(function() {
    var $currentDiv = $(this);
    $('<li/>', {
      text : $currentDiv.find('h2').text(),
    })
      .data('relatedDiv', $currentDiv)
      .appendTo(_this.$newList);
  });
};

Tabs.prototype.handleClick = function() {
  var _this = this;
  this.$newList.find('li').click(function() {
    var $currentItem = $(this);
    _this.$divModule.hide();
    $currentItem.data('relatedDiv').show();
    $currentItem.addClass(_this.classToAdd)
      .siblings().removeClass(_this.classToAdd);
  });
};

$(function() {
  var options = {
    divmodule : $('div.module'),
    classToAdd : 'current'
  },
    tabbed_nav = new Tabs(options);
  tabbed_nav.init();
});