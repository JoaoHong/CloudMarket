package com.cloudmarket.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank(message = "Informe seu nome") @Size(max = 120) String name,
            @NotBlank(message = "Informe seu e-mail") @Email(message = "E-mail inválido") String email,
            @NotBlank @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres") String password) {
    }

    public record LoginRequest(
            @NotBlank(message = "Informe seu e-mail") String email,
            @NotBlank(message = "Informe sua senha") String password) {
    }

    public record UserResponse(Long id, String name, String email, String role) {
        public static UserResponse from(AppUserPrincipal p) {
            return new UserResponse(p.id(), p.name(), p.email(), p.role());
        }
    }
}
