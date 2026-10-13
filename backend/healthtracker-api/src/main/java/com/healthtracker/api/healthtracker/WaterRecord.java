
package com.healthtracker.api.healthtracker;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "water_records")
public class WaterRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int glasses;
    private LocalDate recordDate;

    public WaterRecord() {
    }

    public Long getId() {
        return id;
    }

    public int getGlasses() {
        return glasses;
    }

    public void setGlasses(int glasses) {
        this.glasses = glasses;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }
}
