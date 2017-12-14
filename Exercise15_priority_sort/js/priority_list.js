function PriorityListManager(options) {
  this.$priorityList = options.$priorityList;
  this.$allListItems = this.$priorityList.find(options.allListItems);
  this.$initialItems = this.$allListItems.filter(options.priorityAttribute);
  this.initial_item_count = this.$priorityList.attr(options.initialItemCount);
  this.dataPriorityOrder = options.dataPriorityOrder;
}

PriorityListManager.prototype.init = function() {
  this.$linkAll = this.appendLink('all');
  this.$linkLess = this.appendLink('less');
  this.processListItems();
  this.displayInitialItems();
  this.bindClickListeners();
};

//Function which adds data-attribute priority order to all list items
PriorityListManager.prototype.processListItems = function() {
  var _this = this;
  const DEFAULT_PRIORITY = '9999';
  $.each(this.$allListItems, function() {
    if(!$(this).data(_this.dataPriorityOrder)) {
      $(this).data(_this.dataPriorityOrder, DEFAULT_PRIORITY);
    }
  });
};

//Function which binds listeners to links
PriorityListManager.prototype.bindClickListeners = function() {
  var _this = this;
  this.$linkAll.on('click', function() {
    _this.displayAllItems();
  });
  this.$linkLess.on('click', function() {
    _this.displayInitialItems();
  });
};

PriorityListManager.prototype.getInitialItemsToDisplay = function() {
  return this.$allListItems.slice(0, this.initial_item_count);
};

//Function to display Initial Items
PriorityListManager.prototype.displayInitialItems = function() {
  this.sortByPriorityOrder(this.$allListItems);
  this.$initialItemsToShow = this.getInitialItemsToDisplay();
  this.$allListItems.not(this.$initialItemsToShow).hide();
  this.$priorityList.append(this.$initialItemsToShow);
  this.displayLinks(this.$linkLess, this.$linkAll);
};

//Function to display all Items
PriorityListManager.prototype.displayAllItems = function() {
  this.$allListItems.show();
  this.sortAlphabetically(this.$allListItems);
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
    'href' : 'javascript:void(0)',
    'data-id' : linkText,
    'class' : 'link'
  });
  this.$priorityList.after(link);
  return link;
};

//Function which sorts list items
PriorityListManager.prototype.sortByPriorityOrder = function($listItems) {
  var _this = this;
  $listItems.sort(function(elem1, elem2) {
    if(_this.getPriorityOrder(elem1) > _this.getPriorityOrder(elem2)) {
      return 1;
    } else {
      return -1;
    }
  });
};

//Function which sorts list items Alphabetically
PriorityListManager.prototype.sortAlphabetically = function($listItems) {
  var _this = this;
  $listItems.sort(function(elem1, elem2) {
    if(_this.getContent(elem1) > _this.getContent(elem2)) {
      return 1;
    } else {
      return -1;
    }
  });
};

//Function which returns priority value of list item
PriorityListManager.prototype.getPriorityOrder = function(element) {
  return ($(element).data(this.dataPriorityOrder));
};

//Function which returns text of item
PriorityListManager.prototype.getContent = function(element) {
  return ($(element).data('value').toLowerCase());
};

$(function() {
  var options = {
    $priorityList : $('[data-id="priority-sort"]'),
    allListItems : '[data-id="list-item"]',
    priorityAttribute : '[data-priority-order]',
    initialItemCount : 'data-initial-item-count',
    dataPriorityOrder : 'priority-order'
  },
    list = new PriorityListManager(options);
  list.init();
});
