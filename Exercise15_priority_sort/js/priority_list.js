function PriorityListManager(options) {
  this.$priorityList = options.$priorityList;
  this.$allListItems = this.$priorityList.find('li');
  this.$initialItems = this.$allListItems.filter(options.priorityAttribute);
  this.initial_item_count = this.$priorityList.attr(options.initialItemCount);
}

PriorityListManager.prototype.init = function() {
  this.$linkAll = this.appendLink('all');
  this.$linkLess = this.appendLink('less');
  this.displayInitialItems();
  this.bindCLickListeners();
};

//Function which binds listeners to links
PriorityListManager.prototype.bindCLickListeners = function() {
  var _this = this;
  this.$linkAll.on('click', function() {
    _this.displayAllItems();
  });
  this.$linkLess.on('click', function() {
    _this.displayInitialItems();
  });
};

//Function to display Initial Items
PriorityListManager.prototype.displayInitialItems = function() {
  this.sortItems(this.$initialItems, true);
  this.$initialItemsToShow = this.$initialItems.slice(0, this.initial_item_count);
  this.$allListItems.not(this.$initialItemsToShow).hide();
  this.$priorityList.append(this.$initialItemsToShow);
  this.displayLinks(this.$linkLess, this.$linkAll);
};

//Function to display all Items
PriorityListManager.prototype.displayAllItems = function() {
  this.$allListItems.show();
  this.sortItems(this.$allListItems, false);
  this.$priorityList.append(this.$allListItems);
  this.displayLinks(this.$linkAll, this.$linkLess);
};

//Function to display appropriate link
PriorityListManager.prototype.displayLinks = function(hiddenLink, visibleLink) {
  hiddenLink.hide();
  visibleLink.show();
};

//Function to display create link
PriorityListManager.prototype.appendLink = function(linkText) {
  var link = $('<a>', {
    'text' : ('See ' + linkText),
    'href' : '#',
    'data-id' : linkText,
    'class' : 'link'
  });
  this.$priorityList.after(link);
  return link;
};

//Function which sorts list items
PriorityListManager.prototype.sortItems = function($listItems, priorityFlag) {
  var _this = this;
  $listItems.sort(function(elem1, elem2) {
    var sortCondition = (priorityFlag) ?
       _this.getPriorityOrder(elem1) > _this.getPriorityOrder(elem2) :
       _this.getContent(elem1) > _this.getContent(elem2);
    if(sortCondition) {
      return 1;
    } else {
      return -1;
    }
  });
};

//Function which returns priority value of list item
PriorityListManager.prototype.getPriorityOrder = function(element) {
  return ($(element).attr('data-priority-order'));
};

//Function which returns text of item
PriorityListManager.prototype.getContent = function(element) {
  return ($(element).text().toLowerCase());
};

$(function() {
  var options = {
    $priorityList : $('[data-id="priority-sort"]'),
    priorityAttribute : '[data-priority-order]',
    initialItemCount : 'data-initial-item-count'
  },
    list = new PriorityListManager(options);
  list.init();
});
