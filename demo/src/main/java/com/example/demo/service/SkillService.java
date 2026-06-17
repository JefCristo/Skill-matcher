package com.example.demo.service;

import com.example.demo.entity.Skill;
import com.example.demo.entity.User;
import com.example.demo.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public Skill addSkillToUser(User user, String skillName) {
        Skill skill = new Skill();
        skill.setName(skillName);
        skill.setUser(user);
        return skillRepository.save(skill);
    }

    public List<Skill> getSkillsByUserId(Long userId) {
        return skillRepository.findByUserId(userId);
    }

    public boolean deleteSkillByIdAndUserId(Long skillId, Long userId) {
        Optional<Skill> skill = skillRepository.findByIdAndUserId(skillId, userId);
        if (skill.isPresent()) {
            skillRepository.delete(skill.get());
            return true;
        }
        return false;
    }
}