function Load(options) {
  this.blogHeadlines = options.blogHeadlines;
}

Load.prototype.init = function() {
  var _this = this;
  this.blogHeadlines.each(function() {
    var $currentBlog = $(this),
      $targetDiv = $('<div class="blogContent"></div>');
    $currentBlog.after($targetDiv).data('blogContent', $targetDiv);
    _this.addclickHandler($currentBlog);
  });
}

Load.prototype.addclickHandler = function($currentBlogItem) {
  $currentBlogItem.click(function(event) {
    var href = $currentBlogItem.find('a').attr('href'),
      id = '#' + href.split('#')[1];
    $currentBlogItem.data('blogContent').load('blog.html ' + id);
    event.preventDefault();
  });
}

$(function() {
  var options = {
    blogHeadlines : $("div#blog h3")
  },
    loadContentObject = new Load(options);
  loadContentObject.init();
});
