$(document).ready(function() {
  var $formSearch = $('form#search');
  var $searchInput = $formSearch.find('input[type=text]');
  var $searchLabel = $formSearch.find('label');
  var $hintText = $searchLabel.text();
  $searchInput.attr('value', $hintText);
  $searchInput.addClass('hint');
  $searchLabel.remove();

  //focus event handler
  $searchInput.focus(function() {
    $(this).val('');
    $(this).removeClass('hint');
  });

  //blur event Handler
  $searchInput.blur(function() {
    if(!$(this).val()) {
      $(this).val($hintText);
      $(this).addClass('hint');
    }
  });
});