function Special(options) {
  this.divSpecial = options.divSpecial;
  this.daySelectElement = options.daySelectElement;
  this.urlToJsonFile = options.url;
}

Special.prototype.init = function() {
  this.$detailsDiv = $('<div/>');
  this.$detailsDiv.appendTo(this.divSpecial);
  this.addChangeEventHandler();
  this.divSpecial.find('li.buttons').remove();
};

Special.prototype.addChangeEventHandler =function() {
  var _this = this,
    cachedResponse = null;
  this.daySelectElement.on('change',function() {
    var value = _this.daySelectElement.val();
    if(!value) {
      _this.$detailsDiv.empty();
      return;
    }
    if(!cachedResponse) {
      $.ajax({
        type : 'GET',
        url : _this.urlToJsonFile,
        dataType : 'json',
        success : function(response) {
          cachedResponse = response;
          _this.displaySpecials(response, value);
        }
      });
    }
    else {
      console.log('using cachedResponse');
      _this.displaySpecials(cachedResponse, value);
    }
  });
};

Special.prototype.displaySpecials = function(response,value) {
  var selectedDay = response[value],
    content = '<h2>' + selectedDay.title + '</h2>';
  content += '<p>' + selectedDay.text + '</p>';
  content += '<p>' + "Today's color : " + selectedDay.color + '</p>';
  this.$detailsDiv.html(content).addClass('content');
  this.$detailsDiv.css('color', selectedDay.color);
  $('<img/>',{
    src : selectedDay.image
  }).appendTo(this.$detailsDiv);
};

$(function(){
  var options = {
    divSpecial : $('#specials'),
    daySelectElement :$('#specials select'),
    url : 'json/specials.json'
  },
    specialObject = new Special(options);
    specialObject.init();
});