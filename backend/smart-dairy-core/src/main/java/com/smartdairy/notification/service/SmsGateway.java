package com.smartdairy.notification.service;

/**
 * SMS Gateway interface — abstraction for sending SMS notifications to farmers.
 * In production, implement with Twilio, MSG91, or similar Indian SMS provider.
 * For college/demo scope, MockSmsGateway is used.
 */
public interface SmsGateway {

    /**
     * Send an SMS message to a phone number.
     *
     * @param phoneNumber recipient's phone (Indian format: 10 digits)
     * @param message     SMS text content (max 160 chars recommended)
     * @return true if the SMS was sent/queued successfully
     */
    boolean sendSms(String phoneNumber, String message);
}
