package com.authservice.dto;

public class NotificationRequest {

    private String email;
    private String name;
    private String investorName;
    private String role;
    private String transactionType;
    private String otp;
    private String type; // OTP or REGISTRATION
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
		this.investorName = name;
	}
	public String getInvestorName() {
		return investorName;
	}
	public void setInvestorName(String investorName) {
		this.investorName = investorName;
		this.name = investorName;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
		this.transactionType = role;
	}
	public String getTransactionType() {
		return transactionType;
	}
	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
		this.role = transactionType;
	}
	public String getOtp() {
		return otp;
	}
	public void setOtp(String otp) {
		this.otp = otp;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
    // getters & setters
