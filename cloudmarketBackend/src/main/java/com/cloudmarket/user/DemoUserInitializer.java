package com.cloudmarket.user;

import com.cloudmarket.config.CloudMarketProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Garante um usuário de demonstração para recrutadores testarem sem se cadastrar:
 * demo@cloudmarket.dev / senha123
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoUserInitializer implements ApplicationRunner {

    public static final String DEMO_EMAIL = "demo@cloudmarket.dev";
    public static final String DEMO_PASSWORD = "senha123";

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final CloudMarketProperties properties;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (properties.demo() == null || !properties.demo().enabled()) {
            return;
        }
        if (!users.existsByEmailIgnoreCase(DEMO_EMAIL)) {
            users.save(new User("Visitante Demo", DEMO_EMAIL, passwordEncoder.encode(DEMO_PASSWORD), UserRole.BUYER));
            log.info("Usuário demo criado: {}", DEMO_EMAIL);
        }
    }
}
