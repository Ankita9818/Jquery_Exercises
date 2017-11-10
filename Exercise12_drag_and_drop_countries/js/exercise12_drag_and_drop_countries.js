function CountryTransferManager(options) {
  this.initialSelectBox = options.initialSelectBox;
  this.finalSelectBox = options.finalSelectBox;
}

CountryTransferManager.prototype.init = function() {
  this.dragAndDropCountries(this.finalSelectBox,this.initialSelectBox);
  this.dragAndDropCountries(this.initialSelectBox,this.finalSelectBox);

};

CountryTransferManager.prototype.dragAndDropCountries = function(sourceSelectbox, destinationSelectbox) {
  sourceSelectbox.children().draggable({
    cancel: false,
    containment: $('.container'),
    helper: 'clone'
  });
  destinationSelectbox.droppable({
    drop: function (event, ui) {
      destinationSelectbox.append(ui.draggable);
    }
  });
};

$(function() {
  var options = {
    initialSelectBox: $('#initialSelectbox'),
    finalSelectBox: $('#finalSelectbox'),
  },
    countryTransferManagerObject = new CountryTransferManager(options);
  countryTransferManagerObject.init();
});