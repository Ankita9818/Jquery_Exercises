//constructor for Products List
function ProductList(options) {
  this.$productContainer = options.$productContainer;
  this.$filterBox = options.$filterBox;
  this.urlToJsonFile = options.url;
  this.filteredProducts = [];
  this.allProducts = [];
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
  this.$productContainer.append(this.allProducts);
};

//Function to handle change event
ProductList.prototype.addChangeEventHandler = function() {
  var _this = this;
  this.$filterBox.on("change", function() {
    var $filterElements = _this.$productContainer.find("[data-type='productimage']");
    $filterElements.hide();
    $filterElements = _this.filterProducts($filterElements);
    $filterElements.show();
  });
};

//Function to filter the products concurrently
ProductList.prototype.filterProducts = function(filterElements) {
  var _this = this;
  this.$filterBox.each(function() {
    var $currentFilter = $(this),
      selector = "input[data-category='" + $currentFilter.attr("data-id") + "']:checked";
      checkedInput = $currentFilter.find(selector);
    _this.filteredProducts = [];
    if(checkedInput.length) {
      _this.saveFilteredProductsInArray(checkedInput, $currentFilter);
      filterElements = filterElements.filter(_this.filteredProducts.join());
    }
  });
  return filterElements;
};

//Function to save the constraints to filter products
ProductList.prototype.saveFilteredProductsInArray = function(checkedFilter, currentFilterBox) {
  var _this = this;
  checkedFilter.each(function() {
    var id = currentFilterBox.attr('data-id');
    _this.filteredProducts.push("[data-" + id + " = '" + $(this).attr('data-' + id) + "']");
  });
};

$(function() {
  var options = {
    $productContainer : $("#product-container"),
    $filterBox : $(".filter-container .filter-div"),
    url : 'json/product.json'
  },
    productFilter = new ProductList(options);
  productFilter.init();
});