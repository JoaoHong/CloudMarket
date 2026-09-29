package com.cloudmarket.auth;

import com.cloudmarket.auth.AuthDtos.LoginRequest;
import com.cloudmarket.auth.AuthDtos.RegisterRequest;
import com.cloudmarket.auth.AuthDtos.UserResponse;
import com.cloudmarket.common.BusinessException;
import com.cloudmarket.user.User;
import com.cloudmarket.user.UserRepository;
import com.cloudmarket.user.UserRole;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Autenticação por sessão. O React chama estes endpoints com o cookie de sessão
 * e nunca manipula tokens diretamente.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    /** Garante que o cookie XSRF-TOKEN exista (o front chama ao iniciar). */
    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken token) {
        return Map.of("headerName", token.getHeaderName());
    }

    /** Usuário logado, ou 204 se for visitante. */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal AppUserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(UserResponse.from(principal));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public UserResponse register(@Valid @RequestBody RegisterRequest body,
                                 HttpServletRequest request, HttpServletResponse response) {
        if (users.existsByEmailIgnoreCase(body.email())) {
            throw new BusinessException("Já existe uma conta com este e-mail.");
        }
        User user = users.save(new User(body.name().trim(), body.email().trim().toLowerCase(),
                passwordEncoder.encode(body.password()), UserRole.BUYER));
        AppUserPrincipal principal = AppUserPrincipal.from(user);
        return startSession(principal, request, response);
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest body,
                              HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(body.email().trim(), body.password()));
        return startSession((AppUserPrincipal) auth.getPrincipal(), request, response);
    }

    // logout: POST /api/auth/logout é tratado pelo Spring Security (ver SecurityConfig)

    private UserResponse startSession(AppUserPrincipal principal,
                                      HttpServletRequest request, HttpServletResponse response) {
        // evita session fixation
        if (request.getSession(false) != null) {
            request.changeSessionId();
        }
        AppUserPrincipal safe = principal.withoutPassword();
        Authentication authenticated = UsernamePasswordAuthenticationToken.authenticated(
                safe, null, safe.getAuthorities());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authenticated);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);
        return UserResponse.from(safe);
    }
}
