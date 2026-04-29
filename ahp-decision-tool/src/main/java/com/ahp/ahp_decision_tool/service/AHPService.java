package com.ahp.ahp_decision_tool.service;

import com.ahp.ahp_decision_tool.model.AHPResult;
import com.ahp.ahp_decision_tool.model.Alternative;
import com.ahp.ahp_decision_tool.model.Criterion;
import com.ahp.ahp_decision_tool.model.PairwiseComparisonRequest;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AHPService {
    
    private static final double CONSISTENCY_THRESHOLD = 0.1;
    private static final int[][] SAATY_SCALE = {
        {1, 2, 3, 4, 5, 6, 7, 8, 9},
        {1, 1, 1, 1, 1, 1, 1, 1, 1}
    };
    
    public AHPResult processAHP(PairwiseComparisonRequest request) {
        AHPResult result = new AHPResult();
        
        // Check consistency of pairwise comparison matrix
        double consistencyRatio = calculateConsistencyRatio(request.getPairwiseMatrix());
        boolean isConsistent = consistencyRatio <= CONSISTENCY_THRESHOLD;
        
        result.setConsistent(isConsistent);
        result.setConsistencyRatio(consistencyRatio);
        
        if (!isConsistent) {
            result.setInconsistencyReason(analyzeInconsistency(request.getPairwiseMatrix()));
            return result;
        }
        
        // Calculate criteria weights
        Map<String, Double> criteriaWeights = calculateWeights(request.getPairwiseMatrix(), 
            new ArrayList<>(request.getCriteria().keySet()));
        result.setCriteriaWeights(criteriaWeights);
        
        // Calculate alternative scores
        Map<String, Double> alternativeScores = new HashMap<>();
        Map<String, Double> bestAlternative = null;
        double maxScore = -1;
        
        for (Alternative alt : request.getAlternatives().values()) {
            double totalScore = 0;
            for (Criterion criterion : request.getCriteria().values()) {
                double criterionWeight = criteriaWeights.get(criterion.getId());
                double alternativeScore = normalizeAlternativeScore(alt, criterion, request);
                totalScore += criterionWeight * alternativeScore;
            }
            alternativeScores.put(alt.getId(), totalScore);
            
            if (totalScore > maxScore) {
                maxScore = totalScore;
                bestAlternative = Map.of(alt.getId(), totalScore);
            }
        }
        
        result.setAlternativeScores(alternativeScores);
        if (bestAlternative != null) {
            result.setBestAlternative(bestAlternative.keySet().iterator().next());
        }
        
        return result;
    }
    
    private double calculateConsistencyRatio(double[][] matrix) {
        int n = matrix.length;
        double[] weights = calculatePriorityVector(matrix);
        double[] weightedSum = new double[n];
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                weightedSum[i] += matrix[i][j] * weights[j];
            }
        }
        
        double lambdaMax = 0;
        for (int i = 0; i < n; i++) {
            lambdaMax += weightedSum[i] / weights[i];
        }
        lambdaMax /= n;
        
        double ci = (lambdaMax - n) / (n - 1);
        double ri = getRandomConsistencyIndex(n);
        
        return ci / ri;
    }
    
    private double[] calculatePriorityVector(double[][] matrix) {
        int n = matrix.length;
        double[] weights = new double[n];
        
        // Normalize each column
        double[] columnSums = new double[n];
        for (int j = 0; j < n; j++) {
            for (int i = 0; i < n; i++) {
                columnSums[j] += matrix[i][j];
            }
        }
        
        // Calculate normalized matrix and row averages
        for (int i = 0; i < n; i++) {
            double rowSum = 0;
            for (int j = 0; j < n; j++) {
                rowSum += matrix[i][j] / columnSums[j];
            }
            weights[i] = rowSum / n;
        }
        
        return weights;
    }
    
    private Map<String, Double> calculateWeights(double[][] matrix, List<String> criteriaIds) {
        double[] weights = calculatePriorityVector(matrix);
        Map<String, Double> criteriaWeights = new HashMap<>();
        for (int i = 0; i < criteriaIds.size(); i++) {
            criteriaWeights.put(criteriaIds.get(i), weights[i]);
        }
        return criteriaWeights;
    }
    
    private double normalizeAlternativeScore(Alternative alternative, Criterion criterion, 
                                            PairwiseComparisonRequest request) {
        Object score = alternative.getScores().get(criterion.getId());
        
        if (criterion.getType().equals("numerical")) {
            // Normalize numerical values between 0 and 1
            double maxValue = request.getAlternatives().values().stream()
                .mapToDouble(alt -> ((Number) alt.getScores().get(criterion.getId())).doubleValue())
                .max()
                .orElse(1.0);
            double minValue = request.getAlternatives().values().stream()
                .mapToDouble(alt -> ((Number) alt.getScores().get(criterion.getId())).doubleValue())
                .min()
                .orElse(0.0);
            
            double value = ((Number) score).doubleValue();
            return maxValue == minValue ? 1.0 : (value - minValue) / (maxValue - minValue);
        } else {
            // Categorical: use predefined preferences
            String category = (String) score;
            return criterion.getCategoricalPreferences().getOrDefault(category, 0.0);
        }
    }
    
    private double getRandomConsistencyIndex(int n) {
        double[] ri = {0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49};
        return n <= 10 ? ri[n - 1] : 1.49;
    }
    
    private String analyzeInconsistency(double[][] matrix) {
        int n = matrix.length;
        List<String> issues = new ArrayList<>();
        
        // Check for transitivity violations
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int k = j + 1; k < n; k++) {
                    double a_ij = matrix[i][j];
                    double a_jk = matrix[j][k];
                    double expected_a_ik = a_ij * a_jk;
                    double actual_a_ik = matrix[i][k];
                    
                    if (Math.abs(expected_a_ik - actual_a_ik) > 2.0) {
                        issues.add(String.format("Transitivity violation between criteria %d, %d, %d", i+1, j+1, k+1));
                    }
                }
            }
        }
        
        // Check for reciprocal consistency
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (Math.abs(matrix[i][j] * matrix[j][i] - 1.0) > 0.01) {
                    issues.add(String.format("Reciprocal violation between criteria %d and %d: %f * %f ≠ 1", 
                        i+1, j+1, matrix[i][j], matrix[j][i]));
                }
            }
        }
        
        if (issues.isEmpty()) {
            return "The matrix exceeds the consistency threshold. Please review your pairwise comparisons.";
        }
        
        return String.join("; ", issues);
    }
}