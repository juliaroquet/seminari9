export default class User {
  constructor(id, name, mail, password, comment, experiencies = []) {
    this.id = id;
    this.name = name;
    this.mail = mail;
    this.password = password;
    this.comment = comment;
    this.experiencies = experiencies;
  }

  getFullName() {
    return this.name;
  }

  getEmail() {
    return this.mail;
  }
}
