import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Navigation from './components/Navigation';
import CriteriaMatrix from './components/CriteriaMatrix';
import AlternativesForm from './components/AlternativesForm';
import Results from './components/Results';
import { analyzeAHP } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('criteria');
  const [criteria, setCriteria] = useState([
    { id: 'c1', name: 'Price', type: 'numerical', categoricalPreferences: {} },
    { id: 'c2', name: 'Quality', type: 'numerical', categoricalPreferences: {} },
    { id: 'c3', name: 'Service', type: 'numerical', categoricalPreferences: {} }
  ]);
  const [alternatives, setAlternatives] = useState([
    { id: 'alt1', name: 'Option A', scores: {} },
    { id: 'alt2', name: 'Option B', scores: {} },
    { id: 'alt3', name: 'Option C', scores: {} }
  ]);
  const [pairwiseMatrix, setPairwiseMatrix] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (pairwiseMatrix.length === 0) {
      toast.error('Please complete the pairwise comparison matrix');
      return;
    }

    setLoading(true);
    const criteriaMap = {};
    criteria.forEach(c => {
      criteriaMap[c.id] = c;
    });

    const alternativesMap = {};
    alternatives.forEach(alt => {
      const scores = {};
      criteria.forEach(criterion => {
        if (alt.scores[criterion.id]) {
          scores[criterion.id] = alt.scores[criterion.id];
        }
      });
      alternativesMap[alt.id] = {
        id: alt.id,
        name: alt.name,
        scores: scores
      };
    });

    const request = {
      criteria: criteriaMap,
      alternatives: alternativesMap,
      pairwiseMatrix: pairwiseMatrix
    };

    try {
      const result = await analyzeAHP(request);
      setResults(result);
      setActiveTab('results');
      if (!result.consistent) {
        toast.error(`Inconsistent matrix: ${result.inconsistencyReason}`);
      } else {
        toast.success('Analysis completed successfully!');
      }
    } catch (error) {
      toast.error('Error analyzing data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      <div className="container">
        <header className="header">
          <h1>AHP Decision Tool</h1>
          <p>Analytic Hierarchy Process for Multi-Criteria Decision Making</p>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="content">
          {activeTab === 'criteria' && (
            <CriteriaMatrix
              criteria={criteria}
              setCriteria={setCriteria}
              pairwiseMatrix={pairwiseMatrix}
              setPairwiseMatrix={setPairwiseMatrix}
            />
          )}

          {activeTab === 'alternatives' && (
            <AlternativesForm
              criteria={criteria}
              alternatives={alternatives}
              setAlternatives={setAlternatives}
            />
          )}

          {activeTab === 'results' && results && (
            <Results results={results} criteria={criteria} alternatives={alternatives} />
          )}
        </div>

        {activeTab !== 'results' && (
          <div className="action-buttons">
            {activeTab === 'criteria' && (
              <button
                className="btn-next"
                onClick={() => setActiveTab('alternatives')}
              >
                Next: Enter Alternatives
              </button>
            )}
            {activeTab === 'alternatives' && (
              <button
                className="btn-analyze"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Decisions'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;