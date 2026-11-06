import { describe, expect, it } from 'vitest';
import { addLead, addNote, assignLead, getLeads, referralStage, scheduleVisit, setLeadStatus } from './leadsService.js';
import {
  AuthError,
  TEAM_INVITE_CODE,
  createTeamMember,
  findFamilyByCode,
  getUsers,
  login,
  register,
  updateUser,
} from './authService.js';
import { getActivity } from './activityService.js';
import { generateInviteCode, getSettings, updateSettings } from './settingsService.js';

const find = (id) => getLeads().find((lead) => lead.id === id);

describe('solicitudes', () => {
  it('un vecino referido entra como nuevo, con quién lo refirió y con historial', () => {
    const lead = addLead({ name: 'Ana Prueba', phone: '88880000', monthlyBill: 110, refCode: 'FAM-0137' });
    expect(lead.source).toBe('referido');
    expect(lead.status).toBe('nuevo');
    expect(lead.history).toHaveLength(1);
    expect(getLeads()[0].id).toBe(lead.id);
    expect(getActivity()[0].action).toBe('Nueva solicitud de visita');
  });

  it('agendar la visita guarda técnico y fecha y pasa a «Visita agendada»', () => {
    const lead = addLead({ name: 'Otro', phone: '88881111', monthlyBill: 90 }, 'Paola');
    assignLead(lead.id, 'u-paola', 'Paola Jiménez', 'Andrés');
    scheduleVisit(
      lead.id,
      { visitAt: '2026-11-10T15:00:00.000Z', technicianId: 'u-mario', technicianName: 'Mario' },
      'Paola',
    );
    addNote(lead.id, 'Techo de zinc, revisar estructura', 'Paola');
    const saved = find(lead.id);
    expect(saved.status).toBe('agendado');
    expect(saved.technicianId).toBe('u-mario');
    expect(saved.assignedTo).toBe('u-paola');
    expect(saved.notes[0].text).toBe('Techo de zinc, revisar estructura');
    expect(saved.history.length).toBe(3);
  });

  it('cambiar el estado actualiza el juego de la familia', () => {
    const lead = addLead({ name: 'Tercero', phone: '88882222', monthlyBill: 90 });
    setLeadStatus(lead.id, 'firmado', 'Kevin');
    expect(referralStage(find(lead.id).status)).toBe(3);
    expect(referralStage('agendado')).toBe(2);
    expect(referralStage('perdido')).toBe(-1);
  });
});

describe('cuentas', () => {
  it('las cuentas demo entran con la contraseña de demo', async () => {
    const user = await login({ email: 'ANDRES@soldecasa.cr', password: 'solar2026' });
    expect(user.role).toBe('team');
    expect(user.position).toBe('admin');
    expect(user.passwordHash).toBeUndefined();
  });

  it('rechaza una contraseña equivocada', async () => {
    await expect(login({ email: 'familia@soldecasa.cr', password: 'otra' })).rejects.toBeInstanceOf(AuthError);
  });

  it('un cliente nuevo recibe su código de familia', async () => {
    const user = await register({
      role: 'client',
      name: 'María Fernández',
      email: 'maria@correo.com',
      password: 'clave1234',
      neighborhood: 'Moravia',
      billBefore: 130,
      monthsInstalled: 6,
    });
    expect(user.family.code).toMatch(/^FAM-\d{4}$/);
    expect(user.family.name).toBe('Familia Fernández');
    expect(findFamilyByCode(user.family.code).neighborhood).toBe('Moravia');
  });

  it('el equipo necesita el código de invitación vigente', async () => {
    const base = { role: 'team', name: 'Laura Equipo', email: 'laura@soldecasa.cr', password: 'clave1234' };
    await expect(register({ ...base, teamCode: 'X' })).rejects.toThrow('código de equipo');
    const user = await register({ ...base, teamCode: TEAM_INVITE_CODE });
    expect(user.position).toBe('asesora');

    updateSettings({ teamInviteCode: generateInviteCode() });
    await expect(register({ ...base, email: 'otra@soldecasa.cr', teamCode: TEAM_INVITE_CODE })).rejects.toThrow();
    await expect(
      register({ ...base, email: 'otra@soldecasa.cr', teamCode: getSettings().teamInviteCode }),
    ).resolves.toBeTruthy();
  });

  it('una cuenta desactivada no puede entrar', async () => {
    const member = await createTeamMember(
      { name: 'Técnico Nuevo', email: 'tec@soldecasa.cr', position: 'tecnico' },
      'Andrés',
    );
    updateUser(member.id, { active: false }, 'Andrés');
    await expect(login({ email: 'tec@soldecasa.cr', password: 'solar2026' })).rejects.toThrow('desactivada');
    expect(getUsers().find((user) => user.id === member.id).active).toBe(false);
  });
});
