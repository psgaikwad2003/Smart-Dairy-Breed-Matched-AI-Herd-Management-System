package com.smartdairy.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

/**
 * Redis subscriber that receives stock update events from Redis Pub/Sub
 * and forwards them to WebSocket clients via STOMP.
 *
 * This bridges Redis → WebSocket, enabling real-time stock updates
 * across multiple backend instances.
 */
@Component
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class StockUpdateSubscriber {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Called when a stock-update message arrives from Redis.
     * Broadcasts to all WebSocket clients subscribed to /topic/stock.
     */
    public void onMessage(String message, String channel) {
        log.debug("Redis stock update received on channel '{}': {}", channel, message);
        messagingTemplate.convertAndSend("/topic/stock", message);
    }
}
