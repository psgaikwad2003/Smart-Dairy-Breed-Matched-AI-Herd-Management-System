package com.smartdairy.breeding.engine;

import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CompatibilityStatus;
import com.smartdairy.breeding.dto.BreedValidationResponse;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Breed Compatibility Engine — the core business rule enforcer.
 *
 * Decision logic:
 * 1. Same breed → MATCH
 * 2. Different species (cattle × buffalo) → BLOCKED (no override allowed)
 * 3. In approved crossbreed matrix → MATCH (with crossbreed advisory note)
 * 4. Purebred goal + different breed → BLOCKED (override allowed)
 * 5. Not in matrix → BLOCKED (override allowed with reason)
 */
@Component
public class BreedCompatibilityEngine {

    /**
     * Validate whether a cow breed and semen straw breed are compatible.
     *
     * @param cowBreed      the breed of the cow to be inseminated
     * @param semenBreed    the breed of the semen straw
     * @param breedingGoal  farmer's goal: "MAXIMIZE_MILK_YIELD", "MAINTAIN_PUREBRED", or "GENERAL"
     * @return validation response with status, message, and alternatives if blocked
     */
    public BreedValidationResponse validate(CattleBreed cowBreed, CattleBreed semenBreed, String breedingGoal) {
        if (cowBreed == null || semenBreed == null) {
            return BreedValidationResponse.builder()
                    .status(CompatibilityStatus.BLOCKED)
                    .cowBreed(cowBreed)
                    .semenBreed(semenBreed)
                    .message("Breed information is missing for cow or semen straw.")
                    .overrideAllowed(false)
                    .build();
        }

        // Rule 1: Exact breed match is always valid
        if (cowBreed == semenBreed) {
            return BreedValidationResponse.builder()
                    .status(CompatibilityStatus.MATCH)
                    .cowBreed(cowBreed)
                    .semenBreed(semenBreed)
                    .message(String.format("✅ Perfect match: both cow and semen are %s.",
                            cowBreed.getDisplayName()))
                    .overrideAllowed(false)
                    .build();
        }

        // Rule 2: Biological incompatibility (cattle × buffalo)
        if (!CrossbreedMatrix.isBiologicallyCompatible(cowBreed, semenBreed)) {
            return BreedValidationResponse.builder()
                    .status(CompatibilityStatus.BLOCKED)
                    .cowBreed(cowBreed)
                    .semenBreed(semenBreed)
                    .message(String.format("🚫 BLOCKED: %s (%s) cannot be bred with %s (%s) — "
                                    + "different species, biologically incompatible.",
                            cowBreed.getDisplayName(), cowBreed.getType(),
                            semenBreed.getDisplayName(), semenBreed.getType()))
                    .overrideAllowed(false)  // cannot override biology
                    .suggestedAlternatives(getSameTypeBreeds(cowBreed))
                    .build();
        }

        // Rule 3: Purebred goal — only exact match allowed
        if ("MAINTAIN_PUREBRED".equalsIgnoreCase(breedingGoal)) {
            return BreedValidationResponse.builder()
                    .status(CompatibilityStatus.BLOCKED)
                    .cowBreed(cowBreed)
                    .semenBreed(semenBreed)
                    .message(String.format("⚠️ BLOCKED: Farmer's goal is purebred maintenance. "
                                    + "Cow breed %s does not match semen breed %s. "
                                    + "Use %s semen for purebred line.",
                            cowBreed.getDisplayName(), semenBreed.getDisplayName(),
                            cowBreed.getDisplayName()))
                    .overrideAllowed(true)
                    .suggestedAlternatives(List.of(cowBreed))
                    .build();
        }

        // Rule 4: Approved crossbreed in matrix
        if (CrossbreedMatrix.isApprovedCross(cowBreed, semenBreed)) {
            String goalNote = "MAXIMIZE_MILK_YIELD".equalsIgnoreCase(breedingGoal)
                    ? " This crossbreed is recommended for yield improvement."
                    : "";
            return BreedValidationResponse.builder()
                    .status(CompatibilityStatus.MATCH)
                    .cowBreed(cowBreed)
                    .semenBreed(semenBreed)
                    .message(String.format("✅ Approved crossbreed: %s × %s is in the approved matrix.%s",
                            cowBreed.getDisplayName(), semenBreed.getDisplayName(), goalNote))
                    .overrideAllowed(false)
                    .build();
        }

        // Rule 5: Not in approved matrix — block with override option
        Set<CattleBreed> approvedPartners = CrossbreedMatrix.getApprovedPartners(cowBreed);
        List<CattleBreed> suggestions = new ArrayList<>(approvedPartners);
        suggestions.add(0, cowBreed); // purebred is always a suggestion

        return BreedValidationResponse.builder()
                .status(CompatibilityStatus.BLOCKED)
                .cowBreed(cowBreed)
                .semenBreed(semenBreed)
                .message(String.format("⚠️ BLOCKED: %s × %s is not in the approved crossbreed matrix. "
                                + "Technician override is available — provide a documented reason.",
                        cowBreed.getDisplayName(), semenBreed.getDisplayName()))
                .overrideAllowed(true)
                .suggestedAlternatives(suggestions)
                .build();
    }

    /**
     * Get breeds of the same biological type (cattle or buffalo) for suggestions.
     */
    private List<CattleBreed> getSameTypeBreeds(CattleBreed breed) {
        List<CattleBreed> sameType = new ArrayList<>();
        for (CattleBreed b : CattleBreed.values()) {
            if (b.getType() == breed.getType()) {
                sameType.add(b);
            }
        }
        return sameType;
    }
}
