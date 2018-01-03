function Store(options) {
  this.url = options.url;
  this.$gridContainer = options.$gridContainer;
  this.$currentOrderContainer = options.$currentOrderContainer;
  this.$pendingOrderContainer = options.$pendingOrderContainer;
  this.$delieveredOrderContainer = options.$delieveredOrderContainer;
  this.pendingOrders = [];
  this.delieveredOrders = [];
  this.$sale = options.$sale;
  this.orderId = 1;
  this.$currentOrder = new Order(this.orderId);
}

Store.prototype.init = function() {
  this.loadJsonData();
  this.addHandler();
  this.addButtonHandlers();
};

//Function which loads json data
Store.prototype.loadJsonData = function() {
  var _this = this;
  $.ajax({
    type : 'GET',
    url : this.url,
    dataType : 'json',
    success : function(response) {
      _this.ingredientsJsonData = response;
      _this.createGrid();
    }
  });
};

Store.prototype.createGrid = function() {
  var ingredient = new Ingredient(this.url,this.ingredientsJsonData, this.$gridContainer);
  var grid = ingredient.createIngredientsGrid();
  this.$gridContainer.append(grid);
};

Store.prototype.addHandler = function() {
  var _this = this;
  this.$gridContainer.on('click','[data-id="individual-ingredient-div"]', function() {
    _this.selectIngredient($(this));
  });
};

Store.prototype.selectIngredient = function(clickedItem) {
  var category = clickedItem.parent().data('category');
  if(clickedItem.hasClass('highlight')) {
    this.$currentOrder.removeIngredient(clickedItem,category);
    this.unselectItem(clickedItem, category);
  } else {
    this.createOrder(clickedItem, category);
    clickedItem.siblings('.highlight').removeClass('highlight');
    clickedItem.addClass('highlight');
  }
};

Store.prototype.unselectItem = function(clickedItem, category) {
  clickedItem.removeClass('highlight');
};

Store.prototype.createOrder = function(selectedItem, category) {
  this.$currentOrder.createOrder(selectedItem, category);
};

//Function which adds place order button
Store.prototype.addButtonHandlers = function() {
  var _this = this,
    placeOrderBtn = $('<button>', {
      'text' : 'Place order'
    }).on('click', function() {
      _this.placeOrder();
    });
  this.$currentOrderContainer.append(placeOrderBtn);
};

//Function which places the order
Store.prototype.placeOrder = function() {
  var customerName = prompt('Confirm your order by entering your name');
  this.$currentOrder.customerName = customerName;
  this.pendingOrders.push(this.$currentOrder);
  this.$currentOrder = new Order(++this.orderId);
  this.displayPendingOrders();
  this.$currentOrder.removeCurrentOrder();
  $('div[data-id="individual-ingredient-div"]').removeClass('highlight');
};

Store.prototype.displayPendingOrders = function() {
  var _this = this;
  this.$pendingOrderContainer.empty();
  $.each(this.pendingOrders, function() {
    var orderPendingdiv = this.display(this);
    var deleiver_btn = _this.getBtn().data('order', orderPendingdiv).data('id',this.orderId);
    orderPendingdiv.append(deleiver_btn).data('order', this);
    _this.$pendingOrderContainer.prepend(orderPendingdiv);
  });
};

Store.prototype.getBtn = function() {
  var _this = this;
  return deleiverOrderBtn = $('<button>', {
    'text' : 'Deliever order',
    'class' :  'btn center-block'
  }).on('click', function() {
    _this.delieverOrder($(this));
  });
};

//FUnction which deleivers order
Store.prototype.delieverOrder = function(delieveredOrder) {
  this.delieveredOrders.push(delieveredOrder.data('order'));
  this.displayDelieveredOrders();
  this.removePendingOrder(delieveredOrder);
};

Store.prototype.removePendingOrder = function(order) {
  var _this = this;
  $.each(this.pendingOrders, function(index) {
    if(this.orderId == order.data('id')) {
      _this.pendingOrders.splice(index, 1);
      return false;
    }
  });
}

Store.prototype.displayDelieveredOrders = function() {
  var _this = this;
  _this.totalSales = 0;
  $.each(this.delieveredOrders, function() {
    $(this).find('.btn').detach();
    _this.$delieveredOrderContainer.append(this);
    amount = $(this).data('order').totalOrderAmount;
    _this.totalSales += amount;
  });
  this.$sale.html("Todays' sale = " + this.totalSales);
};

$(function() {
  var options = {
    $gridContainer : $("[data-id='grid-container']"),
    $currentOrderContainer : $("[data-id='current-order-container']"),
    $totalOrderAmount : $("[data-id='total-order-amount']"),
    $sale : $("[data-id='sale']"),
    $pendingOrderContainer : $("[data-id='pending-order-container']"),
    $delieveredOrderContainer : $("[data-id='deleivered-order-container']"),
    url : 'json/ingredient.json'
  },
    grid = new Store(options);
  grid.init();
});
