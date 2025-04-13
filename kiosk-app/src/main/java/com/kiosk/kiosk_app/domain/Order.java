package com.kiosk.kiosk_app.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lombok 빌더에서 기본값을 적용하려면 @Builder.Default가 필요합니다.
    @Builder.Default
    @Column(name = "take_out")
    private Boolean takeOut = true; // 기본값 true (포장)

    @Column(name = "order_date")
    private LocalDateTime createdAt;

    @Column(name = "total_price")
    private Integer totalPrice;

    @Column(name = "total_amount")
    private int totalAmount;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    // 주문 항목들의 총 수량 계산
    public int getTotalAmount() {
        return items.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
    }

    // 컨트롤러에서 getTakeOut()을 호출할 경우, null이면 기본값(true)을 반환하도록 오버라이드합니다.
    public Boolean getTakeOut() {
        return takeOut != null ? takeOut : true;
    }

    // 컨트롤러에서 isTakeOut()을 사용할 경우에도 동일한 값을 반환하도록 합니다.
    public Boolean isTakeOut() {
        return getTakeOut();
    }

    // 엔티티가 DB에 저장되기 전에 필요한 값들을 초기화합니다.
    @PrePersist
    public void prePersist() {
        if (takeOut == null) {
            this.takeOut = true;
        }
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
        this.totalAmount = getTotalAmount();
        this.totalPrice = items.stream()
                .mapToInt(item -> item.getQuantity() * item.getPrice())
                .sum();
    }
}
