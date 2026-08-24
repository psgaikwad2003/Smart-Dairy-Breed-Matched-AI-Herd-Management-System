package com.smartdairy.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a breed-mismatch is detected and the insemination is BLOCKED.
 * Technician may override by providing a reason, but this blocks by default.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class BreedMismatchException extends RuntimeException {

    private final String cowBreed;
    private final String semenBreed;

    public BreedMismatchException(String cowBreed, String semenBreed) {
        super(String.format("Breed mismatch BLOCKED: cow breed '%s' is incompatible with semen breed '%s'. "
                + "Technician override required with a documented reason.", cowBreed, semenBreed));
        this.cowBreed = cowBreed;
        this.semenBreed = semenBreed;
    }

    public String getCowBreed() {
        return cowBreed;
    }

    public String getSemenBreed() {
        return semenBreed;
    }
}
