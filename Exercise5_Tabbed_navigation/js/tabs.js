function Tab(option) {
  this.$module = option.$module;
  this.className = option.className;
}

Tab.prototype.init = function() {
  this.$module.hide();
  this.$list = $('<ul/>', {
    'class' : 'bordered-tab'
  });
  this.$list.insertBefore(this.$module.eq(0));
  this.createList();
  this.addClickHandler();
  this.$module.eq(0).show();                        //To show the first tab by default
  this.$list.find('li:first').addClass(this.className);
};

Tab.prototype.createList = function() {
  var _this = this;
  this.$module.each(function() {
    var $currentModule = $(this);
    $('<li/>', {
      text : $currentModule.find('h2').text(),
    })
      .data('detail', $currentModule)
      .appendTo(_this.$list);
  });
};

Tab.prototype.addClickHandler = function() {
  var _this = this;
  this.$list.find('li').click(function() {
    var $currentItem = $(this);
    _this.$module.hide();
    $currentItem.data('detail').show();
    $currentItem.addClass(_this.className)
      .siblings().removeClass(_this.className);
  });
};

$(function() {
  var option = {
    $module : $('div.module'),
    className : 'current'
  },
    tabbedNavigation = new Tab(option);
  tabbedNavigation.init();
});