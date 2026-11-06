/**
 * Acceso seguro a localStorage: en modo privado, con datos bloqueados o en Node (pruebas) puede no existir.
 * Si falla, todo sigue funcionando en memoria mientras la pestaña esté abierta.
 */
const memory = new Map();

const hasLocalStorage = () => {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

export const readJson = (key, fallback) => {
  try {
    if (hasLocalStorage()) {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }
  } catch {
    // Dato corrupto o almacenamiento bloqueado: se usa el valor de respaldo.
  }
  return memory.has(key) ? memory.get(key) : fallback;
};

export const writeJson = (key, value) => {
  memory.set(key, value);
  try {
    if (hasLocalStorage()) window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin almacenamiento persistente: queda en memoria.
  }
};

export const removeKey = (key) => {
  memory.delete(key);
  try {
    if (hasLocalStorage()) window.localStorage.removeItem(key);
  } catch {
    // Nada que borrar.
  }
};

/** Pequeño almacén observable sobre una llave de localStorage. */
export const createStore = (key, initial) => {
  let state = readJson(key, null) ?? initial();
  const listeners = new Set();
  return {
    get: () => state,
    set: (next) => {
      state = next;
      writeJson(key, next);
      listeners.forEach((listener) => listener(next));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset: () => {
      state = initial();
      writeJson(key, state);
      listeners.forEach((listener) => listener(state));
    },
  };
};
