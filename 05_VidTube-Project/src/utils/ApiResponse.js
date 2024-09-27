class APiResponse {
  constructor(statusCOde, data, message = "success") {
    this.statusCOde = statusCOde;
    this.data = data;
    this.message = message;
    this.success = statusCOde < 400;
  }
}
export { APiResponse };
