import { useReveal } from '../../../shared/hooks/useReveal.js';
import { Hero } from './Hero.jsx';
import { ProofStrip } from './ProofStrip.jsx';
import { SavingsSection } from './SavingsSection.jsx';
import { HowItWorks } from './HowItWorks.jsx';
import { PhotoBand } from './PhotoBand.jsx';
import { Includes } from './Includes.jsx';
import { Testimonials } from './Testimonials.jsx';
import { ReferralCallout } from './ReferralCallout.jsx';
import { Faq } from './Faq.jsx';
import { FinalCta } from './FinalCta.jsx';

export const LandingPage = () => {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <Hero />
      <ProofStrip />
      <SavingsSection />
      <HowItWorks />
      <PhotoBand />
      <Includes />
      <Testimonials />
      <ReferralCallout />
      <Faq />
      <FinalCta />
    </div>
  );
};
