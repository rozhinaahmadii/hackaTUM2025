export default function AIAdvisor({ messages }) {
  return (
    <div className="card" style={{ marginTop: "30px" }}>
      <h3>AI Financial Insights</h3>

      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <p>{m}</p>
        </div>
      ))}
    </div>
  );
}
