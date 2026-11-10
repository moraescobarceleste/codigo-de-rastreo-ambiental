/** Error con código HTTP para responder desde servicios y controladores. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
