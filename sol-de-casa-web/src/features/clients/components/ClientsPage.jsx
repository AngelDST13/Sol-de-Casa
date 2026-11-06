import { useMemo, useState } from 'react';
import { PageHeader, StatTile } from '../../../shared/components/index.js';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { useLeads, useShares } from '../../../shared/hooks/useLeads.js';
import { useUsers } from '../../../shared/hooks/useStores.js';
import { buildSavingsHistory, summarizeSavings } from '../../../shared/model/index.js';
import { buildShareUrl } from '../../../shared/utils/shareUrl.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import admin from '../../../shared/components/admin.module.css';

/** Familias con paneles: su ahorro y lo que están trayendo por referidos. */
export const ClientsPage = () => {
  const users = useUsers();
  const leads = useLeads();
  const shares = useShares();
  const [query, setQuery] = useState('');

  const clients = useMemo(
    () =>
      users
        .filter((user) => user.role === 'client' && user.family)
        .map((user) => {
          const summary = summarizeSavings(buildSavingsHistory(user.family));
          const referred = leads.filter((lead) => lead.refCode === user.family.code);
          return {
            ...user,
            saved: summary.total,
            referred: referred.length,
            signed: referred.filter((lead) => lead.status === 'firmado').length,
            shares: shares.filter((share) => share.refCode === user.family.code).length,
          };
        }),
    [users, leads, shares],
  );

  const needle = query.trim().toLowerCase();
  const visible = clients.filter((client) =>
    `${client.name} ${client.email} ${client.family.code} ${client.family.neighborhood}`.toLowerCase().includes(needle),
  );
  const totals = clients.reduce(
    (sum, client) => ({ referred: sum.referred + client.referred, signed: sum.signed + client.signed }),
    { referred: 0, signed: 0 },
  );

  return (
    <>
      <PageHeader level="Operación" title="Clientes">
        Las familias con cuenta en el portal. Son las que pueden traer vecinos: aquí se ve quién comparte y quién trae
        ventas.
      </PageHeader>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatTile label="Familias con cuenta" value={formatInteger(clients.length)} detail="de 420 instaladas" />
        <StatTile label="Vecinos referidos" value={formatInteger(totals.referred)} />
        <StatTile label="Firmaron por referido" value={formatInteger(totals.signed)} tone="good" />
      </div>

      <div className={admin.toolbar}>
        <input
          type="search"
          className={`${admin.input} ${admin.grow}`}
          placeholder="Buscar por nombre, correo, código o barrio"
          aria-label="Buscar clientes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No hay clientes con esa búsqueda" />
      ) : (
        <div className={admin.tableWrap}>
          <table className={admin.table}>
            <thead>
              <tr>
                <th scope="col">Familia</th>
                <th scope="col">Código</th>
                <th scope="col">Barrio</th>
                <th scope="col" className="num">
                  Meses
                </th>
                <th scope="col" className="num">
                  Ahorro total
                </th>
                <th scope="col" className="num">
                  Compartió
                </th>
                <th scope="col" className="num">
                  Referidos
                </th>
                <th scope="col" className="num">
                  Firmaron
                </th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((client) => (
                <tr key={client.id}>
                  <td>
                    <strong>{client.family.name}</strong> {client.id === 'u-familia' && <SimTag />}
                    <br />
                    <span className={admin.muted}>{client.email}</span>
                  </td>
                  <td>
                    <code>{client.family.code}</code>
                  </td>
                  <td>{client.family.neighborhood}</td>
                  <td className="num">{formatInteger(client.family.monthsInstalled)}</td>
                  <td className="num">{formatUsd(client.saved)}</td>
                  <td className="num">{formatInteger(client.shares)}</td>
                  <td className="num">{formatInteger(client.referred)}</td>
                  <td className="num">{formatInteger(client.signed)}</td>
                  <td>
                    <a
                      href={buildShareUrl(`/r/${client.family.code}`)}
                      target="_blank"
                      rel="noreferrer"
                      className={admin.linkButton}
                    >
                      Abrir
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className={admin.muted} style={{ marginTop: 12 }}>
        El ahorro de cada familia es simulado con el 70 % de su recibo; en producción sale del inversor de cada casa.
      </p>
    </>
  );
};
