//Class Contact to store user contact information
function Contact(user) {
  this.name = user.name;
  this.email = user.email;
  this.uniqueId = user.uniqueId;
}

//Function which creates a contact
Contact.prototype.createContact = function() {
  var contactDiv = this.createContactView(this.name);
  this.appendInfo(contactDiv, this.email);
  this.appendInfo(contactDiv, this.name);
  return contactDiv;
};

//Function which validates contacts details
Contact.prototype.validateContact = function() {
  return(this.validateName(this.name) && this.validateEmail(this.email));
};

//Function which validates name
Contact.prototype.validateName = function(name) {
  return (name !== "");
};

//Function to validate email
Contact.prototype.validateEmail = function(email) {
  const emailRegEx = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-z0-9]+(\.[a-zA-Z0-9]+)*(\.[a-z]{2,4})$/;
  return (email !== "" && email.match(emailRegEx));
};

//Function which appends user information
Contact.prototype.appendInfo = function(div, info) {
  div.prepend($('<p>', {
    'text' : info
  }));
};

Contact.prototype.createContactView = function(name) {
  var contactDiv = $('<div>',{
      'data-name' : name,
      'data-id' : this.uniqueId
    }).addClass('contact-div'),
    deleteContact = $('<button>', {
      'data-usage' : 'delete-contact',
      'data-id' : this.uniqueId,
      'text' : 'Delete Contact'
    }).addClass('btn');
  contactDiv.append(deleteContact);
  return contactDiv;
};
