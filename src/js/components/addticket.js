import { Modal } from "./modal";

export class AddTicket {
  constructor() {
    this.button = document.createElement("button");
    this.button.classList.add("addticket-btn");
    this.button.textContent = "Add ticket";
    this.onAddTicket = this.onAddTicket.bind(this);
    this.init();
  }

  init() {
    this.parent = document.querySelector(".addticket");
    this.button.addEventListener("click", this.onAddTicket);
    this.parent.append(this.button);
  }
  onAddTicket() {
    const modal = new Modal("Add ticket", Modal.modalAddEdit);
    modal.showModal();
  }
}
