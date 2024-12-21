import { Ticket } from "./ticket";

export class Tickets {
  constructor(tickets) {
    this.tickets = tickets;
    this.init();
  }

  init() {
    const divTickets = document.querySelector(".tickets");
    this.tickets.tickets.forEach((item) => {
      const ticket = new Ticket(divTickets, item);
      ticket.showTicket();
    });
  }
}
