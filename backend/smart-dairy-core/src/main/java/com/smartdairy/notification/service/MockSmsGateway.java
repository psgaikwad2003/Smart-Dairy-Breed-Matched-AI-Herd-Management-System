package com.smartdairy.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Mock SMS Gateway — logs SMS messages instead of sending them.
 * Simulates Twilio-compatible behavior for development/demo.
 * Replace with a real implementation for production.
 */
@Component
@Slf4j
public class MockSmsGateway implements SmsGateway {

    @Override
    public boolean sendSms(String phoneNumber, String message) {
        log.info("📱 [MOCK SMS] To: {} | Message: {}", phoneNumber, message);
        // Simulate small network delay in demo
        return true;
    }
}
