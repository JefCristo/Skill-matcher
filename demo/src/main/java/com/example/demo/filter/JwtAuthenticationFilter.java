package com.example.demo.filter;

import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("🔵 Auth Header received: " + authHeader); // <-- LOG 1

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("🔴 No valid auth header, proceeding without authentication");
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("🟡 Token extracted: " + token.substring(0, Math.min(token.length(), 20)) + "..."); // <-- LOG 2

        if (!jwtUtil.validateToken(token)) {
            System.out.println("🔴 Token validation FAILED!"); // <-- LOG 3
            chain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extractEmail(token);
        System.out.println("🟢 Email extracted: " + email); // <-- LOG 4

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            com.example.demo.entity.User user = userService.findByEmail(email).orElse(null);

            if (user != null) {
                System.out.println("🟢 User found in DB: " + user.getEmail());
                UserDetails userDetails = new User(user.getEmail(), user.getPassword(), new ArrayList<>());
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("🔴 User NOT found in DB!");
            }
        }

        chain.doFilter(request, response);
    }
}