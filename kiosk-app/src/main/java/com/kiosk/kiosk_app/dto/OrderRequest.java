package com.kiosk.kiosk_app.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
    private Boolean takeOut; // ✅ boolean → Boolean

    public boolean isTakeOut() {
        // null인 경우 true를 기본값으로 반환
        return takeOut != null ? takeOut : true;
    }
}
