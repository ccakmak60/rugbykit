import type { SessionStep } from '../game/types';

type JourneyStripProps = {
  steps: SessionStep[];
};

function JourneyStrip({ steps }: JourneyStripProps) {
  return (
    <section className="journey-strip" aria-label="Simulation journey">
      {steps.map((step, index) => (
        <article className={step.active ? 'journey-step active' : 'journey-step'} key={step.label}>
          <small>0{index + 1}</small>
          <strong>{step.label}</strong>
          <span>{step.value}</span>
        </article>
      ))}
    </section>
  );
}

export { JourneyStrip };
