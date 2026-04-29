import React, { useState, useEffect, useCallback } from 'react';
import './CriteriaMatrix.css';

const CriteriaMatrix = ({ criteria, setCriteria, pairwiseMatrix, setPairwiseMatrix }) => {
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionType, setNewCriterionType] = useState('numerical');

  const initializeMatrix = useCallback(() => {
    const n = criteria.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(1));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else if (i < j) {
          matrix[i][j] = 1;
          matrix[j][i] = 1;
        }
      }
    }
    setPairwiseMatrix(matrix);
  }, [criteria.length, setPairwiseMatrix]);

  useEffect(() => {
    initializeMatrix();
  }, [initializeMatrix]);

  // Le reste du code reste identique...
  const handleMatrixChange = (i, j, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const newMatrix = [...pairwiseMatrix];
    newMatrix[i][j] = numValue;
    newMatrix[j][i] = 1 / numValue;
    setPairwiseMatrix(newMatrix);
  };

  const addCriterion = () => {
    if (!newCriterionName.trim()) return;
    const newId = `c${criteria.length + 1}`;
    setCriteria([
      ...criteria,
      {
        id: newId,
        name: newCriterionName,
        type: newCriterionType,
        categoricalPreferences: {}
      }
    ]);
    setNewCriterionName('');
  };

  const removeCriterion = (index) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(newCriteria);
  };

  const getSaatyScaleDescription = (value) => {
    const descriptions = {
      1: 'Equal importance',
      2: 'Equal to moderate',
      3: 'Moderate importance',
      4: 'Moderate to strong',
      5: 'Strong importance',
      6: 'Strong to very strong',
      7: 'Very strong importance',
      8: 'Very to extremely strong',
      9: 'Extreme importance'
    };
    return descriptions[value] || '';
  };

  return (
    <div className="criteria-matrix">
      <div className="section">
        <h2>Criteria Definition</h2>
        <div className="criteria-list">
          {criteria.map((criterion, idx) => (
            <div key={criterion.id} className="criterion-item">
              <span className="criterion-name">{criterion.name}</span>
              <span className="criterion-type">({criterion.type})</span>
              <button
                className="btn-remove"
                onClick={() => removeCriterion(idx)}
                disabled={criteria.length <= 2}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className="add-criterion">
          <input
            type="text"
            placeholder="New criterion name"
            value={newCriterionName}
            onChange={(e) => setNewCriterionName(e.target.value)}
          />
          <select value={newCriterionType} onChange={(e) => setNewCriterionType(e.target.value)}>
            <option value="numerical">Numerical</option>
            <option value="categorical">Categorical</option>
          </select>
          <button onClick={addCriterion}>Add Criterion</button>
        </div>
      </div>

      {criteria.length > 0 && (
        <div className="section">
          <h2>Pairwise Comparison Matrix</h2>
          <p className="info-text">
            Compare criteria relative importance using Saaty scale (1-9):
            <br />
            <small>1=Equal, 3=Moderate, 5=Strong, 7=Very Strong, 9=Extreme</small>
          </p>
          
          <div className="matrix-container">
            <table className="pairwise-matrix">
              <thead>
                <tr>
                  <th></th>
                  {criteria.map((c, idx) => (
                    <th key={idx}>{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map((rowCriterion, i) => (
                  <tr key={i}>
                    <th>{rowCriterion.name}</th>
                    {criteria.map((colCriterion, j) => (
                      <td key={j}>
                        {i === j ? (
                          <input type="text" value="1" disabled />
                        ) : i < j ? (
                          <div className="matrix-cell">
                            <input
                              type="number"
                              step="1"
                              min="1"
                              max="9"
                              value={pairwiseMatrix[i]?.[j] || 1}
                              onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                            />
                            {pairwiseMatrix[i]?.[j] && (
                              <div className="tooltip">
                                {getSaatyScaleDescription(Math.round(pairwiseMatrix[i][j]))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={pairwiseMatrix[i]?.[j]?.toFixed(2) || ''}
                            disabled
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriteriaMatrix;


// import React, { useState, useEffect } from 'react';
// import './CriteriaMatrix.css';

// const CriteriaMatrix = ({ criteria, setCriteria, pairwiseMatrix, setPairwiseMatrix }) => {
//   const [newCriterionName, setNewCriterionName] = useState('');
//   const [newCriterionType, setNewCriterionType] = useState('numerical');

//   useEffect(() => {
//     initializeMatrix();
//   }, [criteria]);

//   const initializeMatrix = () => {
//     const n = criteria.length;
//     const matrix = Array(n).fill().map(() => Array(n).fill(1));
//     for (let i = 0; i < n; i++) {
//       for (let j = 0; j < n; j++) {
//         if (i === j) {
//           matrix[i][j] = 1;
//         } else if (i < j) {
//           matrix[i][j] = 1;
//           matrix[j][i] = 1;
//         }
//       }
//     }
//     setPairwiseMatrix(matrix);
//   };

//   const handleMatrixChange = (i, j, value) => {
//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) return;
    
//     const newMatrix = [...pairwiseMatrix];
//     newMatrix[i][j] = numValue;
//     newMatrix[j][i] = 1 / numValue;
//     setPairwiseMatrix(newMatrix);
//   };

//   const addCriterion = () => {
//     if (!newCriterionName.trim()) return;
//     const newId = `c${criteria.length + 1}`;
//     setCriteria([
//       ...criteria,
//       {
//         id: newId,
//         name: newCriterionName,
//         type: newCriterionType,
//         categoricalPreferences: {}
//       }
//     ]);
//     setNewCriterionName('');
//   };

//   const removeCriterion = (index) => {
//     const newCriteria = criteria.filter((_, i) => i !== index);
//     setCriteria(newCriteria);
//   };

//   const getSaatyScaleDescription = (value) => {
//     const descriptions = {
//       1: 'Equal importance',
//       2: 'Equal to moderate',
//       3: 'Moderate importance',
//       4: 'Moderate to strong',
//       5: 'Strong importance',
//       6: 'Strong to very strong',
//       7: 'Very strong importance',
//       8: 'Very to extremely strong',
//       9: 'Extreme importance'
//     };
//     return descriptions[value] || '';
//   };

//   return (
//     <div className="criteria-matrix">
//       <div className="section">
//         <h2>Criteria Definition</h2>
//         <div className="criteria-list">
//           {criteria.map((criterion, idx) => (
//             <div key={criterion.id} className="criterion-item">
//               <span className="criterion-name">{criterion.name}</span>
//               <span className="criterion-type">({criterion.type})</span>
//               <button
//                 className="btn-remove"
//                 onClick={() => removeCriterion(idx)}
//                 disabled={criteria.length <= 2}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//         </div>
        
//         <div className="add-criterion">
//           <input
//             type="text"
//             placeholder="New criterion name"
//             value={newCriterionName}
//             onChange={(e) => setNewCriterionName(e.target.value)}
//           />
//           <select value={newCriterionType} onChange={(e) => setNewCriterionType(e.target.value)}>
//             <option value="numerical">Numerical</option>
//             <option value="categorical">Categorical</option>
//           </select>
//           <button onClick={addCriterion}>Add Criterion</button>
//         </div>
//       </div>

//       {criteria.length > 0 && (
//         <div className="section">
//           <h2>Pairwise Comparison Matrix</h2>
//           <p className="info-text">
//             Compare criteria relative importance using Saaty scale (1-9):
//             <br />
//             <small>1=Equal, 3=Moderate, 5=Strong, 7=Very Strong, 9=Extreme</small>
//           </p>
          
//           <div className="matrix-container">
//             <table className="pairwise-matrix">
//               <thead>
//                 <tr>
//                   <th></th>
//                   {criteria.map((c, idx) => (
//                     <th key={idx}>{c.name}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {criteria.map((rowCriterion, i) => (
//                   <tr key={i}>
//                     <th>{rowCriterion.name}</th>
//                     {criteria.map((colCriterion, j) => (
//                       <td key={j}>
//                         {i === j ? (
//                           <input type="text" value="1" disabled />
//                         ) : i < j ? (
//                           <div className="matrix-cell">
//                             <input
//                               type="number"
//                               step="1"
//                               min="1"
//                               max="9"
//                               value={pairwiseMatrix[i]?.[j] || 1}
//                               onChange={(e) => handleMatrixChange(i, j, e.target.value)}
//                             />
//                             {pairwiseMatrix[i]?.[j] && (
//                               <div className="tooltip">
//                                 {getSaatyScaleDescription(Math.round(pairwiseMatrix[i][j]))}
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <input
//                             type="text"
//                             value={pairwiseMatrix[i]?.[j]?.toFixed(2) || ''}
//                             disabled
//                           />
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CriteriaMatrix;