package com.greenLogBackend.greenLogSolution.service;

import com.greenLogBackend.greenLogSolution.dto.BairroRequest;
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.dto.ConexaoRequest;
import com.greenLogBackend.greenLogSolution.entity.Bairro;
import com.greenLogBackend.greenLogSolution.entity.Rua;
import com.greenLogBackend.greenLogSolution.exception.BusinessException;
import com.greenLogBackend.greenLogSolution.exception.ResourceNotFoundException;
import com.greenLogBackend.greenLogSolution.mapper.BairroMapper;
import com.greenLogBackend.greenLogSolution.repository.BairroRepository;
import com.greenLogBackend.greenLogSolution.repository.PontoColetaRepository;
import com.greenLogBackend.greenLogSolution.repository.RuaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BairroService {

    private final BairroRepository bairroRepository;
    private final RuaRepository ruaRepository;
    private final PontoColetaRepository pontoColetaRepository;

    public BairroService(BairroRepository bairroRepository,
                         RuaRepository ruaRepository,
                         PontoColetaRepository pontoColetaRepository) {
        this.bairroRepository = bairroRepository;
        this.ruaRepository = ruaRepository;
        this.pontoColetaRepository = pontoColetaRepository;
    }

    @Transactional(readOnly = true)
    public List<BairroResponse> listarTodos() {
        return bairroRepository.findAll().stream()
                .map(b -> {
                    boolean emUso = pontoColetaRepository.existsByBairroId(b.getId());
                    return BairroMapper.toResponse(b, emUso);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BairroResponse buscarPorId(Long id) {
        Bairro bairro = bairroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado com ID: " + id));

        boolean emUso = pontoColetaRepository.existsByBairroId(id);
        return BairroMapper.toResponse(bairro, emUso);
    }

    @Transactional
    public BairroResponse criar(BairroRequest request) {
        Bairro novoBairro = new Bairro();
        novoBairro.setNome(request.nome());
        novoBairro = bairroRepository.save(novoBairro);

        if (request.conexoes() != null && !request.conexoes().isEmpty()) {
            for (ConexaoRequest conexao : request.conexoes()) {
                Bairro destino = bairroRepository.findById(conexao.bairroDestinoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Bairro destino não encontrado: " + conexao.bairroDestinoId()));

                Rua novaRua = new Rua();
                novaRua.setOrigem(novoBairro);
                novaRua.setDestino(destino);
                novaRua.setDistanciaKm(conexao.distanciaKm());

                ruaRepository.save(novaRua);
            }
        }
        return BairroMapper.toResponse(novoBairro, false);
    }

    @Transactional
    public BairroResponse atualizar(Long id, BairroRequest request) {
        Bairro bairroExistente = bairroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado com ID: " + id));

        bairroExistente.setNome(request.nome());

        if (request.conexoes() != null) {
            for (ConexaoRequest conn : request.conexoes()) {
                Bairro destino = bairroRepository.findById(conn.bairroDestinoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Bairro destino não encontrado: " + conn.bairroDestinoId()));

                Optional<Rua> ruaExistente = ruaRepository.findByOrigemAndDestino(bairroExistente, destino);

                if (ruaExistente.isPresent()) {
                    Rua rua = ruaExistente.get();
                    rua.setDistanciaKm(conn.distanciaKm());
                    ruaRepository.save(rua);
                } else {
                    Rua novaRua = new Rua();
                    novaRua.setOrigem(bairroExistente);
                    novaRua.setDestino(destino);
                    novaRua.setDistanciaKm(conn.distanciaKm());
                    ruaRepository.save(novaRua);
                }
            }
        }

        Bairro bairroSalvo = bairroRepository.save(bairroExistente);
        boolean emUso = pontoColetaRepository.existsByBairroId(bairroSalvo.getId());

        return BairroMapper.toResponse(bairroSalvo, emUso);
    }

    @Transactional
    public void excluir(Long id) {
        if (!bairroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bairro não encontrado com ID: " + id);
        }
        if (pontoColetaRepository.existsByBairroId(id)) {
            throw new BusinessException("Não é possível excluir o bairro. Existem pontos de coleta vinculados a ele.");
        }
        List<Rua> ruasComoOrigem = ruaRepository.findAll().stream()
                .filter(r -> r.getOrigem().getId().equals(id))
                .collect(Collectors.toList());
        ruaRepository.deleteAll(ruasComoOrigem);
        List<Rua> ruasComoDestino = ruaRepository.findAll().stream()
                .filter(r -> r.getDestino().getId().equals(id))
                .collect(Collectors.toList());
        ruaRepository.deleteAll(ruasComoDestino);
        bairroRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existePorId(Long id) {
        return bairroRepository.existsById(id);
    }

}
