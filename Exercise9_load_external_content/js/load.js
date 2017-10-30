$(document).ready(function() {
  $("div#blog").find('h3').each(function() {
    var $targetDiv = $('<div class="blogContent"></div>');
    $(this).after($targetDiv).data('blogContent', $targetDiv);
    $(this).bind('click',function(event) {
      var href = $(this).find('a').attr('href'),
        tempArray = href.split('#'),
        id = '#' + tempArray[1];
      $(this).data('blogContent').load('blog.html ' + id);
      event.preventDefault();
    });
  });
});

