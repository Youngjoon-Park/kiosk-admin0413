package com.kiosk.kiosk_app.repository;

import com.kiosk.kiosk_app.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ 기존 상태 기준 정렬 (createdAt 기준)
    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    List<Order> findAllByOrderByCreatedAtDesc();

    // 🔧 ✅ 파라미터 추가해서 정상 동작하도록 수정
    List<Order> findByStatusOrderByIdDesc(String status);

    // ✅ [추가] 전체 주문 정렬 (orderId 기준)
    List<Order> findAllByOrderByIdDesc();

}
