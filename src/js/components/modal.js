import { Request } from "./request";
import { load } from "../app";

export class Modal {
  constructor(title, markup, ticket = false) {
    this.parentEl = document.querySelector(".tickets");
    this.host = "http://localhost:7070/?method=";
    this.xhr = new Request(this.host);
    this.title = title;
    this.markup = markup;
    this.ticket = ticket;
    this.parent = document.querySelector("body");
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.createModal();
  }

  static get modalAddEdit() {
    return `
      <div class="modal-content">
        <div class="modal-title"></div>
        <form class="modal-form">
          <input type="hidden" name="id" id="id" class="modal-id" value="">
          <label for="name">Short description</label>
          <input type="text" name="name" id="name" class="modal-name" maxlength="100" placeholder="Enter ticket description...">
          <label for="modal-description">Full description</label>
          <textarea name="description" id="modal-description" class="modal-description" rows="4" maxlength="201" placeholder="Enter ticket full description..."></textarea>
          <div class="modal-buttons">
            <input type="button" class="modal-btn-cancel" value="Cancel">
            <input type="submit" class="modal-btn-ok" value="Ok">
          </div>
          <div class="modal-message"></div>
        </form>
      </div>
    `;
  }

  static get modalDelete() {
    return `
      <div class="modal-content">
        <div class="modal-title"></div>
        <form class="modal-form">
          <div class="modal-question-delete">Are you sure that you want to delete the ticket? This action is irreversible.</div>
          <div class="modal-buttons">
            <input type="button" class="modal-btn-cancel" value="Cancel">
            <input type="submit" class="modal-btn-ok" value="Ok">
          </div>
        </form>
      </div>
    `;
  }

  createModal() {
    this.modal = document.createElement("div");
    this.modal.classList.add("modal");
    this.modal.innerHTML = this.markup;
    this.modalform = this.modal.querySelector(".modal-form");
    this.modaltitle = this.modal.querySelector(".modal-title");
    this.modaltitle.textContent = this.title;
    this.modalbtncancel = this.modal.querySelector(".modal-btn-cancel");
    this.modalbtncancel.addEventListener("click", this.onCancel);
    if (this.title === "Add ticket" || this.title === "Edit ticket") {
      this.modalid = this.modal.querySelector(".modal-id");
      this.modalname = this.modal.querySelector(".modal-name");
      this.modaldescription = this.modal.querySelector(".modal-description");
      this.modalmessage = this.modal.querySelector(".modal-message");
      if (this.title === "Edit ticket") {
        this.onLoadDesc();
      }
    }
    this.modalform.addEventListener("submit", this.onSubmit);
    this.parent.append(this.modal);
  }

  onCancel() {
    this.modal.remove();
  }

  onSubmit(e) {
    e.preventDefault();
    const callback = () => {
      this.onCancel();
      this.parentEl.textContent = "";
      load();
    };
    if (this.title === "Edit ticket") {
      const body = new FormData(this.modalform);
      this.checkValidity()
        ? this.xhr.sendRequest(
            "PUT",
            "changeTicket",
            callback,
            this.ticket.id,
            body,
          )
        : (this.modalmessage.textContent =
            "Please, fill in the fields correctly");
    } else if (this.title === "Add ticket") {
      const body = new FormData(this.modalform);
      this.checkValidity()
        ? this.xhr.sendRequest("POST", "createTicket", callback, false, body)
        : (this.modalmessage.textContent =
            "Please, fill in the fields correctly");
    } else if (this.title === "Delete ticket") {
      this.xhr.sendRequest("DELETE", "deleteTicket", callback, this.ticket.id);
    }
  }

  onLoadDesc() {
    const callback = () => {
      this.modaldescription.value = JSON.parse(
        this.xhr.xhr.responseText,
      ).description;
    };
    this.modalid.value = this.ticket.id;
    this.modalname.value = this.ticket.name;
    this.xhr.sendRequest("GET", "ticketById", callback, this.ticket.id);
  }

  showModal() {
    this.modal.style.display = "block";
  }

  checkValidity() {
    return this.modalname.value.length > 2 &&
      this.modaldescription.value.length > 2
      ? true
      : false;
  }
}
