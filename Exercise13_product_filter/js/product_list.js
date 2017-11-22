//constructor for Products List
function ProductList(options) {
  this.$productContainer = options.$productContainer
  this.$filterBox = options.$filterBox.find(options.filterSelector);
  this.productSelector = options.productSelector;
  this.url = options.url;
  this.imageFolder  = options.imageFolder;
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
  this.filteredElements = products;
  this.bindPageClickEvent();
  this.createPaginationBar(products);
  this.$paginationElement.trigger('change');
};

//Function to handle change event
ProductList.prototype.addChangeEventHandler = function() {
  var _this = this;
  this.$filterBox.on("change", function(event) {
    $('[data-page='+_this.selectedPage+']').addClass('highlight');
    _this.filteredElements = _this.$productContainer.find(_this.productSelector);
    _this.filteredElements.hide();
    //Filter products on basis of checked filters
    _this.filteredElements = _this.filterProducts(_this.filteredElements);
    _this.createPaginationForCheckedFilter(event);
    //Paginate filtered elements
    _this.filteredElements = _this.applyPagination(_this.filteredElements);
    _this.filteredElements.show();
  });
};

//Function to filter the products concurrently
ProductList.prototype.filterProducts = function(filterElements) {
  var _this = this;
  this.$filterBox.each(function() {
    var $currentFilter = $(this),
      selector = "input[data-category='" + $currentFilter.data("category") + "']:checked";
      checkedInput = $currentFilter.find(selector);
    _this.filterCondition = [];
    if(checkedInput.length) {
      _this.getFilterCondition(checkedInput, $currentFilter);
      filterElements = filterElements.filter(_this.filterCondition.join());
    }
  });
  return filterElements;
};

ProductList.prototype.createPaginationForCheckedFilter = function(event) {
  if(event.originalEvent !== undefined) {
    this.selectedPage = 1;
    this.createPaginationBar(this.filteredElements);
    $('[data-page='+this.selectedPage+']').addClass('highlight');
  }
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
  var options = {
    $productContainer : $("[data-id='product-container']"),
    $filterBox : $("[data-id='filter-container']"),
    url : 'json/product.json',
    imageFolder : "images/",
    $paginationBar : $('[data-id="paginationBar"]'),
    $paginationElement : $('[data-category="pagination"]'),
    productSelector : "[data-type='productimage']",
    filterSelector : "[data-name='filter-div']"
  },
    productFilter = new ProductList(options);
  productFilter.init();
});