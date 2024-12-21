import { Request } from "./components/request";
import { Tickets } from "./components/tickets";
import { AddTicket } from "./components/addticket";

export function load() {
  const host = "http://localhost:7070/?method=";
  const xhr = new Request(host);
  xhr.sendRequest("GET", "allTickets");
  xhr.xhr.addEventListener("load", () => {
    if (xhr.xhr.status >= 200 && xhr.xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.xhr.responseText);
        new Tickets(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  new AddTicket();
  load();
});
