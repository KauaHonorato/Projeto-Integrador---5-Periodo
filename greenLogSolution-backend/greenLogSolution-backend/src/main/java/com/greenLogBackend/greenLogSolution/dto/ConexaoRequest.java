package com.greenLogBackend.greenLogSolution.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ConexaoRequest(
        @NotNull(message = "O ID do bairro de destino é obrigatório")
        Long bairroDestinoId,

        @NotNull(message = "A distância é obrigatória")
        @Positive(message = "A distância deve ser maior que zero")
        Double distanciaKm
) {}