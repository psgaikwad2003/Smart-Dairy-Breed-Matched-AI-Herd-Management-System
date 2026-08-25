package com.smartdairy.web;

import com.smartdairy.report.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/herd-csv")
    public ResponseEntity<byte[]> exportHerdCsv() {
        byte[] csvData = reportService.generateHerdCsvReport(Collections.emptyList());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=herd_register.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/milk-csv")
    public ResponseEntity<byte[]> exportMilkCsv() {
        byte[] csvData = reportService.generateMilkCollectionCsvReport(Collections.emptyList());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=milk_collections.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
