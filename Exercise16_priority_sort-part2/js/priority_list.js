function PriorityListManager(options) {
  this.$containerElement = options.$container;
  this.$priorityList = options.$priorityList;
  this.$allListItems = this.$priorityList.find(options.allListItems);
  this.$initialItems = this.$allListItems.filter(options.priorityAttribute);
  this.initial_item_count = this.$priorityList.attr(options.initialItemCount);
  this.dataPriorityOrder = options.dataPriorityOrder;
  this.visibleAllListItems = 0;
}

PriorityListManager.prototype.DEFAULT_PRIORITY = Number.MAX_SAFE_INTEGER;

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
};

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
  }),
    $radioButton = $('<input />', {
      'type' : 'radio',
      'name' : btnGroupName,
      'data-grp' : btnGroupName,
      'value' : id.toUpperCase(),
      'class' : 'btn-radio',
      'data-category' : 'btn',
      'data-id' : id.toLowerCase(),
      'text' : id.toUpperCase(),
      'id' : id
    });
  if(!index) {
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
  var checkedCriteria = $('[data-grp="sorting-criteria"]:checked').attr('data-id'),
      checkedOrder = $('[data-grp="sorting-order"]:checked').attr('data-id');
  this.$allListItems.show();
  if(checkedCriteria == this.convertToLowerCase(this.SORTING_CRITERIA[0])) {
    this.sortBySpecifiedProperty(this.$allListItems, checkedOrder, this.getPriorityOrder);
  } else {
    this.sortBySpecifiedProperty(this.$allListItems, checkedOrder, this.getContent);
  }
  this.displayItems();
};

//Function which displays Items as per chosen link
PriorityListManager.prototype.displayItems = function() {
  this.visibleAllListItems ? this.displayAllItems() : this.displayInitialItems();
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

PriorityListManager.prototype.sortBySpecifiedProperty = function($listItems, sortingOrder, getPropertyFunction) {
  var _this = this;
  $listItems.sort(function(elem1, elem2) {
    if(getPropertyFunction(elem1) > getPropertyFunction(elem2)) {
      return (sortingOrder == _this.convertToLowerCase(_this.SORTING_ORDER[0])) ? 1 : -1;
    } else {
      return (sortingOrder == _this.convertToLowerCase(_this.SORTING_ORDER[0])) ? -1 : 1;
    }
  });
};

PriorityListManager.prototype.convertToLowerCase = function(string) {
  return string.toLowerCase();
};

//Function which returns priority value of list item
PriorityListManager.prototype.getPriorityOrder = function(element) {
  return ($(element).data('priority-order'));
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
    $container : $('[data-id="container"]')
  },
    list = new PriorityListManager(options);
  list.init();
});
