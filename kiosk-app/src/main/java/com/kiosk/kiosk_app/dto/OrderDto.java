package com.kiosk.kiosk_app.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.kiosk.kiosk_app.domain.Order;
import com.kiosk.kiosk_app.domain.OrderItem;

@Data
public class OrderDto {
    private Long id;
    private List<ItemDto> items;
    private int totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private Boolean takeOut; // ✅ 필드 추가

    public static OrderDto fromEntity(Order order) {
        System.out.println("📦 주문 ID: " + order.getId());
        System.out.println("📦 포함된 아이템 수: " + order.getItems().size());
        System.out.println("📦 주문형태 (takeOut): " + order.getTakeOut());

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setItems(order.getItems().stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList()));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setTakeOut(order.getTakeOut()); // ✅ 추가된 부분

        return dto;
    }

    @Data
    public static class ItemDto {
        private String name;
        private int quantity;

        public static ItemDto fromEntity(OrderItem item) {
            ItemDto dto = new ItemDto();
            dto.setName(item.getMenu().getName());
            dto.setQuantity(item.getQuantity());

            System.out.println("📦 아이템 이름: " + dto.getName());
            System.out.println("📦 수량: " + dto.getQuantity());

            return dto;
        }
    }
}
