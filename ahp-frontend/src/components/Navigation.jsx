import React from 'react';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'criteria', label: 'Criteria & Matrix' },
    { id: 'alternatives', label: 'Alternatives' },
    { id: 'results', label: 'Results' }
  ];

  return (
    <div className="navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          disabled={tab.id === 'results' && activeTab !== 'results'}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Navigation;