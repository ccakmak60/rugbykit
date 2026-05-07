type FormTimelineProps = {
  form: number[];
};

function FormTimeline({ form }: FormTimelineProps) {
  return (
    <article className="panel form-panel">
      <div className="panel-head stacked">
        <span className="kicker">review board</span>
        <h2>Form timeline</h2>
      </div>
      <div className="bars">
        {form.map((score, index) => <i key={`${score}-${index}`} style={{ height: `${score}%` }}><span>{score}</span></i>)}
      </div>
    </article>
  );
}

export { FormTimeline };
