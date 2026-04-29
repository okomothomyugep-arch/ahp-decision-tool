package com.ahp.ahp_decision_tool.model;

import lombok.Data;
import java.util.Map;

@Data
public class Criterion {
    private String id;
    private String name;
    private String type; // "numerical" or "categorical"
    private Map<String, Double> categoricalPreferences; // for categorical values
}