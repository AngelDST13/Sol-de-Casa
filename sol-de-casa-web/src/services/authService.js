import { DEMO_FAMILY } from '../shared/model/index.js';
import { createStore, readJson, removeKey, writeJson } from './storage.js';

/**
 * Cuentas del PROTOTIPO. Viven en el navegador para que la demo funcione sin servidor.
 * En producción esto va en un backend: contraseñas con bcrypt/argon2, sesión con cookie httpOnly
 * y el código de equipo validado en el servidor. Nada de esto es seguro para datos reales.
 */
const USERS_KEY = 'sol-de-casa:usuarios';
const SESSION_KEY = 'sol-de-casa:sesion';
export const TEAM_INVITE_CODE = 'SOLDECASA-2026';
export const DEMO_PASSWORD = 'solar2026';

export const ROLES = { client: 'client', team: 'team' };

const DEMO_SALT = 'demo-salt';

/** Hash de demostración. Usa SHA-256 si el navegador lo permite (https o localhost). */
export const hashPassword = async (password, salt) => {
  const text = `${salt}:${password}`;
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    const bytes = await subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  // Respaldo para http en la red local (el celular): FNV-1a. Solo para la demo.
  let hash = 0x811c9dc5;
  for (let round = 0; round < 64; round += 1) {
    for (const char of `${round}${text}`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
  }
  return `fnv-${hash.toString(16)}`;
};

const seedUsers = () => [
  {
    id: 'u-andres',
    role: ROLES.team,
    name: 'Andrés Villalobos',
    email: 'andres@soldecasa.cr',
    salt: DEMO_SALT,
    passwordHash: null,
    createdAt: '2026-01-10T15:00:00.000Z',
  },
  {
    id: 'u-familia',
    role: ROLES.client,
    name: 'Ana Rodríguez',
    email: 'familia@soldecasa.cr',
    salt: DEMO_SALT,
    passwordHash: null,
    family: { ...DEMO_FAMILY },
    createdAt: '2025-09-02T15:00:00.000Z',
  },
];

const usersStore = createStore(USERS_KEY, seedUsers);

const normalizeEmail = (email) => email.trim().toLowerCase();
const publicUser = (user) => {
  if (!user) return null;
  const { salt: _salt, passwordHash: _hash, ...rest } = user;
  return rest;
};

/** Las cuentas demo guardan su hash la primera vez (no se puede calcular de forma síncrona). */
const ensureDemoHashes = async () => {
  const users = usersStore.get();
  if (users.every((user) => user.passwordHash)) return;
  const withHashes = await Promise.all(
    users.map(async (user) =>
      user.passwordHash ? user : { ...user, passwordHash: await hashPassword(DEMO_PASSWORD, user.salt) },
    ),
  );
  usersStore.set(withHashes);
};

const randomSalt = () =>
  Array.from(globalThis.crypto?.getRandomValues?.(new Uint8Array(8)) ?? [Date.now() % 255], (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');

const nextFamilyCode = (users) => {
  const taken = new Set(users.map((user) => user.family?.code).filter(Boolean));
  let code;
  do {
    code = `FAM-${String(Math.floor(1000 + Math.random() * 9000))}`;
  } while (taken.has(code));
  return code;
};

export class AuthError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}

export const getSessionUser = () => {
  const session = readJson(SESSION_KEY, null);
  if (!session) return null;
  return publicUser(usersStore.get().find((user) => user.id === session.userId));
};

export const login = async ({ email, password }) => {
  await ensureDemoHashes();
  const user = usersStore.get().find((item) => item.email === normalizeEmail(email));
  if (!user) throw new AuthError('email', 'No encontramos una cuenta con ese correo.');
  if ((await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new AuthError('password', 'La contraseña no coincide.');
  }
  writeJson(SESSION_KEY, { userId: user.id, at: new Date().toISOString() });
  return publicUser(user);
};

export const logout = () => removeKey(SESSION_KEY);

/**
 * Registro. Un cliente recibe su código de familia (para el link personal) y un historial de ahorro simulado.
 * El equipo necesita el código de invitación.
 */
export const register = async ({
  role,
  name,
  email,
  password,
  teamCode,
  neighborhood,
  billBefore,
  monthsInstalled,
}) => {
  await ensureDemoHashes();
  const users = usersStore.get();
  const cleanEmail = normalizeEmail(email);
  if (users.some((user) => user.email === cleanEmail)) {
    throw new AuthError('email', 'Ya existe una cuenta con ese correo. Inicie sesión.');
  }
  if (role === ROLES.team && teamCode?.trim().toUpperCase() !== TEAM_INVITE_CODE) {
    throw new AuthError('teamCode', 'El código de equipo no es válido.');
  }

  const salt = randomSalt();
  const cleanName = name.trim();
  const lastName = cleanName.split(/\s+/).slice(-1)[0];
  const user = {
    id: `u-${Date.now()}`,
    role,
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
    ...(role === ROLES.client && {
      family: {
        code: nextFamilyCode(users),
        name: `Familia ${lastName}`,
        firstName: cleanName.split(/\s+/)[0],
        neighborhood: neighborhood.trim(),
        billBefore: Number(billBefore),
        monthsInstalled: Number(monthsInstalled),
      },
    }),
  };
  usersStore.set([...users, user]);
  writeJson(SESSION_KEY, { userId: user.id, at: new Date().toISOString() });
  return publicUser(user);
};

/** La familia dueña de un link personal (para la página del vecino). */
export const findFamilyByCode = (code) => usersStore.get().find((user) => user.family?.code === code)?.family ?? null;

export const listClients = () =>
  usersStore
    .get()
    .filter((user) => user.role === ROLES.client)
    .map(publicUser);
