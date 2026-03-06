package com.example.demo.service;

import java.io.ByteArrayOutputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.example.demo.model.Notification;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

@Service
public class PdfService {

    public byte[] generateTransactionPdf(Notification notification) {

        String message = notification.getMessage();

        String investorName = extract(message, "Dear (.*?),");
        String portfolioId = extract(message, "Portfolio ID: (\\d+)");
        String asset = extract(message, "Asset: (.*)");
        String price = extract(message, "Price: \\$(.*)");
        String quantity = extract(message, "Quantity: (\\d+)");
        String total = extract(message, "Total: \\$(.*)");
        String date = extract(message, "Date: (.*)");

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("WealthForge Pro"));
        document.add(new Paragraph("-----------------------------"));
        document.add(new Paragraph("Investor Name: " + investorName));
        document.add(new Paragraph("Portfolio ID: " + portfolioId));
        document.add(new Paragraph("Stock Asset: " + asset));
        document.add(new Paragraph("Execution Price: $" + price));
        document.add(new Paragraph("Quantity: " + quantity));
        document.add(new Paragraph("Total Value: $" + total));
        document.add(new Paragraph("Transaction Date: " + date));

        document.close();

        return baos.toByteArray();
    }

    private String extract(String text, String pattern) {
        Pattern p = Pattern.compile(pattern);
        Matcher m = p.matcher(text);
        return m.find() ? m.group(1).trim() : "N/A";
    }
}