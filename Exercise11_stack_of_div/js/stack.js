function StackContainer(options) {
  this.stackItemCount = 1;
  this.highlightClass = options.highlightClass;
}

StackContainer.prototype.init = function() {
  this.createStack();
  this.addEventHandler();
};

StackContainer.prototype.createStack = function() {
  this.createStackViewItems();
  $('body').append($(this.$stack_container)).prepend(this.$addButton);
};

StackContainer.prototype.createStackViewItems = function() {
  this.$addButton = $('<button>', {
    'id':'addBtn',
     text: 'click to add item'
   });
  this.$stack_container = $('<div>', {
    'id': 'container'
  });
  this.$stack_item = $('<div>', {
   'class': 'stack_item'
  });
}

StackContainer.prototype.pushDiv = function() {
  this.$stack_item.clone()
    .text('item' + this.stackItemCount++)
    .prependTo(this.$stack_container);
};

StackContainer.prototype.popStackItem = function(item) {
  this.$highlightedItem = $('.' + this.highlightClass);
  this.$highlightedItem.removeClass(this.highlightClass);
  item.addClass(this.highlightClass);
  if(!item.prevAll().length) {
    item.fadeOut(300, function() {
      console.log('item popped');
      item.remove();
    });
  }
};

StackContainer.prototype.addEventHandler = function() {
  var _this = this;
  this.$addButton.on('click', function() {
    _this.pushDiv();
  });
  this.$stack_container.on('click', 'div.stack_item', function() {
    _this.popStackItem($(this));
  });
};

$(function(options) {
  var options = {
    highlightClass : 'highlight'
  },
    stackContainer = new StackContainer(options);
  stackContainer.init();
});