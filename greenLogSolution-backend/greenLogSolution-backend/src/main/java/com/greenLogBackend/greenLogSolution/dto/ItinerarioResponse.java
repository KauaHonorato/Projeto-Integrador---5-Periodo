package com.greenLogBackend.greenLogSolution.dto;

import com.greenLogBackend.greenLogSolution.enums.TipoResiduo;
import java.time.LocalDate;
import java.util.List;

/**
 * Padrão Data Transfer Object (DTO):
 * Objeto projetado puramente para transportar dados entre o subsistema
 * de backend e a interface frontend. Ele isola a camada de domínio (Entidades),
 * permitindo a evolução independente do banco de dados e da API pública,
 * além de otimizar a serialização dos dados.
 */

public record ItinerarioResponse(
        Long id,
        LocalDate data, 
        String status,
        Long rotaId,
        Double distanciaTotal,
        TipoResiduo tipoResiduo,
        List<BairroResponse> sequenciaBairros,
        Long caminhaoId,
        String caminhaoPlaca,
        String caminhaoMotorista

) {}

