function Slideshow(options) {
  this.$slideshow = options.$slideshow;
  this.$slideshowItems = this.$slideshow.find('li');
  this.delay = options.delay;
  this.speed = options.speed;
  this.totalNumberOfItems = this.$slideshowItems.length;
}

Slideshow.prototype.init = function() {
  $('body').prepend(this.$slideshow);
  this.$slideIndicator = $('<p/>', {
    'class' : 'indicator'
  });
  this.$slideshow.append(this.$slideIndicator);
  this.$slideshowItems.hide();
  this.playSlideshow();
};

Slideshow.prototype.playSlideshow = function() {
  var itemNumber = 0,
    _this = this;
  this.$slideshowItems.eq(itemNumber).fadeIn(this.speed);
  this.indicateCurrentSlide(itemNumber + 1);
  setInterval(function() {
    _this.$slideshowItems.eq(itemNumber).fadeOut(0);
    itemNumber = (itemNumber + 1 >= _this.totalNumberOfItems) ? 0 : itemNumber + 1;
    _this.$slideshowItems.eq(itemNumber).fadeIn(_this.speed);
    _this.indicateCurrentSlide(itemNumber + 1);
  }, this.delay);
};

Slideshow.prototype.indicateCurrentSlide = function(num) {
  this.$slideIndicator.text(num + ' / ' + this.totalNumberOfItems);
};

$(function() {
  var options = {
    $slideshow : $("ul#slideshow"),
    delay : 1000,
    speed : 500
  },
    slideshowObject = new Slideshow(options);
  slideshowObject.init();
});