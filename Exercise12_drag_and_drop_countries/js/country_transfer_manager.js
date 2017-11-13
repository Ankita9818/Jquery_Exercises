function CountryTransferManager(options) {
  this.$countrySelectBox = options.$countrySelectBox;
  this.$parentContainer = options.$parentContainer
}

CountryTransferManager.prototype.init = function() {
  this.dragAndDropCountries();
};

CountryTransferManager.prototype.dragAndDropCountries = function() {
  this.$countrySelectBox.children().draggable({
    cancel : false,
    containment : this.$parentContainer,
    helper : 'clone'
  });
  this.$countrySelectBox.droppable({
    drop : function (event, ui) {
      $(this).append(ui.draggable);
    }
  });
};

$(function() {
  var options = {
    $countrySelectBox : $('form').find('[data-id="country-select-box"]'),
    $parentContainer : $('form').find('[data-name="container"]')
  },
    countryTransferManagerObject = new CountryTransferManager(options);
  countryTransferManagerObject.init();
});