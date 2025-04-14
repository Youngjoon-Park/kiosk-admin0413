package com.kiosk.kiosk_app.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtTokenProvider jwtTokenProvider;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                System.out.println("✅ SecurityConfig 적용됨");

                return http
                                .cors() // WebConfig에 정의된 CORS 설정을 사용합니다.
                                .and()
                                .httpBasic().disable()
                                .csrf().disable() // CSRF 비활성화
                                .authorizeRequests(authz -> authz
                                                .requestMatchers("/api/admin/login").permitAll() // 로그인 페이지 허용

                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // OPTIONS 요청 허용
                                                .requestMatchers("/api/admin/orders").permitAll()
                                                .requestMatchers("/api/admin/orders/**").permitAll()
                                                // .requestMatchers("/api/admin/payments").permitAll()
                                                // .requestMatchers("/api/admin/payments/**").permitAll()
                                                .requestMatchers("/ws-endpoint/**").permitAll() // WebSocket 허용
                                                .requestMatchers("/api/menus").permitAll()

                                                .requestMatchers("/api/admin/validate").permitAll() // 로그인 후 인증 검증 페이지
                                                .requestMatchers("/api/admin/menus/**").permitAll()
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN") // 관리자 권한 설정
                                                .anyRequest().permitAll()) // 나머지 요청은 모두 허용
                                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                                                UsernamePasswordAuthenticationFilter.class) // JwtAuthenticationFilter를
                                                                                            // 추가
                                .build();
        }

        // CORS 설정
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowCredentials(true);
                config.addAllowedOrigin("http://localhost:5173"); // 프론트 주소
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return source;
        }
}
