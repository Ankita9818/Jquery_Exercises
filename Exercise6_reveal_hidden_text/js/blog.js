$(document).ready(function() {
  $('div#blog').children('ul').children('li').each(function() {
    var $li = $(this);
    $(this).click(function() {
      if($li.children('p.excerpt').is(':hidden')) {
        $li.siblings().children('p.excerpt').slideUp().delay(2000);
        $li.children('p.excerpt').slideDown();
      }
    });
  });
});