//constructor for Products List
function ProductList(options) {
  this.$productContainer = options.$productContainer;
  this.$filterBox = options.$filterBox.find(CONSTANTS.FILTERSELECTOR);
  this.url = options.url;
  this.imageFolder  = options.imageFolder;
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
};

//Function to handle change event
ProductList.prototype.addChangeEventHandler = function() {
  var _this = this;
  this.$filterBox.on("change", function() {
    var $filterElements = _this.$productContainer.find(CONSTANTS.PRODUCTSELECTOR);
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

//Function to save the constraints to filter products
ProductList.prototype.getFilterCondition = function(checkedFilter, currentFilterBox) {
  var _this = this;
  checkedFilter.each(function() {
    var id = currentFilterBox.data("category");
    _this.filterCondition.push("[data-" + id + " = '" + $(this).attr('data-' + id) + "']");
  });
};

var CONSTANTS = {
  PRODUCTSELECTOR : "[data-type='productimage']",
  FILTERSELECTOR : "[data-name='filter-div']"
};
Object.freeze(CONSTANTS);

$(function() {
  var options = {
    $productContainer : $("[data-id='product-container']"),
    $filterBox : $("[data-id='filter-container']"),
    url : 'json/product.json',
    imageFolder : "images/",
  },
    productFilter = new ProductList(options);
  productFilter.init();
});