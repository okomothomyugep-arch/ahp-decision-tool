package com.ahp.ahp_decision_tool.model;

import lombok.Data;
import java.util.Map;

@Data
public class PairwiseComparisonRequest {
    private Map<String, Criterion> criteria;
    private Map<String, Alternative> alternatives;
    private double[][] pairwiseMatrix;
}