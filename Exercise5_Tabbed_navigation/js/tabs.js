$(document).ready(function() {
  var $divmodule = $('div.module');
  $divmodule.hide();
  var $newList = $('<ul></ul>', {
    'class' : 'bordered-tab'
  });
  $newList.insertBefore($divmodule.first());
  $divmodule.each(function( index ) {
    var $listItem = $('<li>' + $(this).find('h2').text() + '</li>');
    $listItem.data('relatedDiv', $(this));
    $listItem.click(function() {                    //Click event handler
      $divmodule.hide();
      $newList.children().removeClass('current');
      $(this).data('relatedDiv').show();
      $(this).addClass('current');
    });
    $newList.append($listItem);
  });
  $divmodule.first().show();                        //To show the first tab by default
  $newList.children().first().addClass('current');
});