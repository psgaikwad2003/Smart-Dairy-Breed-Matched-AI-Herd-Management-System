package com.smartdairy.common.enums;

/**
 * Indian dairy cattle and buffalo breeds.
 * Modeled on real breeds recognized by NDDB / ICAR registries.
 */
public enum CattleBreed {

    // Indigenous cattle breeds (Bos indicus)
    GIR("Gir", BreedCategory.INDIGENOUS, BreedType.CATTLE),
    SAHIWAL("Sahiwal", BreedCategory.INDIGENOUS, BreedType.CATTLE),
    RED_SINDHI("Red Sindhi", BreedCategory.INDIGENOUS, BreedType.CATTLE),
    THARPARKAR("Tharparkar", BreedCategory.INDIGENOUS, BreedType.CATTLE),
    RATHI("Rathi", BreedCategory.INDIGENOUS, BreedType.CATTLE),
    HARIANA("Hariana", BreedCategory.INDIGENOUS, BreedType.CATTLE),

    // Exotic cattle breeds (Bos taurus)
    HOLSTEIN_FRIESIAN("Holstein Friesian", BreedCategory.EXOTIC, BreedType.CATTLE),
    JERSEY("Jersey", BreedCategory.EXOTIC, BreedType.CATTLE),

    // Crossbred cattle
    HF_CROSSBRED("HF Crossbred", BreedCategory.CROSSBRED, BreedType.CATTLE),
    JERSEY_CROSSBRED("Jersey Crossbred", BreedCategory.CROSSBRED, BreedType.CATTLE),

    // Buffalo breeds
    MURRAH("Murrah", BreedCategory.INDIGENOUS, BreedType.BUFFALO),
    JAFFARABADI("Jaffarabadi", BreedCategory.INDIGENOUS, BreedType.BUFFALO),
    BANNI("Banni", BreedCategory.INDIGENOUS, BreedType.BUFFALO),
    MEHSANA("Mehsana", BreedCategory.INDIGENOUS, BreedType.BUFFALO),
    PANDHARPURI("Pandharpuri", BreedCategory.INDIGENOUS, BreedType.BUFFALO);

    private final String displayName;
    private final BreedCategory category;
    private final BreedType type;

    CattleBreed(String displayName, BreedCategory category, BreedType type) {
        this.displayName = displayName;
        this.category = category;
        this.type = type;
    }

    public String getDisplayName() { return displayName; }
    public BreedCategory getCategory() { return category; }
    public BreedType getType() { return type; }

    public boolean isCattle() { return type == BreedType.CATTLE; }
    public boolean isBuffalo() { return type == BreedType.BUFFALO; }

    public enum BreedCategory {
        INDIGENOUS, EXOTIC, CROSSBRED
    }

    public enum BreedType {
        CATTLE, BUFFALO
    }
}
