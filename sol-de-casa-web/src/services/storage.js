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

/**
 * Almacén observable sobre una llave de localStorage.
 * `migrate` recibe lo guardado por una versión anterior y lo completa con los campos nuevos.
 */
export const createStore = (key, initial, migrate = (state) => state) => {
  const stored = readJson(key, null);
  let state = stored ? migrate(stored) : initial();
  if (stored) writeJson(key, state);
  const listeners = new Set();
  const emit = () => listeners.forEach((listener) => listener(state));
  return {
    get: () => state,
    set: (next) => {
      state = next;
      writeJson(key, next);
      emit();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset: () => {
      state = initial();
      writeJson(key, state);
      emit();
    },
  };
};
