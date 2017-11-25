//constructor for Products List
function ProductList(options) {
  this.$productContainer = options.$productContainer;
  this.$filterBox = options.$filterBox.find(options.filterSelector);
  this.productSelector = options.productSelector;
  this.url = options.url;
  this.imageFolder  = options.imageFolder;
  this.allProducts = [];
  this.selectedPage = 1;
  this.currentViewableProducts = [];
  this.$brandFilter = options.$brandFilter;
  this.$colorFilter = options.$colorFilter;
  this.$availability = options.$availabilityFilter;
  this.$paginationBar = options.$paginationBar;
  this.$paginationElement = options.$paginationElement;
  this.highlightClass = options.highlightClass;
  this.$sortBy = options.$sortBy;
}

ProductList.prototype.hashUrlSelectedFiltersRegEx =
  /^\?brands=((0|1)+)&colors=((0|1)+)&availability=(0|1)&sortingCriteria=(\w+)&pagination=(\d+)&page=(\d+)$/;

//Function to initiate all other functions
ProductList.prototype.init = function() {
  this.loadJsonData();
  this.addChangeEventHandler();
  this.checkCurrentSelectionURL();
};

//Function to get products data from json file
ProductList.prototype.loadJsonData = function() {
  var _this = this;
  $.ajax({
    type : 'GET',
    url : this.url,
    dataType : 'json',
    success : function(response) {
      $.each(response, function(index) {
        var product = _this.buildProduct(index, this);
        _this.allProducts.push(product);
      });
      _this.displayProducts(_this.allProducts);
    }
  });
};

//Function to store all products
ProductList.prototype.buildProduct = function(index, product) {
  var productObject = $('<div>', {
    'id' : index,
    'data-id' : index,
    'data-type' : 'productimage',
    'data-brands' : product.brand,
    'data-colors' : product.color,
    'data-availability' : product.sold_out
  }),
    productImageObject = $('<img>', {
      'src' : this.imageFolder + product.url
    });
  productObject.append(productImageObject);
  return productObject;
};

//Function to display all products
ProductList.prototype.displayProducts = function(products) {
  this.$productContainer.append(products);
  this.paginateAllProducts(products);
};

//Function to paginate all products at beginning
ProductList.prototype.paginateAllProducts = function(products) {
  this.filteredElements = products;
  this.bindPageClickEvent();
  this.createPaginationBar(products);
  this.$paginationElement.trigger('change');
};

//Function to handle change event
ProductList.prototype.addChangeEventHandler = function() {
  var _this = this;
  this.$filterBox.on("change", function(event) {
    _this.highlightSelectedPage();
    _this.filteredElements = _this.$productContainer.find(_this.productSelector);
    _this.filteredElements.hide();
    _this.filterProducts();
    _this.createPaginationForCheckedFilter(event);
    _this.applySorting();     // to sort filtered products
    _this.applyPagination();
    _this.showProducts();
    _this.createCurrentSelectedFilterHashURL();  //Creates the url for current selected filters
  });
};

//Function to filter the products concurrently
ProductList.prototype.filterProducts = function() {
  var _this = this;
  this.$filterBox.each(function() {
    var $currentFilter = $(this),
      selector = "input[data-category='" + $currentFilter.data("category") + "']:checked",
      checkedInput = $currentFilter.find(selector);
    _this.filterCondition = [];
    if(checkedInput.length) {
      _this.getFilterCondition(checkedInput, $currentFilter);
      _this.filteredElements = _this.filteredElements.filter(_this.filterCondition.join());
    }
  });
  _this.moveFilteredProductsInArray();
};

//Function to save filtered products in an array
ProductList.prototype.moveFilteredProductsInArray = function() {
  var elementsArray = [];
  $.each(this.filteredElements, function() {
      elementsArray.push(this);
  });
this.filteredElements = elementsArray;
};

//Function to display filtered products
ProductList.prototype.showProducts = function() {
  var _this = this;
  $.each(this.filteredElements, function() {
    _this.$productContainer.append($(this).show());
  });
};

//Function to create pagination bar if a filter is checked
ProductList.prototype.createPaginationForCheckedFilter = function(event) {
  if(event.originalEvent !== undefined) {
    this.selectedPage = 1;
  }
  this.createPaginationBar(this.filteredElements);
  this.highlightSelectedPage();
};

//To highlight selected Page Number
ProductList.prototype.highlightSelectedPage = function() {
  $('[data-page=' + this.selectedPage + ']').addClass(this.highlightClass);
};

//Function to save the constraints to filter products
ProductList.prototype.getFilterCondition = function(checkedFilter, currentFilterBox) {
  var _this = this;
  checkedFilter.each(function() {
    var id = currentFilterBox.data("category");
    _this.filterCondition.push("[data-" + id + " = '" + $(this).attr('data-' + id) + "']");
  });
};

//Function to create the pagination bar
ProductList.prototype.createPaginationBar = function(filterElements) {
  this.$paginationBar.empty();
  var totalProducts = filterElements.length,
      productsPerPage = this.$paginationElement.val(),
      noOfPages = Math.floor((totalProducts - 1) / productsPerPage) + 1;
  this.noOfPages = noOfPages;
  for(var index = 1; index <= noOfPages; index += 1) {
    var $page = this.getPage(index);
    this.$paginationBar.append($page);
  }
};

ProductList.prototype.getPage = function(pageNumber) {
  return $('<span>', {
    'id': 'page' + pageNumber,
    'data-page' : pageNumber,
    'class': 'page-number'
  }).html(pageNumber);
};

//Function to paginate elements
ProductList.prototype.applyPagination = function() {
  var productsPerPage = parseInt(this.$paginationElement.val()),
    totalProducts = this.filteredElements.length,
    firstProductIndex = (this.selectedPage - 1) * productsPerPage,
    lastProductIndex = firstProductIndex + productsPerPage - 1;
  if (lastProductIndex > totalProducts - 1) {
    lastProductIndex = totalProducts - 1;
  }
  this.filteredElements = this.filteredElements.slice(firstProductIndex, lastProductIndex + 1);
};

//Function which binds click event to pagination bar's page element
ProductList.prototype.bindPageClickEvent = function() {
  var _this = this;
  this.$paginationBar.on('click', '[data-page]', function() {
    $(this).siblings().removeClass(_this.highlightClass);
    _this.selectedPage = $(this).data('page');
    _this.$paginationElement.trigger('change');
  });
};

//Function which sorts the products
ProductList.prototype.applySorting = function() {
  var sortCriteria = this.$sortBy.val();
  this.filteredElements.sort(function(product1, product2) {
    var sortCondition = (sortCriteria != 'id') ?
      $(product1).attr('data-' + sortCriteria) > $(product2).attr('data-' + sortCriteria) :
      parseInt($(product1).attr('data-' + sortCriteria)) > parseInt($(product2).attr('data-' + sortCriteria));
    if (sortCondition) {
      return 1;
    } else {
      return -1;
    }
  });
};

//updates URL for every selection
ProductList.prototype.createCurrentSelectedFilterHashURL = function() {
  this.selectedFilters = {
    brands: this.getCheckedFilters(this.$brandFilter),
    colors: this.getCheckedFilters(this.$colorFilter),
    availability: this.getCheckedFilters(this.$availability),
    sortingCriteria: this.$sortBy.val(),
    pagination: this.$paginationElement.val()
  };
  history.pushState(this.selectedFilters, "SHOP", '?' + $.param(this.selectedFilters) + '&page=' + this.selectedPage);
};

//code to represent checked filters
ProductList.prototype.getCheckedFilters = function(filter) {
  var checkedFilterCode = '';
  $.each(filter, function() {
    checkedFilterCode += (this.checked) ? '1' : '0';
  });
  return checkedFilterCode;
};

//Function to check filters if url containes hash for it
ProductList.prototype.checkCurrentSelectionURL = function() {
  if(location.search) {
    var selectedFilters = '';
    if(this.hashUrlSelectedFiltersRegEx.test(location.search)) {
      selectedFilters = $.map(location.search.slice(1).split('&'), function(filter) {
        return filter.split('=')[1];
      });
      this.checkSelectedFilters(this.$brandFilter, selectedFilters[0]);
      this.checkSelectedFilters(this.$colorFilter, selectedFilters[1]);
      this.checkSelectedFilters(this.$availability, selectedFilters[2]);
      this.checkSelectedSelectBoxOption(this.$sortBy,selectedFilters[3]);
      this.checkSelectedSelectBoxOption(this.$paginationElement,selectedFilters[4]);
      this.checkSelectedPage(selectedFilters[5]);
    }
  }
};

//Function to check selected checkboxes
ProductList.prototype.checkSelectedFilters = function(filterContainer, filter){
  var index = 0,
      isChecked = 0;
  if(filter.length !== filterContainer.length) {
   location.replace(location.pathname);
  } else {
    $.each(filterContainer, function() {
      isChecked = parseInt(filter[index]);
      this.checked = isChecked;
      index++;
    });
  }
};

//Function to check selected options of selectboxes - sorting and pagination
ProductList.prototype.checkSelectedSelectBoxOption = function(filterContainer, selectedValue) {
  var selectedOption = filterContainer.find('option[value=' + selectedValue + ']');
  if (selectedOption.length) {
    selectedOption[0].selected = true;
  } else {
    location.replace(location.pathname);
  }
};

//Function to select page number
ProductList.prototype.checkSelectedPage = function(pageNumber) {
  if(pageNumber > this.noOfPages) {
    location.replace(location.pathname);
  } else {
    this.selectedPage = pageNumber;
  }
};

$(function() {
  var options = {
    $productContainer : $("[data-id='product-container']"),
    $filterBox : $("[data-id='filter-container']"),
    url : 'json/product.json',
    imageFolder : "images/",
    $paginationBar : $('[data-id="paginationBar"]'),
    $paginationElement : $('[data-category="pagination"]'),
    productSelector : "[data-type='productimage']",
    filterSelector : "[data-name='filter-div']",
    $sortBy : $('[data-category="sorting"]'),
    $brandFilter : $('[data-category="brands"]'),
    $colorFilter : $('[data-category="colors"]'),
    $availabilityFilter : $('[data-category="availability"]'),
    highlightClass : 'highlight'
  },
    productFilter = new ProductList(options);
  productFilter.init();
});
