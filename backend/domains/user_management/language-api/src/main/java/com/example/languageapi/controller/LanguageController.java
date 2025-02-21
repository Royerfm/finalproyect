package com.example.languageapi.controller;

import com.example.languageapi.dto.UserDTO;
import com.example.languageapi.service.LanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/language")
public class LanguageController {

    @Autowired
    private LanguageService languageService;

    @PutMapping("/update")
    public String updateLanguage(@RequestBody UserDTO userDTO) {
        return languageService.updateLanguage(userDTO);
    }
}