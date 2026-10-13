
package com.healthtracker.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.healthtracker.api.healthtracker.WaterRecord;

public interface WaterRecordRepository
        extends JpaRepository<WaterRecord, Long> {
}
