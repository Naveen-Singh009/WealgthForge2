package com.example.demo;

import com.example.demo.entity.Advisor;
import com.example.demo.entity.InvestorAllocation;
import com.example.demo.repository.AdvisorRepository;
import com.example.demo.repository.InvestorAllocationRepository;
import com.example.demo.repository.AdviceRepository;
import com.example.demo.service.AdvisorService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AdvisorServiceTest {

    @Mock
    private AdvisorRepository advisorRepo;

    @Mock
    private InvestorAllocationRepository allocationRepo;

    @Mock
    private AdviceRepository adviceRepo;

    @InjectMocks
    private AdvisorService service;

    @Test
    void testRegisterAdvisor() {

        Advisor advisor = new Advisor();
        advisor.setName("Rahul");
        advisor.setEmail("rahul@gmail.com");

        when(advisorRepo.save(any(Advisor.class)))
                .thenReturn(advisor);

        Advisor saved = service.register(advisor);

        assertNotNull(saved);
        assertEquals("Rahul", saved.getName());
        assertEquals("rahul@gmail.com", saved.getEmail());

        verify(advisorRepo).save(any(Advisor.class));
    }

    @Test
    void testAssignInvestorReturnsExistingAllocation() {

        InvestorAllocation allocation = new InvestorAllocation();
        allocation.setId(100L);
        allocation.setAdvisorId(2L);
        allocation.setInvestorId(10L);

        when(allocationRepo.findByAdvisorIdAndInvestorId(2L, 10L))
                .thenReturn(Optional.of(allocation));

        InvestorAllocation result = service.assignInvestor(2L, 10L);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals(2L, result.getAdvisorId());
        assertEquals(10L, result.getInvestorId());

        verify(allocationRepo).findByAdvisorIdAndInvestorId(2L, 10L);
        verify(allocationRepo, never()).save(any(InvestorAllocation.class));
    }

    @Test
    void testGetAllocatedAdvisorsByInvestor() {

        InvestorAllocation first = new InvestorAllocation();
        first.setAdvisorId(7L);
        first.setInvestorId(99L);

        InvestorAllocation duplicate = new InvestorAllocation();
        duplicate.setAdvisorId(7L);
        duplicate.setInvestorId(99L);

        InvestorAllocation second = new InvestorAllocation();
        second.setAdvisorId(9L);
        second.setInvestorId(99L);

        when(allocationRepo.findByInvestorId(99L))
                .thenReturn(List.of(first, duplicate, second));

        List<Long> allocatedAdvisorIds = service.getAllocatedAdvisors(99L);

        assertEquals(2, allocatedAdvisorIds.size());
        assertEquals(List.of(7L, 9L), allocatedAdvisorIds);
        verify(allocationRepo).findByInvestorId(99L);
    }
}
