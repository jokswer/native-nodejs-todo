import EventEmitter from "node:events";
import { nextTick } from "node:process";
import querystring from "node:querystring";

export const REQUEST_PARSED = "requestParsed";

export class RequestData extends EventEmitter {
  #cookie;
  #request;
  #path;
  #params = {};
  #chunks = [];

  constructor(cookie, request) {
    super();

    this.#cookie = cookie;
    this.#request = request;

    this.#parseParams();
    this.#getBodyData();
  }

  get clientData() {
    return {
      method: this.#request.method,
      path: this.#path,
      userId: this.#cookie.token,
      noteId: this.#params.noteId,
      message: this.#getMessage(),
    };
  }

  #getBodyData = () => {
    if (this.#request.method !== "POST") {
      nextTick(() => this.emit(REQUEST_PARSED, this.clientData));
      return this;
    }

    this.#request.on("data", (chunk) => this.#chunks.push(chunk));
    this.#request.on("end", () => {
      this.emit(REQUEST_PARSED, this.clientData);
    });

    return this;
  };

  #parseParams = () => {
    const [path, ...query] = this.#request.url.split("?");
    this.#path = path;
    this.#params = querystring.parse(query.join(""));
  };

  #getMessage = () => {
    try {
      return JSON.parse(Buffer.concat(this.#chunks).toString("utf-8")).message;
    } catch (error) {
      console.log("Error", error);
      return "";
    }
  };
}
