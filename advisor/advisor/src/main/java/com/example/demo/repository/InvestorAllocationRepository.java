package com.example.demo.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.InvestorAllocation;

public interface InvestorAllocationRepository
        extends JpaRepository<InvestorAllocation, Long> {

    List<InvestorAllocation> findByAdvisorId(Long advisorId);

    List<InvestorAllocation> findByInvestorId(Long investorId);

    Optional<InvestorAllocation> findByAdvisorIdAndInvestorId(Long advisorId, Long investorId);
}
