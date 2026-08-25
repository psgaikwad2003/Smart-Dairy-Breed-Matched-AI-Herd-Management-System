package com.smartdairy.report.service;

import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Report Generation Service
 * Constructs CSV byte streams for Herd Registers and Milk Collections.
 */
@Service
public class ReportService {

    public byte[] generateHerdCsvReport(List<Map<String, Object>> cattleRecords) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("Tag Number,Breed,Status,Lactation Count,Daily Milk Yield (L),Expected Calving Date");

        for (Map<String, Object> c : cattleRecords) {
            writer.printf("%s,%s,%s,%s,%s,%s%n",
                    c.getOrDefault("tagNumber", "N/A"),
                    c.getOrDefault("breed", "DESI"),
                    c.getOrDefault("status", "ACTIVE"),
                    c.getOrDefault("lactationCount", 1),
                    c.getOrDefault("currentMilkYieldLitres", 0.0),
                    c.getOrDefault("expectedCalvingDate", "N/A")
            );
        }

        writer.flush();
        return out.toByteArray();
    }

    public byte[] generateMilkCollectionCsvReport(List<Map<String, Object>> milkLogs) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out);

        writer.println("Date,Cow Tag,Session,Quantity (L),Fat %,Earnings (INR)");

        for (Map<String, Object> log : milkLogs) {
            writer.printf("%s,%s,%s,%s,%s,%s%n",
                    log.getOrDefault("date", LocalDate.now().toString()),
                    log.getOrDefault("cowTag", "TN-GJ-001"),
                    log.getOrDefault("session", "MORNING"),
                    log.getOrDefault("quantityLitres", 0.0),
                    log.getOrDefault("fatPercentage", 4.5),
                    log.getOrDefault("earnings", 0)
            );
        }

        writer.flush();
        return out.toByteArray();
    }
}
