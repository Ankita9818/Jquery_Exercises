$(document).ready(function() {
  var $formSearch = $('form#search');
  var $searchInput = $formSearch.find('input[type=text]');
  var $hintText = $formSearch.find('label').remove().text();
  $searchInput.attr('value', $hintText).addClass('hint');

  //focus event handler
  $searchInput.bind('focus',function() {
    $(this).val('').removeClass('hint');
  });

  //blur event Handler
  $searchInput.bind('blur', function() {
    if(!$(this).val()) {
      $(this).val($hintText).addClass('hint');
    }
  });
});