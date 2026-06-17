package com.example.demo.controller;

import com.example.demo.entity.Skill;
import com.example.demo.entity.User;
import com.example.demo.service.SkillService;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/add")
    public ResponseEntity<?> addSkill(@RequestHeader("Authorization") String authHeader, 
                                      @RequestParam String skillName) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            
            User user = userService.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            skillService.addSkillToUser(user, skillName);
            return ResponseEntity.status(HttpStatus.CREATED).body("Skill '" + skillName + "' added successfully!");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/my-skills")
    public ResponseEntity<?> getMySkills(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            
            User user = userService.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<Skill> skills = skillService.getSkillsByUserId(user.getId());
            return ResponseEntity.ok(skills);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{skillId}")
    public ResponseEntity<?> deleteSkill(@RequestHeader("Authorization") String authHeader,
                                         @PathVariable Long skillId) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            
            User user = userService.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            boolean deleted = skillService.deleteSkillByIdAndUserId(skillId, user.getId());
            if (deleted) {
                return ResponseEntity.ok("Skill deleted successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Skill not found or does not belong to you");
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}