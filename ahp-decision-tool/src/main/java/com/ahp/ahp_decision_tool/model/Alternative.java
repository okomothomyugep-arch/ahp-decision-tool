package com.ahp.ahp_decision_tool.model;

import lombok.Data;
import java.util.Map;

@Data
public class Alternative {
    private String id;
    private String name;
    private Map<String, Object> scores; // criterionId -> score (number or category)
}