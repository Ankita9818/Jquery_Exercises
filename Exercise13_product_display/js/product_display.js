function Product(options) {
  this.divProduct = options.divProduct;
  this.urlToJsonFile = options.url;
  this.productImages = [];
}

Product.prototype.init = function() {
  this.getProducts();
  this.addChangeListener();
};

Product.prototype.getProducts = function() {
  var _this = this;
  $.ajax({
    type : 'GET',
    url : this.urlToJsonFile,
    dataType : 'json',
    success : function(response) {
      _this.displayAllProducts(response);
    }
  });
};

Product.prototype.displayAllProducts = function(response) {
  this.response = [];
  var _this = this;
  $.each(response, function () {
    _this.response.push(this);
  });
  this.display(this.response);
};

Product.prototype.display = function(products) {
  this.divProduct.empty();
  this.productImages= [];
  var _this = this;
  $.each(products, function () {
    _this.productImages.push('<img src= "' + this.url + '">');
  });
  this.divProduct.append(_this.productImages.join(''));
};

Product.prototype.addChangeListener = function() {
  var _this = this;
  $('input:checkbox').change(function() {
    _this.key = [],_this.result = [];
    _this.divProduct.empty();
    var checkboxes = $('input:checkbox:checked');
    if(!checkboxes.length) {
      _this.display();
    }
    checkboxes.each(function() {
      _this.key.push($(this).attr('data-key'));
      _this.result.push($(this).attr('data-value'));
    });
    _this.filterProducts();
  });
};

Product.prototype.filterProducts = function(){
  this.filtered_products = this.response;
  for(var index = 0; index < this.key.length; index++) {
    this.filterProductsConsecutively(this.key[index], this.result[index], this.filtered_products);
  }
  this.display(this.filtered_products);
};

Product.prototype.filterProductsConsecutively = function(property, value, products) {
  this.filtered_products = [];
  var _this = this;
  $.each(products, function() {
    if(eval('this.' + property) == value) {
      _this.filtered_products.push(this);
    }
  });
};

$(function(){
  var options = {
    divProduct : $('#product'),
    checkboxes : $('input:checkbox'),
    url : 'json/product.json'
  },
    productObject = new Product(options);
    productObject.init();
});

//     var brandFilter = $('input[data-key="brand"]:checkbox:checked');
//     //console.log(brandFilter);
//     var colorFilter = $('input[data-key="color"]:checkbox:checked');
//     //console.log(color);
//     if(brandFilter.length) {
//       _this.filterOr(brandFilter,'brand');
//     }
//     if(colorFilter.length) {
//       _this.filterOr(colorFilter,'color');

//       Product.prototype.filterOr = function(filterCheckboxes, filterKey) {
//   this.filtered_products = [];
//   var _this = this;
//   for(var j = 0; j < filterCheckboxes.length; j++) {
//     $.each(this.response,function() {
//       if(eval('this.' + filterKey) == $(filterCheckboxes[j]).attr('data-value')) {
//         _this.filtered_products.push(this);
//       }
//     });
//   }
//   this.display(this.filtered_products);
// };