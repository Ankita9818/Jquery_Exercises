function Slider(options) {
  this.$slideshow = options.$slideshow;
  this.$slideshowItems = this.$slideshow.find('li');
  this.delay = options.delay;
  this.speed = options.speed;
  this.totalNumberOfItems = this.$slideshowItems.length;
}

Slider.prototype.init = function() {
  this.startSlideshow();
  this.playSlideshow();
};

Slider.prototype.startSlideshow = function() {
  $('body').prepend(this.$slideshow);
  this.$slideIndicator = $('<p/>', {
    'class' : 'indicator'
  });
  this.$slideshow.append(this.$slideIndicator);
  this.$slideshowItems.hide();
};

Slider.prototype.playSlideshow = function() {
  var itemNumber = -1,
    _this = this;
  setInterval(function() {
    _this.$slideshowItems.eq(itemNumber).fadeOut(0);
    itemNumber = (itemNumber + 1 >= _this.totalNumberOfItems) ? 0 : itemNumber + 1;
    _this.$slideshowItems.eq(itemNumber).fadeIn(_this.speed);
    _this.indicateCurrentSlide(itemNumber + 1);
  }, this.delay);
};

Slider.prototype.indicateCurrentSlide = function(num) {
  this.$slideIndicator.text(num + ' / ' + this.totalNumberOfItems);
};

$(function() {
  var options = {
    $slideshow : $("ul#slideshow"),
    delay : 1000,
    speed : 500
  },
    sliderObject = new Slider(options);
  sliderObject.init();
});