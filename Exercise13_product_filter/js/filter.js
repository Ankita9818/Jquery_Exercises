function FilterList(options) {
  this.url = options.url;
  this.$filterContainer = options.$filterContainer;
  this.$productContainer = options.$productContainer;
}

FilterList.prototype.init = function() {
  this.loadJsonData();
  this.createPaginationBar();
};

//Function to load filter data from json file
FilterList.prototype.loadJsonData = function() {
  var _this = this;
  $.ajax({
    type : 'GET',
    url : this.url,
    dataType : 'json',
    success : function(response) {
      _this.filtersJsonData = response;
      _this.createFilters();
    }
  });
};

//Function to create pagination bar layout
FilterList.prototype.createPaginationBar = function() {
  var paginationBar = $('<div>',{
    'class' : 'paginationBar',
    'data-id' : 'paginationBar'
  });
  paginationBar.insertAfter(this.$productContainer);
};

//Function to create all filters
FilterList.prototype.createFilters = function() {
  var _this = this;
  $.each(this.filtersJsonData, function() {
    _this.createFilterLayout(this);
  })
};

//FUNCTION TO create layout of filters
FilterList.prototype.createFilterLayout = function(filter) {
  this.$filterBox = $('<div>', {
    'class' : 'filter-div',
    'data-name' : 'filter-div'
  });
  this.$filterBox.data('category', filter.filter_name.toLowerCase());
  var $heading = $('<h4>').html(filter.filter_name),
      _this = this;
  this.$filterBox.append($heading);
  switch(filter.filter_type) {
    case 'checkbox' : _this.createCheckboxFilter(filter);
                      break;
    case 'select'   : _this.createSelectFilter(filter);
                      break;
  }
  this.$filterContainer.append(this.$filterBox);
};

//FUnction to create checkboxes
FilterList.prototype.createCheckboxFilter = function(filter) {
  for(var index = 0; index < filter.filter_values.length; index++) {
    var tempLabel = $('<label>', {
      'text' : filter.filter_values[index].toLowerCase(),
      'class' : 'filterElement'
    }),
      data_attr = 'data-' + filter.filter_name.toLowerCase(),
      tempFilter = $('<input>', {
        'type' : 'checkbox',
        'name' : filter.filter_name.toLowerCase(),
        'data-category' : filter.filter_name.toLowerCase(),
        'value' : filter.filter_values[index]
      }).attr(data_attr, filter.filter_values[index]);
      if(filter.filter_values.length == 1) {
        tempFilter.attr(data_attr, (filter.filter_values[index] | 0));
      }
    $(tempLabel).prepend(tempFilter);
    this.$filterBox.append(tempLabel);
  }
};

//Function to create pagination select box
FilterList.prototype.createSelectFilter = function(filter) {
  var tempSelectFilter = $('<select>', {
    'name' : filter.filter_name.toLowerCase(),
    'data-category' : filter.filter_name.toLowerCase()
  });
  for(var index = 0; index < filter.filter_values.length; index++) {
    var tempOptions = $('<option>', {
      'id' : filter.filter_values[index],
      'value' : filter.filter_values[index],
      'text' : filter.filter_values[index]
    });
    tempSelectFilter.append(tempOptions);
  }
  this.$filterBox.append(tempSelectFilter);
};

$(function() {
  var options = {
    $productContainer : $("[data-id='product-container']"),
    $filterContainer : $("[data-id='filter-container']"),
    url : 'json/filter.json'
  },
    filter = new FilterList(options);
  filter.init();
});
