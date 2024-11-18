export default class Experience {
  constructor(_id, owner, description, participants = []) {
    this._id = _id;
    this.owner = owner; 
    this.description = description;
    this.participants = participants; 
  }

  getOwnerName() {
    return this.owner.name;
  }

  getParticipantNames() {
    return this.participants.map((participant) => participant.name).join(", ");
  }
}
