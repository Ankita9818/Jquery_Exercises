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
  this.$sortBy = options.$sortBy;
}

//Function to initiate all other functions
ProductList.prototype.init = function() {
  this.loadJsonData();
  this.addChangeEventHandler();
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
  var productObject = $('<div>', {
    id : (index + 1),
    'data-type' : 'productimage',
    'data-brands' : currentResponseObject.brand,
    'data-colors' : currentResponseObject.color,
    'data-availability' : currentResponseObject.sold_out
  }),
    productImageObject = $('<img>', {
      src : "images/" + currentResponseObject.url
    });
  productObject.append(productImageObject);
  this.allProducts.push(productObject);
};

//Function to display all products
ProductList.prototype.displayAllProducts = function() {
  this.filteredElements = this.allProducts;
  this.$productContainer.append(this.allProducts);
  this.bindPageClickEvent();
  this.createPaginationBar(this.allProducts);
  this.$paginationElement.trigger('change');
};

//Function to handle change event
ProductList.prototype.addChangeEventHandler = function() {
  var _this = this;
  this.$filterBox.on("change", function(event) {
    $('[data-page='+_this.selectedPage+']').addClass('highlight');
    _this.filteredElements = _this.$productContainer.find("[data-type='productimage']");
    _this.filteredElements.hide();
    //Filter products on basis of checked filters
    _this.filteredElements = _this.filterProducts(_this.filteredElements);
    _this.createPaginationForCheckedFilter(event);
    //Sort elements
    _this.filteredElements = _this.applySorting(_this.filteredElements);
    //paginate elements
    _this.filteredElements = _this.applyPagination(_this.filteredElements);
    _this.filteredElements = _this.moveFilteredProductsInArray(_this.filteredElements);
    _this.displayFilteredProducts(_this.filteredElements);
  });
};

//Function to save filtered products in an array
ProductList.prototype.moveFilteredProductsInArray = function(elements) {
  var elementsArray = [];
  $.each(elements,function() {
      elementsArray.push(this);
  });
return elementsArray;
};

//Function to display filtered products
ProductList.prototype.displayFilteredProducts = function(elements) {
  var _this = this;
  $.each(elements, function() {
    _this.$productContainer.append($(this).show());
  });
}

//Function to create pagination bar if a filter is checked
ProductList.prototype.createPaginationForCheckedFilter = function(event) {
  if(event.originalEvent !== undefined) {
    this.selectedPage = 1;
    this.createPaginationBar(this.filteredElements);
    $('[data-page='+this.selectedPage+']').addClass('highlight');
  }
};

//Function to filter the products concurrently
ProductList.prototype.filterProducts = function(filterElements) {
  var _this = this;
  this.$filterBox.each(function() {
    var $currentFilter = $(this),
      selector = "input[data-category='" + $currentFilter.attr("data-id") + "']:checked",
      checkedInput = $currentFilter.find(selector);
    _this.filterCondition = [];
    if(checkedInput.length) {
      _this.saveFilteredProductsInArray(checkedInput, $currentFilter);
      filterElements = filterElements.filter(_this.filterCondition.join());
    }
  });
  return filterElements;
};

//Function to save the constraints to filter products
ProductList.prototype.saveFilteredProductsInArray = function(checkedFilter, currentFilterBox) {
  var _this = this;
  checkedFilter.each(function() {
    var id = currentFilterBox.attr('data-id');
    _this.filterCondition.push("[data-" + id + " = '" + $(this).attr('data-' + id) + "']");
  });
};

//Function which sorts the products
ProductList.prototype.applySorting = function(filterElements) {
  var sortCriteria = this.$sortBy.val();
  if(sortCriteria !='id') {
    filterElements.sort(function(product1, product2) {
      if ($(product1).attr('data-' + sortCriteria) > $(product2).attr('data-' + sortCriteria)) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  return filterElements;
};

//Function to create the pagination bar
ProductList.prototype.createPaginationBar = function(filterElements) {
  this.$paginationBar.empty();
  var totalProducts = filterElements.length,
      productsPerPage = this.$paginationElement.val(),
      noOfPages = Math.floor((totalProducts - 1) / productsPerPage) + 1;
  for(var index = 1; index <= noOfPages; index += 1) {
    var $page = $('<span>', {
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
    $this.siblings().removeClass('highlight');
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
    $sortBy : $('[data-category="sorting"]'),
    url : 'json/product.json'
  },
    productFilter = new ProductList(options);
  productFilter.init();
});