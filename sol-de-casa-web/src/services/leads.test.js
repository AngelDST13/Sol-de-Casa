import { describe, expect, it } from 'vitest';
import { addLead, getLeads, referralStage, updateLead } from './leadsService.js';
import { AuthError, TEAM_INVITE_CODE, findFamilyByCode, login, register } from './authService.js';

describe('solicitudes', () => {
  it('un vecino referido entra como nuevo y con quién lo refirió', () => {
    const lead = addLead({ name: 'Ana Prueba', phone: '88880000', monthlyBill: 110, refCode: 'FAM-0137' });
    expect(lead.source).toBe('referido');
    expect(lead.status).toBe('nuevo');
    expect(getLeads()[0].id).toBe(lead.id);
  });

  it('cambiar el estado actualiza el juego de la familia', () => {
    const lead = addLead({ name: 'Otro', phone: '88881111', monthlyBill: 90 });
    updateLead(lead.id, { status: 'firmado' });
    const saved = getLeads().find((item) => item.id === lead.id);
    expect(referralStage(saved.status)).toBe(3);
    expect(referralStage('agendado')).toBe(2);
    expect(referralStage('perdido')).toBe(-1);
  });
});

describe('cuentas', () => {
  it('las cuentas demo entran con la contraseña de demo', async () => {
    const user = await login({ email: 'ANDRES@soldecasa.cr', password: 'solar2026' });
    expect(user.role).toBe('team');
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

  it('el equipo necesita el código de invitación', async () => {
    const base = { role: 'team', name: 'Paola', email: 'paola@soldecasa.cr', password: 'clave1234' };
    await expect(register({ ...base, teamCode: 'X' })).rejects.toThrow('código de equipo');
    const user = await register({ ...base, teamCode: TEAM_INVITE_CODE });
    expect(user.role).toBe('team');
  });
});
