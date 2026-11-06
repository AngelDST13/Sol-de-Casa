import { DEMO_FAMILY } from '../shared/model/index.js';
import { getSettings } from './settingsService.js';
import { logActivity } from './activityService.js';
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

/** Puestos del equipo (caso: Andrés, dos asesoras y dos técnicos). */
export const POSITIONS = {
  admin: { label: 'Administrador', hint: 'Ve y cambia todo, incluidos usuarios y ajustes' },
  asesora: { label: 'Asesora de ventas', hint: 'Llama, agenda visitas y sigue las solicitudes' },
  tecnico: { label: 'Técnico', hint: 'Ve su agenda y marca las visitas hechas' },
};

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

const team = (id, name, email, position, extra = {}) => ({
  id,
  role: ROLES.team,
  position,
  name,
  email,
  salt: DEMO_SALT,
  passwordHash: null,
  active: true,
  createdAt: '2026-01-10T15:00:00.000Z',
  ...extra,
});

const seedUsers = () => [
  team('u-andres', 'Andrés Villalobos', 'andres@soldecasa.cr', 'admin'),
  team('u-paola', 'Paola Jiménez', 'paola@soldecasa.cr', 'asesora', { simulated: true }),
  team('u-kevin', 'Kevin Rojas', 'kevin@soldecasa.cr', 'asesora', { simulated: true }),
  team('u-mario', 'Mario Quirós', 'mario@soldecasa.cr', 'tecnico', { simulated: true }),
  team('u-diego', 'Diego Brenes', 'diego@soldecasa.cr', 'tecnico', { simulated: true }),
  {
    id: 'u-familia',
    role: ROLES.client,
    name: 'Ana Rodríguez',
    email: 'familia@soldecasa.cr',
    salt: DEMO_SALT,
    passwordHash: null,
    active: true,
    family: { ...DEMO_FAMILY },
    createdAt: '2025-09-02T15:00:00.000Z',
  },
];

/** Completa lo guardado por la versión anterior: puestos, estado activo y el equipo del caso. */
const migrateUsers = (saved) => {
  const withDefaults = saved.map((user) => ({
    active: true,
    ...user,
    ...(user.role === ROLES.team && !user.position && { position: user.id === 'u-andres' ? 'admin' : 'asesora' }),
  }));
  const ids = new Set(withDefaults.map((user) => user.id));
  return [...withDefaults, ...seedUsers().filter((user) => !ids.has(user.id))];
};

const usersStore = createStore(USERS_KEY, seedUsers, migrateUsers);

export const subscribeUsers = usersStore.subscribe;

const normalizeEmail = (email) => email.trim().toLowerCase();
const publicUser = (user) => {
  if (!user) return null;
  const { salt: _salt, passwordHash: _hash, ...rest } = user;
  return rest;
};

let publicCache = { source: null, list: [] };
/** Lista sin datos sensibles; misma referencia mientras no cambie (para useSyncExternalStore). */
export const getUsers = () => {
  const source = usersStore.get();
  if (publicCache.source !== source) publicCache = { source, list: source.map(publicUser) };
  return publicCache.list;
};

/** Las cuentas sin hash guardan el de la contraseña de demo la primera vez. */
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
  const user = usersStore.get().find((item) => item.id === session.userId);
  return user?.active === false ? null : publicUser(user);
};

export const login = async ({ email, password }) => {
  await ensureDemoHashes();
  const user = usersStore.get().find((item) => item.email === normalizeEmail(email));
  if (!user) throw new AuthError('email', 'No encontramos una cuenta con ese correo.');
  if ((await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new AuthError('password', 'La contraseña no coincide.');
  }
  if (user.active === false) throw new AuthError('email', 'Esta cuenta está desactivada. Hable con Andrés.');
  writeJson(SESSION_KEY, { userId: user.id, at: new Date().toISOString() });
  return publicUser(user);
};

export const logout = () => removeKey(SESSION_KEY);

/**
 * Registro. Un cliente recibe su código de familia (para el link personal) y un historial de ahorro simulado.
 * El equipo necesita el código de invitación vigente y entra como asesora.
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
  if (role === ROLES.team && teamCode?.trim().toUpperCase() !== getSettings().teamInviteCode) {
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
    active: true,
    createdAt: new Date().toISOString(),
    ...(role === ROLES.team && { position: 'asesora' }),
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
  logActivity({ actor: user.name, action: role === ROLES.team ? 'Se unió al equipo' : 'Creó su cuenta de cliente' });
  return publicUser(user);
};

/** El administrador da de alta a alguien del equipo; entra con la contraseña de demo. */
export const createTeamMember = async ({ name, email, position }, actor) => {
  await ensureDemoHashes();
  const cleanEmail = normalizeEmail(email);
  if (usersStore.get().some((user) => user.email === cleanEmail)) {
    throw new AuthError('email', 'Ya existe una cuenta con ese correo.');
  }
  const salt = randomSalt();
  const user = {
    ...team(`u-${Date.now()}`, name.trim(), cleanEmail, position),
    salt,
    passwordHash: await hashPassword(DEMO_PASSWORD, salt),
    createdAt: new Date().toISOString(),
  };
  usersStore.set([...usersStore.get(), user]);
  logActivity({ actor, action: 'Agregó a alguien al equipo', detail: `${user.name} · ${POSITIONS[position].label}` });
  return publicUser(user);
};

export const updateUser = (id, changes, actor) => {
  const target = usersStore.get().find((user) => user.id === id);
  if (!target) return;
  usersStore.set(usersStore.get().map((user) => (user.id === id ? { ...user, ...changes } : user)));
  const detail = [
    changes.position && `puesto: ${POSITIONS[changes.position].label}`,
    changes.active !== undefined && (changes.active ? 'cuenta activada' : 'cuenta desactivada'),
  ]
    .filter(Boolean)
    .join(' · ');
  logActivity({ actor, action: `Cambió la cuenta de ${target.name}`, detail });
};

export const deleteUser = (id, actor) => {
  const target = usersStore.get().find((user) => user.id === id);
  if (!target) return;
  usersStore.set(usersStore.get().filter((user) => user.id !== id));
  logActivity({ actor, action: 'Eliminó una cuenta', detail: target.name });
};

/** La familia dueña de un link personal (para la página del vecino). */
export const findFamilyByCode = (code) => usersStore.get().find((user) => user.family?.code === code)?.family ?? null;

export const listClients = () => getUsers().filter((user) => user.role === ROLES.client);

export const resetUsers = usersStore.reset;
