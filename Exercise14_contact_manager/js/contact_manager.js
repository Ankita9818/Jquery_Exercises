//Class ContactManager
function ContactManager(options) {
  this.contactForm = options.contactForm;
  this.userNameInput = this.contactForm.find('input[data-usage="name"]');
  this.userMailInput = this.contactForm.find('input[data-usage="email"]');
  this.addContactButton = options.addContactButton;
  this.contactDisplayBlock = options.contactDisplayBlock;
  this.searchInput = options.searchInput;
  this.deleteContact = options.deleteContact;
  this.contactList = [];
  this.uId = 0;
}

ContactManager.prototype.init = function() {
  this.bindEventListeners();
};

//Function which binds listeners
ContactManager.prototype.bindEventListeners = function() {
  var _this = this;
  this.addContactButton.on('click', function() {
    _this.contactCreator();
  });
  this.searchInput.on('keyup', function() {
    _this.searchContacts();
  });
  this.contactDisplayBlock.on('click', this.deleteContact, function() {
    _this.deleteUserContact($(this).data('id'));
  });
};

//Function to search contacts at real time
ContactManager.prototype.searchContacts = function() {
  var _tempContactList = [],
      contact,
      searchTerm = this.searchInput.val().toLowerCase();
  $.each(this.contactList, function(index, elem) {
    if(this.name.indexOf(searchTerm) !== -1) {
      contact = elem.createContact();
      _tempContactList.push(contact);
    }
  });
  this.displayContactList(_tempContactList);
};

//Function which creates a contact
ContactManager.prototype.contactCreator = function() {
  var contact = {
        name : this.processUserInformation(this.userNameInput),
        email : this.processUserInformation(this.userMailInput),
        uniqueId : this.uId++
      },
      user = new Contact(contact);
  if(user.validateContact()) {
    this.contactList.push(user);
    this.displayContact(user);
  }
};

//Function to display contact
ContactManager.prototype.displayContact = function(user) {
  var contact = user.createContact();
  this.contactDisplayBlock.append(contact);
  this.contactForm[0].reset();
};

ContactManager.prototype.processUserInformation = function(info) {
  return info.val().trim().toLowerCase();
};

//Function to display contacts
ContactManager.prototype.displayContactList = function(List) {
  var _this = this;
  this.contactDisplayBlock.empty();
  this.contactDisplayBlock.append(List);
};

//Function which deletes the contact
ContactManager.prototype.deleteUserContact = function(contactId) {
  this.deleteContactFromList(contactId);
  $('[data-id=' + contactId + ']').remove();
};

//Function which gets the index of the contact from list
ContactManager.prototype.deleteContactFromList = function(contactId) {
  var _this = this;
  $.each(this.contactList, function(index, elem) {
    if(elem.uniqueId == contactId) {
      _this.contactList.splice(index, 1);
      return false;
    }
  });
};

$(function() {
  var options = {
    contactForm : $('[data-usage="contact-form"]'),
    addContactButton : $('input[data-usage="add-btn"]'),
    contactDisplayBlock : $('[data-usage="contact-display"]'),
    searchInput : $('[data-usage="search-input"]'),
    deleteContact : '[data-usage="delete-contact"]',
  },
    contact = new ContactManager(options);
  contact.init();
});
