import { Sparkles } from 'lucide-react';

type HomeScreenProps = {
  onStart: () => void;
};

function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <section className="screen-shell home-screen">
      <div className="screen-copy">
        <p className="eyebrow"><Sparkles size={16} /> RugbyKit lab</p>
        <h1>Coach one player through a live rugby decision cycle.</h1>
        <p className="lede">Pick a mode, brief the player, run tactical phases, then review form, confidence and fatigue like a matchday staff room.</p>
        <button className="screen-cta" onClick={onStart}>Start session</button>
      </div>
      <div className="product-card-stack">
        <article><span>01</span><strong>Select player</strong><p>Choose role, unit and current form.</p></article>
        <article><span>02</span><strong>Run phase</strong><p>Match tactic against player strengths.</p></article>
        <article><span>03</span><strong>Debrief</strong><p>Review selection impact after session.</p></article>
      </div>
    </section>
  );
}

export { HomeScreen };
