package com.flightbooking.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SeatLockCleanupScheduler {

    private final SeatService seatService;

    public SeatLockCleanupScheduler(SeatService seatService) {
        this.seatService = seatService;
    }

    @Scheduled(fixedRate = 300000)
    public void cleanupExpiredLocks() {
        seatService.releaseExpiredLocks();
    }
}
