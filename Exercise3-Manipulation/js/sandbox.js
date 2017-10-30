$(document).ready(function() {
  //1- Add five new list items to the end of the unordered list #myList.
  var newListItems = [],
    $myList = $('#myList'),
    lastListItemNumber = $myList.children().last().index();
  for (var i = (lastListItemNumber + 2); i <= (lastListItemNumber + 6); i++) {
    newListItems.push('<li>List item ' + i + '</li>');
  }
  $myList.append(newListItems.join(''));

  //2- Remove the odd list items
  $("#myList li:even").remove();    //To remove item no 1,3,5,7...

  //3- Add another h2 and another paragraph to the last div.module
  var $lastModule = $("div.module:last"),
    newItems = [];
  newItems.push('<h2>New h2 element added by Exercise3 part 3</h2>');
  newItems.push('<p>New p element added by Exercise3 part 3</p>');
  $lastModule.append(newItems.join(''));

  //4- Add another option to the select element; give the option the value "Wednesday"
  $("#specials select").append("<option value=wednesday>Wednesday</option>");

  //5- Add a new div.module to the page after the last one; put a copy of one of the existing images inside of it.
  var $imageCopy = $("img").first().clone();
  $imageCopy.attr({
    "width" : "100%"
  });
  $lastModule.clone()
    .append($imageCopy)
    .insertAfter($lastModule);
  $imageCopy.parent()
    .addClass("bordered-form");
});