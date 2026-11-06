import { useMemo } from 'react';
import { REWARDS } from '../../../shared/model/index.js';
import { referralStage } from '../../../services/leadsService.js';
import { useLeads, useShares } from '../../../shared/hooks/useLeads.js';

/** Vecinos que refirió la familia (solicitudes con su código) y los premios ganados. */
export const useFamilyReferrals = (family) => {
  const leads = useLeads();
  const shares = useShares();

  return useMemo(() => {
    const neighbors = leads
      .filter((lead) => lead.refCode === family.code)
      .map((lead) => ({ ...lead, stage: referralStage(lead.status) }));
    const scheduled = neighbors.filter((neighbor) => neighbor.stage >= 2).length;
    const signed = neighbors.filter((neighbor) => neighbor.stage === 3).length;
    const familyRewards = REWARDS.filter((reward) => reward.who === 'Familia que comparte');
    const rewardCost = familyRewards.reduce(
      (sum, reward) => sum + reward.cost * (reward.trigger === 'schedule' ? scheduled : signed),
      0,
    );
    return {
      neighbors,
      scheduled,
      signed,
      monthsOfPlan: scheduled + signed * 2,
      cleanings: signed,
      rewardCost,
      sharesCount: shares.filter((share) => share.refCode === family.code).length,
    };
  }, [leads, shares, family.code]);
};
