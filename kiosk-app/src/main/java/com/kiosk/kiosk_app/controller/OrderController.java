package com.kiosk.kiosk_app.controller;

import com.kiosk.kiosk_app.domain.Order;
import com.kiosk.kiosk_app.domain.Menu;
import com.kiosk.kiosk_app.domain.OrderItem;
import com.kiosk.kiosk_app.dto.*;
import com.kiosk.kiosk_app.repository.MenuRepository;
import com.kiosk.kiosk_app.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

        @Autowired
        private OrderRepository orderRepository;

        @Autowired
        private MenuRepository menuRepository;

        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        // ✅ 주문 생성
        @PostMapping
        @Transactional
        public OrderResponse createOrder(@RequestBody OrderRequest request) {
                Order order = new Order();
                order.setCreatedAt(LocalDateTime.now());
                order.setStatus("PENDING");

                // ✅ 여기에 찍으세요!
                order.setTakeOut(request.isTakeOut());
                System.out.println("💡 받은 request.takeOut: " + request.getTakeOut());
                System.out.println("✅ 저장된 order.takeOut: " + order.getTakeOut());

                order.setTakeOut(request.isTakeOut()); // 요청에서 받은 takeOut

                List<OrderItem> orderItems = new ArrayList<>();
                int totalPrice = 0;
                int totalAmount = 0;

                for (OrderItemRequest item : request.getItems()) {
                        Menu menu = menuRepository.findById(item.getMenuId())
                                        .orElseThrow(() -> new IllegalArgumentException("없는 메뉴 ID"));

                        OrderItem orderItem = new OrderItem();
                        orderItem.setMenu(menu);
                        orderItem.setOrder(order);
                        orderItem.setQuantity(item.getQuantity());
                        orderItem.setPrice(menu.getPrice());

                        orderItems.add(orderItem);
                        totalPrice += menu.getPrice() * item.getQuantity();
                        totalAmount += item.getQuantity();
                }

                order.setItems(orderItems);
                order.setTotalPrice(totalPrice);
                order.setTotalAmount(totalAmount);

                orderRepository.save(order);

                // ✅ takeOut null 방지 처리
                Boolean takeOutValue = order.getTakeOut();
                if (takeOutValue == null)
                        takeOutValue = true;

                List<OrderResponse.ItemDto> itemDtos = orderItems.stream()
                                .map(orderItem -> new OrderResponse.ItemDto(
                                                orderItem.getMenu().getName(),
                                                orderItem.getQuantity(),
                                                orderItem.getPrice()))
                                .collect(Collectors.toList());

                OrderResponse response = new OrderResponse(
                                order.getId(),
                                totalPrice,
                                order.getStatus(),
                                itemDtos,
                                takeOutValue);

                // WebSocket 메시지 전송
                messagingTemplate.convertAndSend("/topic/orders", response);

                return response;
        }

        // ✅ 주문 목록 조회
        @GetMapping
        public List<OrderResponse> getOrders(@RequestParam(required = false) String status) {
                List<Order> orders;

                if (status != null) {
                        orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
                } else {
                        orders = orderRepository.findAllByOrderByIdDesc();
                }

                if (orders == null) {
                        orders = new ArrayList<>();
                }

                return orders.stream()
                                .map(order -> {
                                        Boolean takeOutValue = order.getTakeOut();
                                        if (takeOutValue == null)
                                                takeOutValue = true;

                                        List<OrderResponse.ItemDto> itemDtos = order.getItems().stream()
                                                        .map(orderItem -> new OrderResponse.ItemDto(
                                                                        orderItem.getMenu().getName(),
                                                                        orderItem.getQuantity(),
                                                                        orderItem.getPrice()))
                                                        .collect(Collectors.toList());

                                        return new OrderResponse(
                                                        order.getId(),
                                                        order.getTotalPrice(),
                                                        order.getStatus(),
                                                        itemDtos,
                                                        takeOutValue);
                                })
                                .collect(Collectors.toList());
        }

        // ✅ 주문 상세 조회
        @GetMapping("/{orderId}")
        public OrderDetailResponse getOrderDetail(@PathVariable Long orderId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다."));

                List<OrderItemDetail> items = order.getItems().stream()
                                .map(item -> new OrderItemDetail(
                                                item.getMenu().getName(),
                                                item.getQuantity(),
                                                item.getMenu().getPrice()))
                                .collect(Collectors.toList());

                return new OrderDetailResponse(
                                order.getId(),
                                order.getTotalPrice(),
                                order.getStatus(),
                                items);
        }

        // ✅ 주문 상태 변경
        @PatchMapping("/{orderId}/status")
        public OrderResponse updateOrderStatus(@PathVariable Long orderId,
                        @RequestBody OrderStatusUpdateRequest request) {
                String status = request.getStatus();
                System.out.println("📦 받은 상태값: " + status);

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다."));

                order.setStatus(status);
                orderRepository.save(order);

                Boolean takeOutValue = order.getTakeOut();
                if (takeOutValue == null)
                        takeOutValue = true;

                List<OrderResponse.ItemDto> itemDtos = order.getItems().stream()
                                .map(orderItem -> new OrderResponse.ItemDto(
                                                orderItem.getMenu().getName(),
                                                orderItem.getQuantity(),
                                                orderItem.getPrice()))
                                .collect(Collectors.toList());

                return new OrderResponse(
                                order.getId(),
                                order.getTotalPrice(),
                                order.getStatus(),
                                itemDtos,
                                takeOutValue);
        }
}
