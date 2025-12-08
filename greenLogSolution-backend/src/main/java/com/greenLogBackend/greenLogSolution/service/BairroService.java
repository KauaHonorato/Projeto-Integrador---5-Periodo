package com.greenLogBackend.greenLogSolution.service;

import com.greenLogBackend.greenLogSolution.dto.BairroRequest;
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.dto.ConexaoRequest;
import com.greenLogBackend.greenLogSolution.entity.Bairro;
import com.greenLogBackend.greenLogSolution.entity.Rua;
import com.greenLogBackend.greenLogSolution.exception.ResourceNotFoundException;
import com.greenLogBackend.greenLogSolution.mapper.BairroMapper;
import com.greenLogBackend.greenLogSolution.repository.BairroRepository;
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

    public BairroService(BairroRepository bairroRepository, RuaRepository ruaRepository) {
        this.bairroRepository = bairroRepository;
        this.ruaRepository = ruaRepository;
    }

    @Transactional(readOnly = true)
    public List<BairroResponse> listarTodos() {
        return bairroRepository.findAll().stream()
                .map(BairroMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BairroResponse buscarPorId(Long id) {
        Bairro bairro = bairroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado com ID: " + id));
        return BairroMapper.toResponse(bairro);
    }

    @Transactional
    public BairroResponse criar(BairroRequest request) {
        // 1. Salva o Bairro
        Bairro novoBairro = new Bairro();
        novoBairro.setNome(request.nome());
        novoBairro = bairroRepository.save(novoBairro);

        // 2. Processa as conexões (Cria as Ruas)
        for (ConexaoRequest conexao : request.conexoes()) {
            Bairro destino = bairroRepository.findById(conexao.bairroDestinoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Bairro destino não encontrado: " + conexao.bairroDestinoId()));

            Rua novaRua = new Rua();
            novaRua.setOrigem(novoBairro);
            novaRua.setDestino(destino);
            novaRua.setDistanciaKm(conexao.distanciaKm());

            ruaRepository.save(novaRua);
        }

        return BairroMapper.toResponse(novoBairro);
    }

    @Transactional
    public BairroResponse atualizar(Long id, BairroRequest request) {
        Bairro bairroExistente = bairroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado com ID: " + id));

        // Atualiza Nome
        bairroExistente.setNome(request.nome());

        // Atualiza Distâncias das Conexões Existentes ou Cria Novas
        // Nota: A regra diz "editar nome e distancia".
        // Vamos iterar sobre o que veio no request.
        if (request.conexoes() != null) {
            for (ConexaoRequest conn : request.conexoes()) {
                Bairro destino = bairroRepository.findById(conn.bairroDestinoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Bairro destino não encontrado: " + conn.bairroDestinoId()));

                // Verifica se já existe a rua entre Origem(Bairro Editado) e Destino
                Optional<Rua> ruaExistente = ruaRepository.findByOrigemAndDestino(bairroExistente, destino);

                if (ruaExistente.isPresent()) {
                    // Se existe, atualiza apenas a distância
                    Rua rua = ruaExistente.get();
                    rua.setDistanciaKm(conn.distanciaKm());
                    ruaRepository.save(rua);
                } else {
                    // Se o usuário adicionou uma nova conexão na edição, criamos ela
                    Rua novaRua = new Rua();
                    novaRua.setOrigem(bairroExistente);
                    novaRua.setDestino(destino);
                    novaRua.setDistanciaKm(conn.distanciaKm());
                    ruaRepository.save(novaRua);
                }
            }
        }

        return BairroMapper.toResponse(bairroRepository.save(bairroExistente));
    }

    @Transactional(readOnly = true)
    public boolean existePorId(Long id) {
        return bairroRepository.existsById(id);
    }
}