import { storage } from "./storage.js";

const routing = {
  GET: {
    "/get-all": ({ userId }) => storage.getAll(userId),
    "/note": ({ userId, noteId }) => storage.get(userId, noteId),
  },
  POST: {
    "/note": ({ userId, message }) => storage.create(userId, message),
  },
  PUT: {
    "/note": ({ userId, noteId, message }) =>
      storage.edit(userId, noteId, message),
  },
  DELETE: {
    "/note": ({ userId, noteId }) => storage.delete(userId, noteId),
  },
};

const types = {
  undefined: () => "Not found",
  function: (fn, params) => JSON.stringify(fn(params)),
};

export const router = (client) => {
  try {
    const { method, path } = client;
    const route = routing[method]?.[path];
    console.log(route);
    const type = typeof route;
    const serializer = types[type];
    return serializer(route, client);
  } catch (error) {
    return error.toString();
  }
};
