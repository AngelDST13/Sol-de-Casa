import { describe, expect, it } from 'vitest';
import { buildSavingsHistory, DEMO_FAMILY, summarizeSavings } from './simulatedFamily.js';
import { familyTips, milestones, paybackProgress } from './familyInsights.js';

const summary = summarizeSavings(buildSavingsHistory(DEMO_FAMILY));

describe('portal del cliente', () => {
  it('calcula cuánto de la instalación ya se pagó con el ahorro', () => {
    const payback = paybackProgress(summary, { today: new Date(2026, 10, 1) });
    expect(payback.recovered).toBe(summary.total);
    expect(payback.share).toBeCloseTo(summary.total / 6500, 5);
    expect(payback.monthsLeft).toBe(Math.ceil((6500 - summary.total) / (summary.last12 / 12)));
    expect(payback.finishLabel).toMatch(/de 20\d\d$/);
  });

  it('marca las metas alcanzadas', () => {
    const done = milestones(summary)
      .filter((item) => item.done)
      .map((item) => item.id);
    expect(done).toEqual(expect.arrayContaining(['first', '500', 'year', '1000']));
    expect(done).not.toContain('half');
  });

  it('sugiere compartir solo si la familia no ha compartido', () => {
    expect(familyTips({ summary, sharesCount: 0, monthsOfPlan: 0 }).some((tip) => tip.id === 'share')).toBe(true);
    expect(familyTips({ summary, sharesCount: 3, monthsOfPlan: 2 }).some((tip) => tip.id === 'share')).toBe(false);
    expect(familyTips({ summary, sharesCount: 3, monthsOfPlan: 2 }).some((tip) => tip.id === 'plan')).toBe(true);
  });
});
