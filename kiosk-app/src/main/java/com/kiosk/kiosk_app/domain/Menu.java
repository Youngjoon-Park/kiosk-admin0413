package com.kiosk.kiosk_app.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int price;
    private String description;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true; // ✅ 이 줄이 핵심!
}
