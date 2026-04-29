import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Results.css';

const Results = ({ results, criteria, alternatives }) => {
  const COLORS = ['#667eea', '#48bb78', '#f56565', '#ed8936', '#9f7aea', '#fbbf24'];

  const getCriteriaWeightsData = () => {
    return Object.entries(results.criteriaWeights).map(([id, weight]) => ({
      name: criteria.find(c => c.id === id)?.name || id,
      value: weight * 100
    }));
  };

  const getAlternativeScoresData = () => {
    return Object.entries(results.alternativeScores).map(([id, score]) => ({
      name: alternatives.find(a => a.id === id)?.name || id,
      score: score * 100
    }));
  };

  return (
    <div className="results">
      {!results.consistent ? (
        <div className="inconsistency-warning">
          <h2>⚠️ Consistency Check Failed</h2>
          <p>Consistency Ratio: {(results.consistencyRatio * 100).toFixed(2)}%</p>
          <p>Threshold: 10%</p>
          <div className="warning-details">
            <h3>Issues Found:</h3>
            <p>{results.inconsistencyReason}</p>
          </div>
          <button className="btn-back" onClick={() => window.location.reload()}>
            Go Back and Adjust Comparisons
          </button>
        </div>
      ) : (
        <>
          <div className="consistency-info success">
            <h2>✅ Analysis Results</h2>
            <p>Consistency Ratio: {(results.consistencyRatio * 100).toFixed(2)}% (Within acceptable limit)</p>
          </div>

          <div className="best-alternative">
            <h2>🏆 Best Alternative</h2>
            <div className="best-score">
              {alternatives.find(a => a.id === results.bestAlternative)?.name}
            </div>
            <p>
              Score: {(results.alternativeScores[results.bestAlternative] * 100).toFixed(2)}%
            </p>
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h3>Criteria Weights</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCriteriaWeightsData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCriteriaWeightsData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="weights-list">
                {getCriteriaWeightsData().map((item, idx) => (
                  <div key={idx} className="weight-item">
                    <span className="weight-name">{item.name}</span>
                    <div className="weight-bar-container">
                      <div 
                        className="weight-bar" 
                        style={{ width: `${item.value}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                    </div>
                    <span className="weight-value">{item.value.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-card">
              <h3>Alternative Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAlternativeScoresData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#667eea">
                    {getAlternativeScoresData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="scores-list">
                {getAlternativeScoresData()
                  .sort((a, b) => b.score - a.score)
                  .map((item, idx) => (
                    <div key={idx} className="score-item">
                      <span className="score-rank">{idx + 1}</span>
                      <span className="score-name">{item.name}</span>
                      <div className="score-bar-container">
                        <div 
                          className="score-bar" 
                          style={{ width: `${item.score}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                      </div>
                      <span className="score-value">{item.score.toFixed(2)}%</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="detailed-weights">
            <h3>Detailed Criteria Weights</h3>
            <table className="weights-table">
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Weight</th>
                  <th>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {getCriteriaWeightsData()
                  .sort((a, b) => b.value - a.value)
                  .map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.value.toFixed(2)}%</td>
                      <td>
                        <div className="contribution-bar">
                          <div 
                            className="contribution-fill" 
                            style={{ width: `${item.value}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;