import { randomUUID } from "node:crypto";

const UNIX_EPOCH = "Thu, 01 Jan 1970 00:00:00 GMT";
const COOKIE_EXPIRE = "Fri, 01 Jan 2100 00:00:00 GMT";
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const parseHost = (host) => {
  if (!host) return "no-host-name-in-http-headers";
  const portOffset = host.indexOf(":");
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

export class Cookie {
  #request;
  #host;
  #cookie = {};
  #preparedCookie = [];

  constructor(request) {
    this.#request = request;
    this.#host = parseHost(request.headers.host);

    this.#parseCookie();
    this.#checkToken();
  }

  get preparedCookie() {
    return this.#preparedCookie;
  }

  get token() {
    return this.#cookie.token;
  }

  #parseCookie = () => {
    const { cookie } = this.#request.headers;

    if (!cookie) return;

    const items = cookie.split(";");

    for (const item of items) {
      const parts = item.split("=");
      const key = parts[0].trim();
      const val = parts[1] ?? "";
      this.#cookie[key] = val.trim();
    }
  };

  #checkToken = () => {
    if (this.token) {
      return;
    }

    this.setCookie("token", randomUUID());
  };

  setCookie = (name, value, httpOnly = true) => {
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${name}=${value}; ${expires}; Path=/; Domain=${this.#host}`;
    if (httpOnly) cookie += "; HttpOnly";
    this.#preparedCookie.push(cookie);
  };

  deleteCookie = (name) => {
    this.#preparedCookie.push(`${name}${COOKIE_DELETE}${this.#host}`);
  };
}
