package com.kiosk.kiosk_app.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
public class OrderResponse {
    private Long orderId;
    private int totalPrice;
    private String status;
    private List<ItemDto> items;

    @JsonInclude(JsonInclude.Include.ALWAYS)
    @JsonProperty("takeOut")
    private Boolean takeOut; // ✅ Boolean 객체형

    // ✅ 생성자에서도 Boolean으로 통일
    public OrderResponse(Long id, int totalPrice, String status, List<ItemDto> items, Boolean takeOut) {
        this.orderId = id;
        this.totalPrice = totalPrice;
        this.status = status;
        this.items = items;
        this.takeOut = takeOut;
    }

    @Getter
    @Setter
    public static class ItemDto {
        private String name;
        private int quantity;
        private int price;

        public ItemDto(String name, int quantity, int price) {
            this.name = name;
            this.quantity = quantity;
            this.price = price;
        }
    }
}
