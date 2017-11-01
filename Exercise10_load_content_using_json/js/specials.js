function JsonLoader(options) {
  this.divSpecial = options.divSpecial;
  this.selectElement = options.selectElement;
  this.urlToJsonFile = options.url;
}

JsonLoader.prototype.init = function() {
  this.$detailsDiv = $('<div/>');
  this.$detailsDiv.appendTo(this.divSpecial);
  this.bind();
  this.divSpecial.find('li.buttons').remove();
};

JsonLoader.prototype.bind =function() {
  var _this = this,
    cachedResponse = null;
  this.selectElement.bind('change',function() {
    var value = _this.selectElement.val();
    if(!value) {
      _this.$detailsDiv.empty();
      return;
    }
    if(!cachedResponse) {
      $.ajax({
        type : 'get',
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

JsonLoader.prototype.displaySpecials = function(response,value) {
  var daySpecial = response[value];
  var content = '<h2>' + daySpecial.title + '</h2>';
  content += '<p>' + daySpecial.text + '</p>';
  content += '<p>' + "Today's color : " + daySpecial.color + '</p>';
  this.$detailsDiv.html(content).addClass('content');
  this.$detailsDiv.css('color', daySpecial.color);
  $('<img/>',{
    src : daySpecial.image
  }).appendTo(this.$detailsDiv);
};

$(function(){
  var options = {
    divSpecial : $('#specials'),
    selectElement :$('#specials select'),
    url : 'json/specials.json'
  },
    jsonLoaderObject = new JsonLoader(options);
    jsonLoaderObject.init();
});