package com.greenLogBackend.greenLogSolution.service;

import com.greenLogBackend.greenLogSolution.dto.PontoColetaRequest;
import com.greenLogBackend.greenLogSolution.dto.PontoColetaResponse;
import com.greenLogBackend.greenLogSolution.entity.Bairro;
import com.greenLogBackend.greenLogSolution.entity.PontoColeta;
import com.greenLogBackend.greenLogSolution.exception.BusinessException;
import com.greenLogBackend.greenLogSolution.exception.ResourceNotFoundException;
import com.greenLogBackend.greenLogSolution.mapper.PontoColetaMapper;
import com.greenLogBackend.greenLogSolution.repository.BairroRepository;
import com.greenLogBackend.greenLogSolution.repository.PontoColetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PontoColetaService {

    private final PontoColetaRepository pontoColetaRepository;
    private final BairroRepository bairroRepository;

    public PontoColetaService(PontoColetaRepository pontoColetaRepository, BairroRepository bairroRepository) {
        this.pontoColetaRepository = pontoColetaRepository;
        this.bairroRepository = bairroRepository;
    }

    @Transactional
    public PontoColetaResponse criarPonto(PontoColetaRequest request) {
        // 1. Validação de Nome Único (com trim para evitar erros de espaço)
        if (pontoColetaRepository.existsByNome(request.nome().trim())) {
            throw new BusinessException("Já existe um ponto de coleta com o nome '" + request.nome() + "'.");
        }

        // 2. Busca a dependência (Bairro) pelo ID informado no DTO
        Bairro bairro = bairroRepository.findById(request.bairroId())
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado com id: " + request.bairroId()));

        // 3. Converte DTO -> Entidade usando o Bairro recuperado
        PontoColeta ponto = PontoColetaMapper.toEntity(request, bairro);

        // 4. Salva no banco
        PontoColeta pontoSalvo = pontoColetaRepository.save(ponto);

        // 5. Retorna o DTO de Resposta
        return PontoColetaMapper.toResponse(pontoSalvo);
    }

    @Transactional(readOnly = true)
    public List<PontoColetaResponse> listarTodos() {
        return pontoColetaRepository.findAll().stream()
                .map(PontoColetaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PontoColetaResponse buscarPorId(Long id) {
        PontoColeta ponto = pontoColetaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto de Coleta não encontrado com id: " + id));
        return PontoColetaMapper.toResponse(ponto);
    }

    @Transactional
    public PontoColetaResponse atualizarPonto(Long id, PontoColetaRequest request) {
        PontoColeta pontoExistente = pontoColetaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto de Coleta não encontrado com id: " + id));

        // Validação: Se o nome mudou, verifica se o novo nome já existe (com trim)
        if (!pontoExistente.getNome().equalsIgnoreCase(request.nome().trim()) &&
                pontoColetaRepository.existsByNome(request.nome().trim())) {
            throw new BusinessException("Já existe outro ponto de coleta com o nome '" + request.nome() + "'.");
        }

        Bairro bairro = bairroRepository.findById(request.bairroId())
                .orElseThrow(() -> new ResourceNotFoundException("Bairro não encontrado com id: " + request.bairroId()));

        // Atualiza a entidade existente com os dados do DTO
        PontoColetaMapper.copyToEntity(request, pontoExistente, bairro);

        PontoColeta pontoAtualizado = pontoColetaRepository.save(pontoExistente);
        return PontoColetaMapper.toResponse(pontoAtualizado);
    }

    @Transactional
    public void deletarPonto(Long id) {
        if (!pontoColetaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ponto de Coleta não encontrado com id: " + id);
        }
        pontoColetaRepository.deleteById(id);
    }
}