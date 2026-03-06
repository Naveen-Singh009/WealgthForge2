package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Notification;
import com.example.demo.service.EmailService;
import com.example.demo.service.PdfService;
import com.example.demo.service.WebSocketService;

@RestController
@RequestMapping({"/notification", "/api/notifications"})
public class NotificationController {

	@Autowired
    EmailService emailService;

    @Autowired
    WebSocketService webSocketService;

    @Autowired
    PdfService pdfService;

    @PostMapping("/send")
    public String sendNotification(@RequestBody Notification notification) {

        byte[] pdfBytes =
                pdfService.generateTransactionPdf(notification);

        emailService.sendEmailWithAttachment(notification, pdfBytes);

        webSocketService.sendNotification(notification.getMessage());

        return "Notification Sent Successfully";
        
    
    }
    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody Notification notification) {

        String subject = "OTP Verification";

        String body = String.format("""
                Dear %s,

                Your OTP is: %s

                Valid for 5 minutes.

                Regards,
                WealthForge Pro
                """,
                notification.getInvestorName(),
                notification.getOtp()
        );

        emailService.sendSimpleEmail(
                notification.getEmail(),
                subject,
                body
        );

        return "OTP Sent Successfully";
    }
    @PostMapping("/send-registration")
    public String sendRegistration(@RequestBody Notification notification) {

        String subject = "Registration Successful";

        String body = String.format("""
                Dear %s,

                Your account has been created successfully.

                Role: %s
                Email: %s

                Welcome to WealthForge Pro 🚀

                """,
                notification.getInvestorName(),
                notification.getTransactionType(), // we use this to pass ROLE
                notification.getEmail()
        );

        emailService.sendSimpleEmail(
                notification.getEmail(),
                subject,
                body
        );

        return "Registration Email Sent Successfully";
    }

}







//package com.example.demo.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.demo.model.Notification;
//import com.example.demo.service.EmailService;
//import com.example.demo.service.WebSocketService;
//
//@RestController
//@RequestMapping({"/notification", "/api/notifications"})
//public class NotificationController {
//
//    @Autowired
//    EmailService emailService;
//
//    @Autowired
//    WebSocketService webSocketService;
//
//
//    @PostMapping("/send")
//    public String sendNotification(@RequestBody Notification notification) {
//
//        emailService.sendEmail(
//                notification.getEmail(),
//                notification.getMessage()
//        );
//
//        webSocketService.sendNotification(
//                notification.getMessage()
//        );
//
//        return "Notification Sent Successfully";
//
//    }
//
//}
