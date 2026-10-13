package com.healthtracker.api.healthtracker;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.healthtracker.repository.HealthRecordRepository;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class HealthRecordController {

    private final HealthRecordRepository repository;

    public HealthRecordController(HealthRecordRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<HealthRecord> getActivities(
            @RequestParam(required = false) String date) {

        if (date == null || date.isBlank()) {
            return repository.findAll();
        }

        return repository.findByActivityDate(date);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HealthRecord addActivity(@RequestBody HealthRecord activity) {

        if (activity.getActivityName() == null
                || activity.getActivityName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Activity name is required");
        }

        if (activity.getCategory() == null
                || activity.getCategory().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Category is required");
        }

        if (activity.getActivityDate() == null
                || activity.getActivityDate().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Activity date is required");
        }

        activity.setCompleted(false);
        return repository.save(activity);
    }

    @PutMapping("/{id}/complete")
    public HealthRecord completeActivity(@PathVariable Long id) {

        HealthRecord activity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Activity not found"));

        activity.setCompleted(true);
        return repository.save(activity);
    }

    @PutMapping("/{id}")
    public HealthRecord updateActivity(
            @PathVariable Long id,
            @RequestBody HealthRecord updatedActivity) {

        HealthRecord activity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Activity not found"));

        if (updatedActivity.getActivityName() != null) {
            activity.setActivityName(updatedActivity.getActivityName());
        }

        if (updatedActivity.getCategory() != null) {
            activity.setCategory(updatedActivity.getCategory());
        }

        if (updatedActivity.getActivityDate() != null) {
            activity.setActivityDate(updatedActivity.getActivityDate());
        }

        activity.setCompleted(updatedActivity.isCompleted());

        return repository.save(activity);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Activity not found");
        }

        repository.deleteById(id);
    }
}