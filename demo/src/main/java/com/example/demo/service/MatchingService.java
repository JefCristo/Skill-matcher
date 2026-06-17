package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillService skillService;

    public List<User> findComplementaryUsers(Long currentUserId) {
        List<User> allUsers = userRepository.findAll();
        List<User> complementaryUsers = new ArrayList<>();

        List<Skill> currentSkills = skillService.getSkillsByUserId(currentUserId);
        Set<String> currentSkillNames = currentSkills.stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        if (currentSkillNames.isEmpty()) {
            return complementaryUsers;
        }

        for (User otherUser : allUsers) {
            if (otherUser.getId().equals(currentUserId)) {
                continue;
            }

            List<Skill> otherSkills = skillService.getSkillsByUserId(otherUser.getId());
            Set<String> otherSkillNames = otherSkills.stream()
                    .map(Skill::getName)
                    .collect(Collectors.toSet());

            boolean hasComplementarySkill = otherSkillNames.stream()
                    .anyMatch(skill -> !currentSkillNames.contains(skill));

            if (hasComplementarySkill && !otherSkillNames.isEmpty()) {
                complementaryUsers.add(otherUser);
            }
        }

        return complementaryUsers;
    }
}