package com.greenLogBackend.greenLogSolution.dto;

import com.greenLogBackend.greenLogSolution.enums.TipoResiduo;
import java.time.LocalDate;
import java.util.List;

public record ItinerarioResponse(
        Long id,
        LocalDate data, // dataAgendamento
        String status, // Usando String, e o frontend converterá para o Enum ItinerarioStatus

        // Campos da Rota (Necessários para o frontend que estende Rota)
        Long rotaId,
        Double distanciaTotal,
        TipoResiduo tipoResiduo,
        List<BairroResponse> sequenciaBairros,

        // Campos do Caminhão (Necessários para a exibição na lista)
        Long caminhaoId,
        String caminhaoPlaca,
        String caminhaoMotorista
) {}