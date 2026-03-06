package com.example.demo.service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.AbstractMap.SimpleEntry;

import org.springframework.stereotype.Service;

import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.ChatMessageRepository;

@Service
public class ChatbotService {
    private static final String DEFAULT_ANSWER = "Sorry, I don't know this answer.";
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9 ]");
    private static final Pattern MULTI_SPACE = Pattern.compile("\\s+");

    private final ChatMessageRepository repository;

    public ChatbotService(ChatMessageRepository repository) {
        this.repository = repository;
    }

    public ChatMessage saveQA(ChatMessage message) {
        return repository.save(message);
    }

    public String getAnswer(String question) {
        if (question == null || question.trim().isEmpty()) {
            return DEFAULT_ANSWER;
        }

        String trimmedQuestion = question.trim();
        return repository.findByQuestionIgnoreCase(trimmedQuestion)
                .map(ChatMessage::getAnswer)
                .orElseGet(() -> findClosestAnswer(trimmedQuestion));
    }

    private String findClosestAnswer(String userQuestion) {
        String normalizedUserQuestion = normalize(userQuestion);
        if (normalizedUserQuestion.isEmpty()) {
            return DEFAULT_ANSWER;
        }

        Set<String> userTokens = tokenize(normalizedUserQuestion);

        return repository.findAll().stream()
                .filter(message -> message.getQuestion() != null && message.getAnswer() != null)
                .map(message -> new SimpleEntry<>(message, score(normalizedUserQuestion, userTokens, message.getQuestion())))
                .filter(entry -> entry.getValue() > 0)
                .max(Comparator.comparingInt(SimpleEntry::getValue))
                .map(entry -> entry.getKey().getAnswer())
                .orElse(DEFAULT_ANSWER);
    }

    private int score(String normalizedUserQuestion, Set<String> userTokens, String candidateQuestion) {
        String normalizedCandidateQuestion = normalize(candidateQuestion);
        if (normalizedCandidateQuestion.isEmpty()) {
            return 0;
        }

        Set<String> candidateTokens = tokenize(normalizedCandidateQuestion);
        int commonTokens = 0;
        for (String token : userTokens) {
            if (candidateTokens.contains(token)) {
                commonTokens++;
            }
        }

        int score = commonTokens * 10;
        if (normalizedCandidateQuestion.contains(normalizedUserQuestion)) {
            score += 40;
        }
        if (normalizedUserQuestion.contains(normalizedCandidateQuestion)) {
            score += 30;
        }

        return score;
    }

    private Set<String> tokenize(String text) {
        Set<String> tokens = new HashSet<>();
        for (String token : Arrays.asList(text.split(" "))) {
            if (token.length() >= 3) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private String normalize(String text) {
        String normalized = text.toLowerCase(Locale.ENGLISH);
        normalized = NON_ALPHANUMERIC.matcher(normalized).replaceAll(" ");
        normalized = MULTI_SPACE.matcher(normalized).replaceAll(" ").trim();
        return normalized;
    }
}
