package com.smartdairy.breeding.engine;

import com.smartdairy.common.enums.CattleBreed;
import com.smartdairy.common.enums.CattleBreed.BreedType;

import java.util.*;

/**
 * Approved crossbreed matrix — defines which breed combinations are permitted
 * for deliberate crossbreeding programs (e.g., HF × indigenous for yield improvement).
 *
 * Rules modeled on real Indian dairy crossbreeding practices:
 * - Exotic (HF/Jersey) × Indigenous cattle = allowed for yield improvement
 * - Buffalo breeds can cross within buffalo type only
 * - Cattle × Buffalo = biologically incompatible = always BLOCKED
 */
public final class CrossbreedMatrix {

    private CrossbreedMatrix() {} // utility class

    /**
     * Map of breed → set of approved crossbreed partners.
     * Bidirectional: if A can cross with B, then B can cross with A.
     */
    private static final Map<CattleBreed, Set<CattleBreed>> APPROVED_CROSSES;

    static {
        Map<CattleBreed, Set<CattleBreed>> matrix = new EnumMap<>(CattleBreed.class);

        // HF can cross with all indigenous cattle breeds (for yield improvement)
        Set<CattleBreed> hfPartners = EnumSet.of(
                CattleBreed.GIR, CattleBreed.SAHIWAL, CattleBreed.RED_SINDHI,
                CattleBreed.THARPARKAR, CattleBreed.RATHI, CattleBreed.HARIANA,
                CattleBreed.HF_CROSSBRED
        );
        matrix.put(CattleBreed.HOLSTEIN_FRIESIAN, hfPartners);

        // Jersey can cross with all indigenous cattle breeds
        Set<CattleBreed> jerseyPartners = EnumSet.of(
                CattleBreed.GIR, CattleBreed.SAHIWAL, CattleBreed.RED_SINDHI,
                CattleBreed.THARPARKAR, CattleBreed.RATHI, CattleBreed.HARIANA,
                CattleBreed.JERSEY_CROSSBRED
        );
        matrix.put(CattleBreed.JERSEY, jerseyPartners);

        // HF Crossbred can be upgraded with pure HF
        matrix.put(CattleBreed.HF_CROSSBRED, EnumSet.of(
                CattleBreed.HOLSTEIN_FRIESIAN, CattleBreed.GIR, CattleBreed.SAHIWAL
        ));

        // Jersey Crossbred can be upgraded with pure Jersey
        matrix.put(CattleBreed.JERSEY_CROSSBRED, EnumSet.of(
                CattleBreed.JERSEY, CattleBreed.GIR, CattleBreed.SAHIWAL
        ));

        // Indigenous cattle: allow crossing with exotics (reverse direction)
        for (CattleBreed indigenous : List.of(
                CattleBreed.GIR, CattleBreed.SAHIWAL, CattleBreed.RED_SINDHI,
                CattleBreed.THARPARKAR, CattleBreed.RATHI, CattleBreed.HARIANA)) {
            matrix.put(indigenous, EnumSet.of(
                    CattleBreed.HOLSTEIN_FRIESIAN, CattleBreed.JERSEY
            ));
        }

        // Buffalo breeds: Murrah × Mehsana allowed (common practice in Gujarat)
        matrix.put(CattleBreed.MURRAH, EnumSet.of(CattleBreed.MEHSANA));
        matrix.put(CattleBreed.MEHSANA, EnumSet.of(CattleBreed.MURRAH));

        APPROVED_CROSSES = Collections.unmodifiableMap(matrix);
    }

    /**
     * Check if a crossbreed combination is in the approved matrix.
     */
    public static boolean isApprovedCross(CattleBreed cowBreed, CattleBreed semenBreed) {
        Set<CattleBreed> partners = APPROVED_CROSSES.get(cowBreed);
        return partners != null && partners.contains(semenBreed);
    }

    /**
     * Check if two breeds are biologically compatible (same species type).
     * Cattle × Buffalo is always incompatible.
     */
    public static boolean isBiologicallyCompatible(CattleBreed cowBreed, CattleBreed semenBreed) {
        return cowBreed.getType() == semenBreed.getType();
    }

    /**
     * Get all approved crossbreed partners for a given breed.
     */
    public static Set<CattleBreed> getApprovedPartners(CattleBreed breed) {
        return APPROVED_CROSSES.getOrDefault(breed, Collections.emptySet());
    }
}
