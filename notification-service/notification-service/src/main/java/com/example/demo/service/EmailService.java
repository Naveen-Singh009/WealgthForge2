package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.demo.model.Notification;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ✅ 1. SEND EMAIL WITH PDF (BUY / SELL)
    public void sendEmailWithAttachment(Notification notification, byte[] pdfBytes) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true);

            helper.setTo(notification.getEmail());
            helper.setSubject("Transaction Confirmation");
            helper.setText(notification.getMessage(), false);

            helper.addAttachment(
                    "TransactionReceipt.pdf",
                    new ByteArrayResource(pdfBytes)
            );

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new IllegalStateException("Unable to send transaction email right now.", e);
        }
    }

    // ✅ 2. SEND SIMPLE EMAIL (OTP / REGISTRATION)
    public void sendSimpleEmail(String toEmail, String subject, String body) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, false);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, false);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new IllegalStateException("Unable to send email right now.", e);
        }
    }
}




//package com.example.demo.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendEmail(String email, String message) {
//
//        SimpleMailMessage mail = new SimpleMailMessage();
//
//        mail.setTo(email);
//        mail.setSubject("Stock Notification");
//        mail.setText(message);
//
//        mailSender.send(mail);
//
//    }
//}
