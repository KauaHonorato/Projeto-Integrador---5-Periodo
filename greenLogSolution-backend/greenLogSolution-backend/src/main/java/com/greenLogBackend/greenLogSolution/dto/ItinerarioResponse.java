package com.greenLogBackend.greenLogSolution.dto;

import com.greenLogBackend.greenLogSolution.enums.TipoResiduo;
import java.time.LocalDate;
import java.util.List;

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
