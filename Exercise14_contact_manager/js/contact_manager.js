//Class ContactManager
function ContactManager(options) {
  this.contactForm = options.contactForm;
  this.userNameInput = options.userNameInput;
  this.userMailInput = options.userMailInput;
  this.addContactButton = options.addContactButton;
  this.contactDisplayBlock = options.contactDisplayBlock;
  this.searchInput = options.searchInput;
}

ContactManager.prototype.init = function() {
  this.bindEventListeners();
};

//Function which binds listeners on add Contact Btn and search Input
ContactManager.prototype.bindEventListeners = function() {
  var _this = this;
  this.addContactButton.on('click', function() {
    _this.contactCreator();
  });
  this.searchInput.on('keyup', function() {
    _this.searchContacts();
  });
};

//Function to search Contacts at real time
ContactManager.prototype.searchContacts = function() {
  var contacts = this.contactDisplayBlock.find('.contact-div');
  contacts.show();
  if (!this.searchInput.val()) {
    return;
  }
  contacts.filter(':not([data-name*="' + this.searchInput.val().toLowerCase() + '"])').hide();
};

//Function which creates a contact
ContactManager.prototype.contactCreator = function() {
  var _this = this;
  if(_this.validateContactInformation()) {
    var contact = {
      name : _this.userNameInput.val(),
      email : _this.userMailInput.val()
    },
      user = new Contact(contact);
    _this.displayContact(user);
  } else {
    alert('Please Enter the Contact Information Correctly');
  }
};

//Function to display contact
ContactManager.prototype.displayContact = function(contact) {
  var contactDiv = this.createContactView(contact.name);
  this.appendInfo(contactDiv,contact.email);
  this.appendInfo(contactDiv,contact.name);
  this.contactDisplayBlock.append(contactDiv);
  this.contactForm[0].reset();
};

//Function which appends user information
ContactManager.prototype.appendInfo = function(div, info) {
  div.prepend($('<p>', {
    'text' : info
  }));
};

ContactManager.prototype.createContactView = function(name) {
  var contactDiv = $('<div>',{
      'data-name' : name.toLowerCase()
    }).addClass('contact-div'),
    deleteContact = $('<button>', {
      'data-usage' : deleteContact,
      'text' : 'Delete Contact'
    }).addClass('btn'),
    _this = this;
  deleteContact.on('click', function() {
    _this.deleteContact($(this).parent('div'));
  });
  contactDiv.append(deleteContact);
  return contactDiv;
};

//Function to delete contact
ContactManager.prototype.deleteContact = function(contact) {
  contact.remove();
};

//Function which validates contacts details
ContactManager.prototype.validateContactInformation = function() {
  return(this.validateName(this.userNameInput.val().trim()) && this.validateEmail(this.userMailInput.val().trim()));
};

//Function which validates name
ContactManager.prototype.validateName = function(name) {
  return (name !== "");
};

//Function to validate email
ContactManager.prototype.validateEmail = function(email) {
  const emailRegEx = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-z]{2,4})$/;
  if(email !== "" && email.match(emailRegEx)) {
    return true;
  } else {
    alert('The Email is invalid');
    return false;
  }
};

//Class Contact to store user contact information
function Contact(user) {
  this.name = user.name;
  this.email = user.email;
}

$(function() {
  var options = {
    contactForm : $('[data-usage="contact-form"]'),
    userNameInput : $('input[data-usage="name"]'),
    userMailInput : $('input[data-usage="email"]'),
    addContactButton : $('input[data-usage="add-btn"]'),
    contactDisplayBlock : $('[data-usage="contact-display"]'),
    searchInput : $('[data-usage="search-input"]')
  },
    contact = new ContactManager(options);
  contact.init();
});