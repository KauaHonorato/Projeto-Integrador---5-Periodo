package com.greenLogBackend.greenLogSolution.dto;

import com.greenLogBackend.greenLogSolution.enums.TipoResiduo;
import java.util.List;

public record RotaResponse(
        Long id,
        CaminhaoResponse caminhao,
        Double distanciaTotal,
        TipoResiduo tipoResiduo,
        List<BairroResponse> sequenciaBairros
) {}