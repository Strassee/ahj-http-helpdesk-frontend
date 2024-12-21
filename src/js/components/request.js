export class Request {
  constructor(host) {
    this.xhr = new XMLHttpRequest();
    this.host = host;
  }

  sendRequest(
    method,
    methodAPI,
    callback = () => {},
    id = false,
    body = false,
  ) {
    // this.resRequest = false;
    // this.xhr.onload = callback;
    // this.xhr.callback = callback;
    const query = this.host + methodAPI + (id ? "&id=" + id : "");
    this.xhr.open(method, query, true);

    this.xhr.onreadystatechange = () => {
      if (
        this.xhr.readyState === XMLHttpRequest.DONE &&
        this.xhr.status >= 200 &&
        this.xhr.status < 300
      ) {
        callback();
      }
    };

    this.xhr.send(body);

    // this.xhr.addEventListener('load', () => {
    //   if (this.xhr.status >= 200 && this.xhr.status < 300) {
    //     if (this.xhr.readyState == 4 && this.xhr.status == 200) {
    //     console.log(this.xhr.status);
    //     this.resultDiv.textContent = 'OK';
    //     callback(this);
    //     }
    //     // callback(this);
    //     // return true;
    //       // try {
    //       //     const data = JSON.parse(xhr.responseText);
    //       //     // console.log(data);
    //           // const tickets = new Tickets(data);
    //       // } catch (e) {
    //       //     console.error(e);
    //       // }
    //   } else {
    //     this.resultDiv.textContent = this.xhr.responseText;
    //     // return false;
    //   }
    // });
  }
}
