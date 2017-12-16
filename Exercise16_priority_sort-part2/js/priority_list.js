function PriorityListManager(options) {
  this.$containerElement = options.$container;
  this.$priorityList = options.$priorityList;
  this.$allListItems = this.$priorityList.find(options.allListItems);
  this.$initialItems = this.$allListItems.filter(options.priorityAttribute);
  this.initial_item_count = this.$priorityList.attr(options.initialItemCount);
  this.dataPriorityOrder = options.dataPriorityOrder;
  this.visibleAllListItems = 0;
}

PriorityListManager.prototype.DEFAULT_PRIORITY = '9999';

PriorityListManager.prototype.SORTING_CRITERIA = ['Priority-Sort', 'Alphabetic-Sort'];

PriorityListManager.prototype.SORTING_ORDER = ['Ascending', 'Descending'];

PriorityListManager.prototype.init = function() {
  this.appendLinks();
  this.appendHeader();
  this.processListItems();
  this.bindClickListeners();
  this.sortElements();
};

PriorityListManager.prototype.appendLinks = function() {
  this.$linkAll = this.createLink('all');
  this.$linkLess = this.createLink('less');
}

//Function to display create link
PriorityListManager.prototype.createLink = function(linkText) {
  var link = $('<a>', {
    'text' : ('See ' + linkText),
    'href' : 'javascript:void(0)',
    'data-id' : linkText,
    'class' : 'link'
  });
  this.$priorityList.after(link);
  return link;
};

PriorityListManager.prototype.appendHeader = function() {
  this.$headerTab = $('<div>').addClass('header');
  this.addButtons(this.SORTING_CRITERIA, 'sorting-criteria');
  this.addButtons(this.SORTING_ORDER, 'sorting-order');
  this.$priorityList.before(this.$headerTab);
};

PriorityListManager.prototype.addButtons = function(buttonOption, btnGroupName) {
  var _this = this;
  $.each(buttonOption, function(index) {
    _this.createButtonView(this, btnGroupName, index);
  });
};

PriorityListManager.prototype.createButtonView = function(id, btnGroupName, index) {
  var $label = $('<label>', {
    'text' : id,
    'class' : 'btn',
    'for' : id,
    'data-grp' : btnGroupName
  }),
    $radioButton = $('<input />', {
      'type' : 'radio',
      'name' : btnGroupName,
      'value' : id.toUpperCase(),
      'class' : 'btn-radio',
      'data-category' : 'btn',
      'data-id' : id.toLowerCase(),
      'text' : id.toUpperCase(),
      'id' : id
    });
  if(index == 0) {
    $radioButton.prop('checked', true);
  }
  this.$headerTab.append($radioButton);
  this.$headerTab.append($label);
};

//Function which adds data-attribute priority order to all list items
PriorityListManager.prototype.processListItems = function() {
  var _this = this;
  $.each(this.$allListItems, function() {
    if(!$(this).data(_this.dataPriorityOrder)) {
      $(this).data(_this.dataPriorityOrder, _this.DEFAULT_PRIORITY);
    }
  });
};

//Function which binds listeners to links
PriorityListManager.prototype.bindClickListeners = function() {
  var _this = this;
  this.$linkAll.on('click', function() {
    _this.visibleAllListItems = 1;
    _this.displayAllItems();
  });
  this.$linkLess.on('click', function() {
    _this.visibleAllListItems = 0;
    _this.displayInitialItems();
  });
  this.$containerElement.on('click', '[data-category="btn"]', function() {
    _this.sortElements($(this));
  });
};

//Function to sort List elements as per checked buttons
PriorityListManager.prototype.sortElements = function(sortingELement) {
  var checkedCriteria = $('[name="sorting-criteria"]:checked'),
      checkedOrder = $('[name="sorting-order"]:checked');;
  this.$allListItems.show();
  if(checkedCriteria.attr('data-id') == 'alphabetic-sort') {
    this.sortAlphabetically(this.$allListItems,checkedOrder.attr('data-id'));
  } else {
    this.sortByPriorityOrder(this.$allListItems,checkedOrder.attr('data-id'));
  }
  this.displayItems();
};

//Function which displays Items as per chosen link
PriorityListManager.prototype.displayItems = function() {
  (this.visibleAllListItems) ? this.displayAllItems() : this.displayInitialItems();
};

//Function to display Initial Items
PriorityListManager.prototype.displayInitialItems = function() {
  this.$initialItemsToShow = this.getInitialItemsToDisplay();
  this.$allListItems.not(this.$initialItemsToShow).hide();
  this.$priorityList.append(this.$initialItemsToShow);
  this.displayLinks(this.$linkLess, this.$linkAll);
};

//Function which returns items specified by initial item count
PriorityListManager.prototype.getInitialItemsToDisplay = function() {
  return this.$allListItems.slice(0, this.initial_item_count);
};

//Function to display all Items
PriorityListManager.prototype.displayAllItems = function() {
  this.$allListItems.show();
  this.$priorityList.append(this.$allListItems);
  this.displayLinks(this.$linkAll, this.$linkLess);
};

//Function to display appropriate link
PriorityListManager.prototype.displayLinks = function(hiddenLink, visibleLink) {
  hiddenLink.hide();
  visibleLink.show();
};

//Function which sorts list items
PriorityListManager.prototype.sortByPriorityOrder = function($listItems, order) {
  var _this = this;
  $listItems.sort(function(elem1, elem2) {
    if(_this.getPriorityOrder(elem1) > _this.getPriorityOrder(elem2)) {
      return (order == 'ascending') ? 1 : -1;
    } else {
      return (order == 'ascending') ? -1 : 1;
    }
  });
};

//Function which sorts list items Alphabetically
PriorityListManager.prototype.sortAlphabetically = function($listItems, order) {
  var _this = this;
  $listItems.sort(function(elem1, elem2) {
    if(_this.getContent(elem1) > _this.getContent(elem2)) {
      return (order == 'ascending') ? 1 : -1;
    } else {
      return (order == 'ascending') ? -1 : 1;
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
    dataPriorityOrder : 'priority-order',
    $container : $('.container')
  },
    list = new PriorityListManager(options);
  list.init();
});
