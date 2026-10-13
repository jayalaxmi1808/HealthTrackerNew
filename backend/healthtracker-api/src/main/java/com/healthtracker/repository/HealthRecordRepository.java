package com.healthtracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthtracker.api.healthtracker.HealthRecord;

public interface HealthRecordRepository
        extends JpaRepository<HealthRecord, Long> {

    List<HealthRecord> findByActivityDate(String activityDate);
}