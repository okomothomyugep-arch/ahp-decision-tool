package com.ahp.ahp_decision_tool.model;

import lombok.Data;
import java.util.Map;

@Data
public class AHPResult {
    private boolean consistent;
    private String bestAlternative;
    private Map<String, Double> criteriaWeights;
    private Map<String, Double> alternativeScores;
    private Double consistencyRatio;
    private String inconsistencyReason;
}