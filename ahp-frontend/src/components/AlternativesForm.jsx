import React, { useState } from 'react';
import './AlternativesForm.css';

const AlternativesForm = ({ criteria, alternatives, setAlternatives }) => {
  const [newAlternativeName, setNewAlternativeName] = useState('');

  const addAlternative = () => {
    if (!newAlternativeName.trim()) return;
    const newId = `alt${alternatives.length + 1}`;
    const scores = {};
    criteria.forEach(c => {
      scores[c.id] = c.type === 'numerical' ? 0 : '';
    });
    setAlternatives([
      ...alternatives,
      {
        id: newId,
        name: newAlternativeName,
        scores: scores
      }
    ]);
    setNewAlternativeName('');
  };

  const removeAlternative = (index) => {
    if (alternatives.length <= 2) return;
    const newAlternatives = alternatives.filter((_, i) => i !== index);
    setAlternatives(newAlternatives);
  };

  const updateScore = (altIndex, criterionId, value) => {
    const newAlternatives = [...alternatives];
    if (typeof value === 'string' && !isNaN(value) && value !== '') {
      value = parseFloat(value);
    }
    newAlternatives[altIndex].scores[criterionId] = value;
    setAlternatives(newAlternatives);
  };

  return (
    <div className="alternatives-form">
      <div className="section">
        <h2>Alternatives</h2>
        <div className="alternatives-list">
          {alternatives.map((alt, idx) => (
            <div key={alt.id} className="alternative-item">
              <div className="alternative-header">
                <h3>{alt.name}</h3>
                <button
                  className="btn-remove-alt"
                  onClick={() => removeAlternative(idx)}
                  disabled={alternatives.length <= 2}
                >
                  Remove
                </button>
              </div>
              <div className="scores-grid">
                {criteria.map(criterion => (
                  <div key={criterion.id} className="score-field">
                    <label>{criterion.name}</label>
                    {criterion.type === 'numerical' ? (
                      <input
                        type="number"
                        step="any"
                        value={alt.scores[criterion.id] || ''}
                        onChange={(e) => updateScore(idx, criterion.id, e.target.value)}
                        placeholder="Enter value"
                      />
                    ) : (
                      <input
                        type="text"
                        value={alt.scores[criterion.id] || ''}
                        onChange={(e) => updateScore(idx, criterion.id, e.target.value)}
                        placeholder="Enter category"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="add-alternative">
          <input
            type="text"
            placeholder="New alternative name"
            value={newAlternativeName}
            onChange={(e) => setNewAlternativeName(e.target.value)}
          />
          <button onClick={addAlternative}>Add Alternative</button>
        </div>
      </div>
    </div>
  );
};

export default AlternativesForm;