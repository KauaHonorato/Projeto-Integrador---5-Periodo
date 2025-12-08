package com.greenLogBackend.greenLogSolution.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BairroRequest(
        @NotBlank(message = "O nome do bairro é obrigatório")
        String nome,

        @NotEmpty(message = "É necessário adicionar pelo menos uma conexão (rua) a outro bairro")
        @Valid // Valida cada item da lista (ConexaoRequest)
        List<ConexaoRequest> conexoes
) {}