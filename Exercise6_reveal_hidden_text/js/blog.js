function Blog(options) {
  this.blogItems = options.blogItems;
  this.blogExcerpt = options.blogExcerpt;
}

Blog.prototype.init = function() {
  var _this = this;
  this.blogItems.click(function() {
    var $li = $(this);
    $li.siblings().find(_this.blogExcerpt).slideUp().delay(2000);
    $li.find(_this.blogExcerpt).slideToggle();
  });
};

$(document).ready(function() {
  var options = {
    blogItems : $('div#blog ul li'),
    blogExcerpt : 'p.excerpt'
  },
    blogObject = new Blog(options);
  blogObject.init();
});
