
package com.healthtracker.api.healthtracker;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {

    @GetMapping("/home")
    public Map<String, String> home() {
        return Map.of(
            "message", "Health Tracker Backend is working!",
            "status", "success"
        );
    }
}
