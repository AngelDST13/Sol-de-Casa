import { LTV_CAC_THRESHOLDS } from '../model/index.js';

/** Tono del semáforo de LTV:CAC: good (≥ 3), warn (1 a 3) o bad (< 1). */
export const ltvTone = (ratio) =>
  ratio >= LTV_CAC_THRESHOLDS.healthy ? 'good' : ratio >= LTV_CAC_THRESHOLDS.breakEven ? 'warn' : 'bad';
