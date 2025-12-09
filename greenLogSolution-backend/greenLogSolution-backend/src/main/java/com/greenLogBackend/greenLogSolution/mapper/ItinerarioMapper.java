package com.greenLogBackend.greenLogSolution.mapper;

import com.greenLogBackend.greenLogSolution.dto.ItinerarioRequest;
import com.greenLogBackend.greenLogSolution.dto.ItinerarioResponse;
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.entity.Caminhao;
import com.greenLogBackend.greenLogSolution.entity.Itinerario;
import com.greenLogBackend.greenLogSolution.entity.Rota;


import java.util.List;
import java.util.stream.Collectors;

public final class ItinerarioMapper {

    private ItinerarioMapper() {}

    public static Itinerario toEntity(ItinerarioRequest req, Rota rota, Caminhao caminhao) {
        Itinerario it = new Itinerario();
        it.setData(req.data());
        it.setRota(rota);
        it.setCaminhao(caminhao);
        return it;
    }

    public static ItinerarioResponse toResponse(Itinerario it) {
        Rota rota = it.getRota();
        Caminhao caminhao = it.getCaminhao();

        List<BairroResponse> sequenciaBairrosResponse = rota.getSequenciaBairros().stream()
                .map(BairroMapper::toResponse)
                .collect(Collectors.toList());

        return new ItinerarioResponse(
                it.getId(),
                it.getData(),
                "AGENDADO", 
                rota.getId(),
                rota.getDistanciaTotal(),
                rota.getTipoResiduo(),
                sequenciaBairrosResponse,
                caminhao.getId(),
                caminhao.getPlaca(),
                caminhao.getMotorista() 
        );
    }

}
