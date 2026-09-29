package com.cloudmarket.auth;

import com.cloudmarket.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Usuário autenticado guardado na sessão (precisa ser serializável: a sessão vai para o Postgres).
 */
public record AppUserPrincipal(Long id, String name, String email, String passwordHash, String role)
        implements UserDetails {

    public static AppUserPrincipal from(User user) {
        return new AppUserPrincipal(user.getId(), user.getName(), user.getEmail(),
                user.getPasswordHash(), user.getRole().name());
    }

    /** Cópia sem o hash de senha, para guardar na sessão. */
    public AppUserPrincipal withoutPassword() {
        return new AppUserPrincipal(id, name, email, null, role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
