import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { addLead } from '../../../services/leadsService.js';
import { findFamilyByCode } from '../../../services/authService.js';
import { SAVINGS, buildSavingsHistory, savingsCalculator, summarizeSavings } from '../../../shared/model/index.js';

const PHONE_PATTERN = /^[0-9 +-]{8,}$/;

/** Los tres pasos del vecino: calcular, dejar dos datos y listo. */
export const useNeighborFlow = () => {
  const { code } = useParams();
  const [search] = useSearchParams();
  const initialBill = Number(search.get('recibo')) || SAVINGS.averageBill;

  const [step, setStep] = useState('calculate');
  const [bill, setBill] = useState(initialBill);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);

  const referrer = useMemo(() => {
    const family = code ? findFamilyByCode(code) : null;
    if (!family) return null;
    return { ...family, ...summarizeSavings(buildSavingsHistory(family)) };
  }, [code]);

  const result = useMemo(() => savingsCalculator(bill), [bill]);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Escriba su nombre para saber a quién llamar.';
    if (!PHONE_PATTERN.test(form.phone.trim())) nextErrors.phone = 'Escriba un teléfono de 8 dígitos.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaved(
      addLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        monthlyBill: bill,
        refCode: referrer ? code : null,
        neighborhood: referrer?.neighborhood ?? '',
      }),
    );
    setStep('done');
    window.scrollTo({ top: 0 });
  };

  return { step, setStep, bill, setBill, result, form, updateField, errors, submit, saved, referrer };
};
