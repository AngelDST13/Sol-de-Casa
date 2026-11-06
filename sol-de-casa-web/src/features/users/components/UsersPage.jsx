import { useState } from 'react';
import { PageHeader } from '../../../shared/components/index.js';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useUsers } from '../../../shared/hooks/useStores.js';
import { POSITIONS, deleteUser, updateUser } from '../../../services/authService.js';
import { timeAgo } from '../../../shared/utils/time.js';
import { NewMemberForm } from './NewMemberForm.jsx';
import admin from '../../../shared/components/admin.module.css';
import styles from './Users.module.css';

const FILTERS = [
  { id: 'team', label: 'Equipo' },
  { id: 'client', label: 'Clientes' },
  { id: 'all', label: 'Todas' },
];

/** Administración de cuentas: puestos, acceso y altas del equipo. */
export const UsersPage = () => {
  const { user: me } = useAuth();
  const users = useUsers();
  const [filter, setFilter] = useState('team');
  const [armed, setArmed] = useState(null);
  const visible = users.filter((user) => filter === 'all' || user.role === filter);

  return (
    <>
      <PageHeader level="Administración" title="Usuarios">
        Quién entra al sistema y qué puede ver. Las asesoras trabajan solicitudes y agenda; los técnicos solo su agenda;
        el administrador ve todo.
      </PageHeader>

      <NewMemberForm />

      <div className={admin.chips} role="group" aria-label="Filtrar cuentas">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={admin.chip}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label} <span>{users.filter((user) => item.id === 'all' || user.role === item.id).length}</span>
          </button>
        ))}
      </div>

      <ul className={styles.list}>
        {visible.map((user) => {
          const isMe = user.id === me.id;
          return (
            <li key={user.id} className={styles.row} data-active={user.active !== false}>
              <span className={styles.avatar} aria-hidden="true">
                {user.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </span>
              <div className={styles.who}>
                <strong>
                  {user.name} {isMe && <em>(usted)</em>} {user.simulated && <SimTag />}
                </strong>
                <span>{user.email}</span>
                <small>Cuenta creada {timeAgo(user.createdAt)}</small>
              </div>
              <div className={styles.controls}>
                {user.role === 'team' ? (
                  <label>
                    <span className="visually-hidden">Puesto de {user.name}</span>
                    <select
                      className={admin.input}
                      value={user.position}
                      disabled={isMe}
                      onChange={(event) => updateUser(user.id, { position: event.target.value }, me.name)}
                    >
                      {Object.entries(POSITIONS).map(([id, position]) => (
                        <option key={id} value={id}>
                          {position.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <span className={styles.clientTag}>Cliente · {user.family?.code}</span>
                )}
                <button
                  type="button"
                  className={styles.toggle}
                  disabled={isMe}
                  aria-pressed={user.active !== false}
                  onClick={() => updateUser(user.id, { active: user.active === false }, me.name)}
                >
                  {user.active === false ? 'Desactivada' : 'Activa'}
                </button>
                {!isMe && (
                  <button
                    type="button"
                    className={admin.danger}
                    data-armed={armed === user.id}
                    onClick={() => {
                      if (armed !== user.id) return setArmed(user.id);
                      deleteUser(user.id, me.name);
                      setArmed(null);
                    }}
                    onBlur={() => setArmed(null)}
                  >
                    {armed === user.id ? '¿Eliminar?' : 'Eliminar'}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
