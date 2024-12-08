import { randomUUID } from "node:crypto";

class Storage {
  /**
   * @type {Map<string, Map<string, Record>>}
   * @private
   */
  #data = new Map();

  get = (userId, noteId) => {
    return this.#data.get(userId).get(noteId);
  };

  getAll = (userId) => {
    const notes = this.#data.get(userId);

    if (notes) {
      return Array.from(notes.values());
    }

    return "No notes found";
  };

  create = (userId, message) => {
    const notes = this.#data.get(userId);
    const newNote = { id: randomUUID(), createAt: Date.now(), message };

    if (notes) {
      notes.set(newNote.id, newNote);
    } else {
      const notesMap = new Map();
      notesMap.set(newNote.id, newNote);
      this.#data.set(userId, notesMap);
    }

    return newNote;
  };

  edit = (userId, noteId, message) => {
    const notes = this.#data.get(userId);

    if (notes) {
      notes.set(noteId, { id: noteId, createAt: Date.now(), message });
      return notes.get(noteId);
    }

    return "No notes found";
  };

  delete = (userId, noteId) => {
    const notes = this.#data.get(userId);

    if (notes) {
      notes.delete(noteId);
      return { result: "success" };
    }

    return "No notes found";
  };
}

export const storage = new Storage();
