export default function ResultCard({ title, result }) {
    if (!result) return null;
  
    return (
      <div className="card result-card">
        <h3>{title}</h3>
  
        <div className="result-grid">
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="result-item">
              <strong>{key}</strong>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }