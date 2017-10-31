function Navigation(options) {
  this.navbarItems = options.navbarItems;
  this.className = options.classToAdd;
  this.submenuSelector = options.submenuSelector;
}

Navigation.prototype.init = function() {
  var _this = this;
  this.navbarItems.hover(
    function() {
      $(this).addClass(_this.className).find(_this.submenuSelector).show();
    }, function() {
      $(this).removeClass(_this.className).find(_this.submenuSelector).hide();
    }
  );
};

$(document).ready(function() {
  var options = {
    navbarItems : $("ul#nav li"),
    classToAdd : "hover",
    submenuSelector : "ul"
  };
  var navigationObject = new Navigation(options);
  navigationObject.init();
});
