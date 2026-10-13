package com.healthtracker.api.healthtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.healthtracker")
@EnableJpaRepositories(basePackages = "com.healthtracker.repository")
public class HealthtrackerApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(HealthtrackerApiApplication.class, args);
    }
}