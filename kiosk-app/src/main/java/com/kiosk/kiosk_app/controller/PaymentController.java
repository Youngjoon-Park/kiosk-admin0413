package com.kiosk.kiosk_app.controller;

import com.kiosk.kiosk_app.domain.PaymentHistory;

import com.kiosk.kiosk_app.repository.PaymentHistoryRepository;
import com.kiosk.kiosk_app.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Value("${kakao.admin-key}")
    private String adminKey;

    // 여러 사용자 동시 결제 대응용
    private final Map<Long, String> tidMap = new ConcurrentHashMap<>();

    // JPA 리포지토리 의존성 주입
    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;
    @Autowired
    private OrderService orderService;

    /**
     * 1단계 - 결제 준비 요청
     */
    @PostMapping("/{orderId}")
    public Map<String, String> requestPayment(@PathVariable Long orderId) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", "user123");
        params.add("item_name", "키오스크 주문");
        params.add("quantity", "1");
        params.add("total_amount", "1000");
        params.add("vat_amount", "100");
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://localhost:5173/payment/success?orderId=" + orderId);
        params.add("cancel_url", "http://localhost:5173/payment/cancel");
        params.add("fail_url", "http://localhost:5173/payment/fail");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        System.out.println("📦 요청 파라미터 = " + params);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                URI.create("https://kapi.kakao.com/v1/payment/ready"),
                requestEntity,
                Map.class);

        // tid 저장
        String tid = (String) response.getBody().get("tid");
        tidMap.put(orderId, tid);

        String redirectUrl = (String) response.getBody().get("next_redirect_pc_url");
        return Map.of("redirectUrl", redirectUrl);
    }

    /**
     * 2단계 - 결제 승인 요청
     */
    @PostMapping("/approve")
    public ResponseEntity<?> approvePayment(@RequestBody Map<String, String> payload) {
        String pgToken = payload.get("pgToken");
        String orderIdStr = payload.get("orderId");

        System.out.println("✅ 결제 승인 요청 들어옴 - orderId: " + orderIdStr + ", pgToken: " + pgToken);

        if (pgToken == null || orderIdStr == null || !orderIdStr.matches("\\d+")) {
            return ResponseEntity.badRequest().body("pgToken 또는 orderId가 잘못되었습니다.");
        }

        Long orderId = Long.parseLong(orderIdStr);
        String tid = tidMap.get(orderId);

        if (tid == null) {
            return ResponseEntity.badRequest().body("tid 정보가 없습니다. 결제를 다시 시도해주세요.");
        }

        PaymentHistory existingHistory = paymentHistoryRepository.findByOrderId(orderId);
        if (existingHistory != null && "SUCCESS".equals(existingHistory.getStatus())) {
            System.out.println("✅ 이미 승인된 주문입니다. 재요청 허용");
            return ResponseEntity.ok("이미 승인된 주문입니다.");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("tid", tid);
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", "user123");
        params.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                URI.create("https://kapi.kakao.com/v1/payment/approve"),
                requestEntity,
                String.class);

        PaymentHistory history = PaymentHistory.builder()
                .orderId(orderId)
                .tid(tid)
                .pgToken(pgToken)
                .status("SUCCESS")
                .approvedAt(LocalDateTime.now())
                .build();

        paymentHistoryRepository.save(history);

        // ✅ ✅ 결제 승인 성공 후, 주방에 주문 알림 전송!
        orderService.notifyKitchen(orderService.getOrderEntity(orderId)); // ← 이 줄 추가

        return ResponseEntity.ok(response.getBody());
    }

    /**
     * 결제 취소 요청
     */
    @PostMapping("/cancel")
    public ResponseEntity<?> paymentCancel(@RequestParam Long orderId) {
        String tid = tidMap.get(orderId);

        if (tid == null) {
            System.out.println("❗ tid not found for orderId = " + orderId);
            return ResponseEntity.badRequest().body("tid 정보가 없습니다. 결제를 다시 시도해주세요.");
        }

        // 결제 취소 내역 DB 저장
        PaymentHistory history = PaymentHistory.builder()
                .orderId(orderId)
                .tid(tid)
                .status("CANCELLED") // 결제 상태: CANCELLED
                .approvedAt(LocalDateTime.now()) // 취소 시간
                .build();

        // DB에 결제 취소 내역 저장
        paymentHistoryRepository.save(history);

        return ResponseEntity.ok("결제 취소 처리 완료");
    }

}
