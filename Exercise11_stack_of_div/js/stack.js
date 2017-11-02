function StackContainer() {
  this.stackItemCount = 1;
}

StackContainer.prototype.init = function() {
  this.createStack();
  this.addEventHandler();
};

StackContainer.prototype.createStack = function(){
  this.$addButton = $('<button>', {
    'id':'addBtn',
     text: 'click to add item'
   });
  this.$stack_container = $('<div>', {
   'id': 'container' }).append(this.$addButton);
  $('body').append($(this.$stack_container)).prepend(this.$addButton);
};

StackContainer.prototype.pushDiv = function() {
  this.$stack_item = $('<div>', {
   'class': 'stack_item'
  });
  this.$stack_item.text('item' + this.stackItemCount++)
  .prependTo(this.$stack_container);
};

StackContainer.prototype.popStackItem = function(item) {
  $('.highlight').removeClass('highlight');
  item.addClass('highlight');
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

$(function() {
  var stackContainer = new StackContainer();
  stackContainer.init();
});