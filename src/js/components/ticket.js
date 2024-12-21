import moment from "moment";
import { Request } from "./request";
import { Modal } from "./modal";

export class Ticket {
  constructor(parent, ticket) {
    this.parentEl = parent;
    this.host = "http://localhost:7070/?method=";
    this.id = ticket.id;
    this.name = ticket.name;
    this.status = ticket.status;
    this.created = ticket.created;
    this.onStatus = this.onStatus.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDescription = this.onDescription.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.init();
  }

  static get markup() {
    return `
        <div class="status"></div>
        <div class="ticketbody">
          <div class="name"></div>
          <div class="created"></div>
        </div>
        <div class="edit">&#128393;</div>
        <div class="delete">&#128473;</div>
    `;
  }

  static get markdesc() {
    return `
      <span class="desc"></span>
    `;
  }

  init() {
    moment.locale("ru");
    this.xhr = new Request(this.host);
    this.resultDiv = document.querySelector(".result");
    this.addTicketBtn = document.querySelector(".addticket-btn");
    this.ticketDiv = document.createElement("div");
    this.ticketDiv.classList.add("ticket");
    this.ticketDiv.innerHTML = Ticket.markup;
    this.statusDiv = this.ticketDiv.querySelector(".status");
    this.ticketbodyDiv = this.ticketDiv.querySelector(".ticketbody");
    this.nameDiv = this.ticketDiv.querySelector(".name");
    this.createdDiv = this.ticketDiv.querySelector(".created");
    this.editDiv = this.ticketDiv.querySelector(".edit");
    this.deleteDiv = this.ticketDiv.querySelector(".delete");
    this.statusDiv.addEventListener("click", this.onStatus);
    this.deleteDiv.addEventListener("click", this.onDelete);
    this.ticketbodyDiv.addEventListener("click", this.onDescription);
    this.editDiv.addEventListener("click", this.onEdit);
  }

  showTicket() {
    this.statusDiv.textContent = this.status ? "\u{2705}" : "\u{274C}";
    this.nameDiv.textContent = this.name;
    this.createdDiv.textContent = moment(this.created).format("DD.MM.YY HH:mm");
    this.parentEl.append(this.ticketDiv);
  }

  onStatus() {
    const callback = () => {
      this.resultDiv.textContent = "OK";
      this.status = true;
      this.statusDiv.textContent = "\u{2705}";
    };
    this.resultDiv.textContent = "";
    if (this.status === false) {
      this.xhr.sendRequest("PATCH", "closeTicket", callback, this.id);
    }
  }

  onDelete() {
    const modal = new Modal("Delete ticket", Modal.modalDelete, this);
    modal.showModal();
  }

  onDescription() {
    this.descriptionDiv = this.ticketDiv.querySelector(".description");
    if (this.descriptionDiv) {
      this.descriptionDiv.remove();
    } else {
      const callback = () => {
        this.resultDiv.textContent = "OK";
        this.descriptionSpan.textContent =
          "Description: " + JSON.parse(this.xhr.xhr.responseText).description;
      };
      this.descriptionDiv = document.createElement("div");
      this.descriptionDiv.classList.add("description");
      this.descriptionDiv.innerHTML = Ticket.markdesc;
      this.descriptionSpan = this.descriptionDiv.querySelector(".desc");
      this.xhr.sendRequest("GET", "ticketById", callback, this.id, this);
      this.nameDiv.append(this.descriptionDiv);
    }
  }

  onEdit() {
    const modal = new Modal("Edit ticket", Modal.modalAddEdit, this);
    modal.showModal();
  }
}
