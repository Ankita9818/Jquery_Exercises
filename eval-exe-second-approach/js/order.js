function Order(id) {
  this.$currentOrderDisplay = $("[data-id='current-order-display']");
  this.orderSelected = {};
  this.orderId = id;
  this.$totalOrderAmount = $("[data-id='total-order-amount']");
}

Order.prototype.createOrder = function(item, category) {
  this.orderSelected[category] = [category, item.data('value'), item.data('price')];
  this.displayOrder();
};

Order.prototype.displayOrder = function() {
  var $orderDiv = $('<div>'),
  _this = this;
  $.each(this.orderSelected, function() {
    $.each(this, function() {
      $orderDiv.append(_this.createDiv(this));
    });
    $orderDiv.append($('<br>'));
  });
  this.$currentOrderDisplay.html($orderDiv);
  this.calculateAmount();
};

//Function which displays order amount
Order.prototype.calculateAmount = function() {
  var _this = this;
  this.totalOrderAmount = 0;
  $.each(this.orderSelected, function() {
    _this.totalOrderAmount += this[2];
  });
  this.displayAmount();
};

Order.prototype.displayAmount  = function() {
  this.$totalOrderAmount.data('amount', this.totalOrderAmount);
  this.$totalOrderAmount.html('Total Amount = ' + this.totalOrderAmount);
};

Order.prototype.removeIngredient = function(item, category) {
  delete this.orderSelected[category];
  this.displayOrder();
};

Order.prototype.createDiv = function(text) {
  return($('<p>', {
    'text' : text,
    'class' : 'padding'
  }));
};

Order.prototype.removeCurrentOrder = function() {
  this.orderSelected = {};
  this.displayOrder();
};

Order.prototype.display = function(order) {
  var $orderDiv = $('<div>').addClass('current-order'),
  _this = this;
  $orderDiv.append(_this.createDiv('name = ' + order.customerName));
  $orderDiv.append($('<br>'));
  $orderDiv.append(_this.createDiv('amount = ' + order.totalOrderAmount));
  $orderDiv.append($('<br>'));
  $.each(order.orderSelected, function() {
    $.each(this, function() {
      $orderDiv.append(_this.createDiv(this));
    });
    $orderDiv.append($('<br>'));
  });
  return $orderDiv;
}