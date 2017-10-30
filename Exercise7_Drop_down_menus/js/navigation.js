$(document).ready(function() {
  $("ul#nav").children().each(function() {
    $(this).hover(
      function() {
        $(this).addClass("hover").children("ul").show();
      }, function() {
        $(this).removeClass("hover").children("ul").hide();
      }
    );
  });
});