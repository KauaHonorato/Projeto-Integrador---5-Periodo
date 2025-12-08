package com.greenLogBackend.greenLogSolution.mapper;

import com.greenLogBackend.greenLogSolution.dto.BairroRequest;
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.entity.Bairro;

public final class BairroMapper {
    private BairroMapper() {}

    public static Bairro toEntity(BairroRequest req) {
        Bairro b = new Bairro();
        b.setNome(req.nome());
        return b;
    }
    public static BairroResponse toResponse(Bairro b, boolean emUso) {
        return new BairroResponse(b.getId(), b.getNome(), emUso);
    }
    public static BairroResponse toResponse(Bairro b) {
        return toResponse(b, false);
    }
}