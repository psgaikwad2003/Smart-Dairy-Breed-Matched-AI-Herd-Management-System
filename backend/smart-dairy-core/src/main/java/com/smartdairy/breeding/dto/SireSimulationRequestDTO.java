package com.smartdairy.breeding.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SireSimulationRequestDTO {
    @NotNull(message = "Cow ID is required")
    private Long cowId;

    @NotNull(message = "Semen Straw ID is required")
    private Long semenStrawId;

    private Boolean a2a2Focus = false;
}
