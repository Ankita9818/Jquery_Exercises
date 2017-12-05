//Class ContactManager
function ContactManager(options) {
  this.contactForm = options.contactForm;
  this.userNameInput = options.userNameInput;
  this.userMailInput = options.userMailInput;
  this.addContactButton = options.addContactButton;
  this.contactDisplayBlock = options.contactDisplayBlock;
  this.searchInput = options.searchInput;
  this.deleteContact = options.deleteContact;
  this.contactDivClass = options.contactDivClass;
  this.contactList = [];
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
    _this.deleteContactFromContactList($(this).parent('.' + _this.contactDivClass));
  });
};

//Function to search contacts at real time
ContactManager.prototype.searchContacts = function() {
  var _tempContactList = this.contactList.slice(0),
      searchTerm = this.searchInput.val().toLowerCase(),
      contactName,
      indexToSplice = 0;
  $.each(this.contactList, function(index) {
    contactName = this.name;
    if(contactName.indexOf(searchTerm) === -1) {
      _tempContactList.splice(index - indexToSplice++, 1);
    }
  });
  this.displayContactList(_tempContactList);
};

//Function which creates a contact
ContactManager.prototype.contactCreator = function() {
  var _this = this,
    contact = {
      name : _this.processUserInformation(_this.userNameInput),
      email : _this.processUserInformation(_this.userMailInput)
    },
    user = new Contact(contact);
  if(user.validateContactInformation()) {
    this.contactList.push(user);
    _this.displayContactList(this.contactList);
  }
};

ContactManager.prototype.processUserInformation = function(info) {
  return info.val().trim().toLowerCase();
};

//Function to display contacts
ContactManager.prototype.displayContactList = function(List) {
  var _this = this,
      contact;
  this.contactDisplayBlock.empty();
  $.each(List, function() {
    contact = this.createContact();
    _this.displayContact(contact);
  })
}

//Function to display contact
ContactManager.prototype.displayContact = function(contact) {
  this.contactDisplayBlock.append(contact);
  this.contactForm[0].reset();
};

//Function which deletes the contact
ContactManager.prototype.deleteContactFromContactList = function(contactToBeDeleted) {
  var _temporaryContacts = this.contactList.slice(0);
  $.each(this.contactList, function(index, elem) {
    if(elem.name == contactToBeDeleted.data('name')) {
      _temporaryContacts.splice(index, 1);
    }
  });
  this.contactList = _temporaryContacts;
  this.displayContactList(this.contactList);
};

$(function() {
  var options = {
    contactForm : $('[data-usage="contact-form"]'),
    userNameInput : $('input[data-usage="name"]'),
    userMailInput : $('input[data-usage="email"]'),
    addContactButton : $('input[data-usage="add-btn"]'),
    contactDisplayBlock : $('[data-usage="contact-display"]'),
    searchInput : $('[data-usage="search-input"]'),
    deleteContact : '[data-usage="deleteContact"]',
    contactDivClass : 'contact-div'
  },
    contact = new ContactManager(options);
  contact.init();
});
