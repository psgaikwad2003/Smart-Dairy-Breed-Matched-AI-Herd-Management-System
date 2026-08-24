package com.smartdairy.breeding.engine;

import com.smartdairy.breeding.dto.BreedValidationResponse;
import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CompatibilityStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for the Breed Compatibility Engine — the core business rule enforcer.
 * Tests every decision path in the 5-rule validation logic.
 */
class BreedCompatibilityEngineTest {

    private BreedCompatibilityEngine engine;

    @BeforeEach
    void setUp() {
        engine = new BreedCompatibilityEngine();
    }

    // ============================================================
    // Rule 1: Same breed → MATCH
    // ============================================================
    @Nested
    @DisplayName("Rule 1: Exact Breed Match")
    class ExactBreedMatch {

        @ParameterizedTest(name = "Same breed {0} should always be MATCH")
        @EnumSource(CattleBreed.class)
        void sameBreed_shouldAlwaysMatch(CattleBreed breed) {
            BreedValidationResponse result = engine.validate(breed, breed, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
            assertThat(result.getMessage()).contains("Perfect match");
        }

        @Test
        @DisplayName("HF cow + HF semen = MATCH regardless of breeding goal")
        void hfPurebred_matchWithPurebredGoal() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.HOLSTEIN_FRIESIAN, CattleBreed.HOLSTEIN_FRIESIAN, "MAINTAIN_PUREBRED");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
        }
    }

    // ============================================================
    // Rule 2: Biological incompatibility (cattle × buffalo)
    // ============================================================
    @Nested
    @DisplayName("Rule 2: Biological Incompatibility")
    class BiologicalIncompatibility {

        @Test
        @DisplayName("Cattle × Buffalo = BLOCKED with no override allowed")
        void cattle_crossedWithBuffalo_shouldBlock() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.HOLSTEIN_FRIESIAN, CattleBreed.MURRAH, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isFalse();
            assertThat(result.getMessage()).contains("biologically incompatible");
        }

        @Test
        @DisplayName("Buffalo × Cattle = BLOCKED with no override")
        void buffalo_crossedWithCattle_shouldBlock() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.MURRAH, CattleBreed.JERSEY, "MAXIMIZE_MILK_YIELD");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isFalse();
        }

        @Test
        @DisplayName("Gir (cattle) × Jaffarabadi (buffalo) = BLOCKED")
        void gir_crossedWithJaffarabadi_shouldBlock() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.GIR, CattleBreed.JAFFARABADI, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.getSuggestedAlternatives()).isNotEmpty();
            assertThat(result.getSuggestedAlternatives())
                    .allMatch(CattleBreed::isCattle);
        }
    }

    // ============================================================
    // Rule 3: Purebred goal blocks crossbreeding
    // ============================================================
    @Nested
    @DisplayName("Rule 3: Purebred Goal Enforcement")
    class PurebredGoal {

        @Test
        @DisplayName("Purebred goal: Sahiwal cow + HF semen = BLOCKED (override allowed)")
        void purebred_differentBreed_shouldBlock() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.SAHIWAL, CattleBreed.HOLSTEIN_FRIESIAN, "MAINTAIN_PUREBRED");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isTrue();
            assertThat(result.getMessage()).contains("purebred maintenance");
        }

        @Test
        @DisplayName("Purebred goal: suggests same breed as alternative")
        void purebred_shouldSuggestSameBreed() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.GIR, CattleBreed.JERSEY, "MAINTAIN_PUREBRED");

            assertThat(result.getSuggestedAlternatives())
                    .contains(CattleBreed.GIR);
        }
    }

    // ============================================================
    // Rule 4: Approved crossbreed matrix
    // ============================================================
    @Nested
    @DisplayName("Rule 4: Approved Crossbreed Matrix")
    class ApprovedCrossbreeds {

        @Test
        @DisplayName("HF × Sahiwal = MATCH (approved for yield improvement)")
        void hf_crossSahiwal_shouldMatch() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.SAHIWAL, CattleBreed.HOLSTEIN_FRIESIAN, "MAXIMIZE_MILK_YIELD");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
            assertThat(result.getMessage()).contains("Approved crossbreed");
            assertThat(result.getMessage()).contains("yield improvement");
        }

        @Test
        @DisplayName("Jersey × Gir = MATCH (approved crossbreed)")
        void jersey_crossGir_shouldMatch() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.GIR, CattleBreed.JERSEY, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
            assertThat(result.getMessage()).contains("Approved crossbreed");
        }

        @Test
        @DisplayName("HF × Red Sindhi = MATCH (approved)")
        void hf_crossRedSindhi_shouldMatch() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.RED_SINDHI, CattleBreed.HOLSTEIN_FRIESIAN, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
        }

        @Test
        @DisplayName("Murrah × Mehsana = MATCH (approved buffalo cross)")
        void murrah_crossMehsana_shouldMatch() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.MURRAH, CattleBreed.MEHSANA, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
        }

        @Test
        @DisplayName("HF Crossbred × HF = MATCH (upgrading with pure exotic)")
        void hfCrossbred_crossHf_shouldMatch() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.HF_CROSSBRED, CattleBreed.HOLSTEIN_FRIESIAN, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
        }
    }

    // ============================================================
    // Rule 5: Unapproved crossbreed — BLOCKED with override
    // ============================================================
    @Nested
    @DisplayName("Rule 5: Unapproved Crossbreeds")
    class UnapprovedCrossbreeds {

        @Test
        @DisplayName("Banni × Pandharpuri = BLOCKED (not in approved matrix, override allowed)")
        void banni_crossPandharpuri_shouldBlock() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.BANNI, CattleBreed.PANDHARPURI, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isTrue();
            assertThat(result.getMessage()).contains("not in the approved crossbreed matrix");
        }

        @Test
        @DisplayName("Tharparkar × Rathi = BLOCKED (both indigenous, no approved cross)")
        void tharparkar_crossRathi_shouldBlock() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.THARPARKAR, CattleBreed.RATHI, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isTrue();
        }

        @Test
        @DisplayName("Blocked result includes suggested alternatives")
        void blocked_shouldIncludeSuggestions() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.HARIANA, CattleBreed.RATHI, "GENERAL");

            assertThat(result.getSuggestedAlternatives()).isNotNull();
            assertThat(result.getSuggestedAlternatives()).isNotEmpty();
            // Purebred (same breed) should be the first suggestion
            assertThat(result.getSuggestedAlternatives().get(0)).isEqualTo(CattleBreed.HARIANA);
        }
    }

    // ============================================================
    // Edge cases
    // ============================================================
    @Nested
    @DisplayName("Edge Cases")
    class EdgeCases {

        @Test
        @DisplayName("Null cow breed = BLOCKED with no override")
        void nullCowBreed_shouldBlock() {
            BreedValidationResponse result = engine.validate(null, CattleBreed.GIR, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isFalse();
            assertThat(result.getMessage()).contains("missing");
        }

        @Test
        @DisplayName("Null semen breed = BLOCKED with no override")
        void nullSemenBreed_shouldBlock() {
            BreedValidationResponse result = engine.validate(CattleBreed.GIR, null, "GENERAL");

            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.BLOCKED);
            assertThat(result.isOverrideAllowed()).isFalse();
        }

        @Test
        @DisplayName("Null breeding goal defaults to GENERAL (no purebred enforcement)")
        void nullBreedingGoal_treatedAsGeneral() {
            BreedValidationResponse result = engine.validate(
                    CattleBreed.SAHIWAL, CattleBreed.HOLSTEIN_FRIESIAN, null);

            // HF × Sahiwal is in the approved matrix → MATCH
            assertThat(result.getStatus()).isEqualTo(CompatibilityStatus.MATCH);
        }
    }
}
