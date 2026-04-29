package com.ahp.ahp_decision_tool.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ahp.ahp_decision_tool.model.AHPResult;
import com.ahp.ahp_decision_tool.model.PairwiseComparisonRequest;
import com.ahp.ahp_decision_tool.service.AHPService;

@RestController
@RequestMapping("/api/ahp")
@CrossOrigin(origins = "http://localhost:3000")
public class AHPController {
    
    @Autowired
    private AHPService ahpService;
    
    @PostMapping("/analyze")
    public AHPResult analyzeAlternatives(@RequestBody PairwiseComparisonRequest request) {
        return ahpService.processAHP(request);
    }
}