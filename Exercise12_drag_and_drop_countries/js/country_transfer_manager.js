function CountryTransferManager(options) {
  this.$countrySelectBox = options.$countrySelectBox;
}

CountryTransferManager.prototype.init = function() {
  this.dragAndDropCountries(this.$countrySelectBox);
};

CountryTransferManager.prototype.dragAndDropCountries = function(selectBox) {
  selectBox.children().draggable({
    cancel: false,
    containment: $('.container'),
    helper: 'clone'
  });
  selectBox.droppable({
    drop: function (event, ui) {
      $(this).append(ui.draggable);
    }
  });
};

$(function() {
  var options = {
    $countrySelectBox: $('form').find('[data-id="country-select-box"]')
  },
    countryTransferManagerObject = new CountryTransferManager(options);
  countryTransferManagerObject.init();
});