function Tab(option) {
  this.$modulesDiv = option.$modulesDiv;
  this.currentClass = option.currentClass;
}

Tab.prototype.init = function() {
  this.$modulesDiv.hide();
  this.$modulesList = $('<ul/>', {
    'class' : 'bordered-tab'
  });
  this.$modulesList.insertBefore(this.$modulesDiv.eq(0));
  this.createList();
  this.addClickHandler();
  this.$modulesDiv.eq(0).show();                        //To show the first tab by default
  this.$modulesList.find('li:first').addClass(this.currentClass);
};

Tab.prototype.createList = function() {
  var _this = this;
  this.$modulesDiv.each(function() {
    var $currentModule = $(this);
    $('<li/>', {
      text : $currentModule.find('h2').text(),
    })
      .data('detail', $currentModule)
      .appendTo(_this.$modulesList);
  });
};

Tab.prototype.addClickHandler = function() {
  var _this = this;
  this.$modulesList.find('li').click(function() {
    var $currentItem = $(this);
    _this.$modulesDiv.hide();
    $currentItem.data('detail').show();
    $currentItem.addClass(_this.currentClass)
      .siblings().removeClass(_this.currentClass);
  });
};

$(function() {
  var option = {
    $modulesDiv : $('div.module'),
    currentClass : 'current'
  },
    tabbedNavigation = new Tab(option);
  tabbedNavigation.init();
});