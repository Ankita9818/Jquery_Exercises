//constructor for Products List
function ProductList(options) {
  this.$productContainer = options.$productContainer;
  this.$filterBox = options.$filterBox;
  this.urlToJsonFile = options.url;
  this.filterCondition = [];
  this.allProducts = [];
  this.selectedPage = 1;
  this.currentViewableProducts = [];
  this.$paginationBar = options.$paginationBar;
  this.$paginationElement = options.$paginationElement;
}

//Function to initiate all other functions
ProductList.prototype.init = function() {
  this.loadJsonData();
  this.addChangeEventHandler();
  this.availabilityRadioCheckUncheckHandler();
};

//Function to get products data from json file
ProductList.prototype.loadJsonData = function() {
  var _this = this;
  $.ajax({
    type : 'GET',
    url : this.urlToJsonFile,
    dataType : 'json',
    success : function(response) {
      $.each(response, function(index) {
        _this.storeAllProducts(index, this);
      });
      _this.displayAllProducts();
    }
  });
};

//Function to store all products
ProductList.prototype.storeAllProducts = function(index, currentResponseObject) {
  this.allProducts.push("<div id='" + (index + 1) + "' data-type='productimage' data-brands = '" +
    currentResponseObject.brand + "' data-colors = '" + currentResponseObject.color + "' data-availability = '" +
    currentResponseObject.sold_out + "'><img src=images/" + currentResponseObject.url + " /></div>");
};

//Function to display all products
ProductList.prototype.displayAllProducts = function() {
  this.filteredElements = this.allProducts;
  this.$productContainer.append(this.allProducts);
  this.bindPageClickEvent();
  this.$paginationElement.trigger('change');
};

//Function to handle change event
ProductList.prototype.addChangeEventHandler = function() {
  var _this = this;
  this.$filterBox.on("change", function(event) {
    if (event.originalEvent !== undefined) {
      _this.selectedPage = 1;
    }
    _this.filteredElements = _this.$productContainer.find("[data-type='productimage']");
    _this.filteredElements.hide();
    _this.filteredElements = _this.filterProducts(_this.filteredElements);
    _this.createPaginationBar(_this.filteredElements);
    _this.filteredElements = _this.applyPagination(_this.filteredElements);
    _this.filteredElements.show();
  });
};

//Function to filter the products concurrently
ProductList.prototype.filterProducts = function(filterElements) {
  var _this = this;
  this.$filterBox.each(function() {
    var $currentFilter = $(this),
      checkedInput = $currentFilter.find("input[data-category='" + $currentFilter.attr("data-id") + "']:checked");
    _this.filterCondition = [];
    if(checkedInput.length) {
      _this.saveFilteredProductsInArray(checkedInput, $currentFilter);
      filterElements = filterElements.filter(_this.filterCondition.join());
    }
  });
  return filterElements;
};

//Function to check uncheck radio button on clicking
ProductList.prototype.availabilityRadioCheckUncheckHandler = function() {
  var _this = this;
  this.flag = 0;
  $('input:radio').on('click', function() {
    if(_this.flag) {
      $(this).prop('checked', false);
      _this.flag = 0;
    }
    else {
      $(this).prop('checked', true);
      _this.flag = 1;
    }
    $(this).trigger('change');
  });
};

//Function to save the constraints to filter products
ProductList.prototype.saveFilteredProductsInArray = function(checkedFilter, currentFilterBox) {
  var _this = this;
  checkedFilter.each(function() {
    var id = currentFilterBox.attr('data-id');
    _this.filterCondition.push("[data-" + id + " = '" + $(this).attr('data-' + id) + "']");
  });
};

//Function to create the pagination bar
ProductList.prototype.createPaginationBar = function(filterElements) {
  this.$paginationBar.empty();
  var totalProducts = filterElements.length,
      productsPerPage = this.$paginationElement.val(),
      noOfPages = Math.floor((totalProducts - 1) / productsPerPage) + 1,
      $page = '',
      index = 0;
  for(index = 1; index <= noOfPages; index += 1) {
    $page = $('<span>', {
      id: 'page' + index,
      'data-page' : index,
      'class': 'page-number'}).html(index);
    this.$paginationBar.append($page);
  }
};

//Function to paginate elements
ProductList.prototype.applyPagination = function(filterElements) {
  var productsPerPage = parseInt(this.$paginationElement.val()),
    totalProducts = filterElements.length,
    firstProductIndex = (this.selectedPage - 1) * productsPerPage,
    lastProductIndex = firstProductIndex + productsPerPage - 1;
  if (lastProductIndex > totalProducts - 1) {
    lastProductIndex = totalProducts - 1;
  }
  this.currentViewableProducts = filterElements.slice(firstProductIndex, lastProductIndex + 1);
  return this.currentViewableProducts;
};

//Function which binds click event to pagination bar's page element
ProductList.prototype.bindPageClickEvent = function() {
  var _this = this,
      $this = '';
  this.$paginationBar.on('click', '[data-page]', function() {
    $this = $(this);
    $this.addClass('highlight').siblings().removeClass('highlight');
    _this.selectedPage = $this.data('page');
    _this.$paginationElement.trigger('change');
  });
};

$(function() {
  //Object Hash
  var options = {
    $productContainer : $("#product-container"),
    $filterBox : $(".filter-container .filter-div"),
    $paginationBar : $('[data-id="paginationBar"]'),
    $paginationElement : $('[data-category="pagination"]'),
    url : 'json/product.json'
  },
    productFilter = new ProductList(options);
  productFilter.init();
});