package com.greenLogBackend.greenLogSolution.service;

import com.greenLogBackend.greenLogSolution.dto.BairroRequest;
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.entity.Bairro;
import com.greenLogBackend.greenLogSolution.exception.BusinessException;
import com.greenLogBackend.greenLogSolution.exception.ResourceNotFoundException; // Importante
import com.greenLogBackend.greenLogSolution.mapper.BairroMapper;
import com.greenLogBackend.greenLogSolution.repository.BairroRepository;
import com.greenLogBackend.greenLogSolution.repository.PontoColetaRepository; // Importar
import com.greenLogBackend.greenLogSolution.repository.RuaRepository;         // Importar
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BairroService {

    private final BairroRepository bairroRepository;
    private final PontoColetaRepository pontoColetaRepository;
    private final RuaRepository ruaRepository;

    public BairroService(BairroRepository bairroRepository,
                         PontoColetaRepository pontoColetaRepository,
                         RuaRepository ruaRepository) {
        this.bairroRepository = bairroRepository;
        this.pontoColetaRepository = pontoColetaRepository;
        this.ruaRepository = ruaRepository;
    }

    @Transactional(readOnly = true)
    public List<BairroResponse> listarTodos() {
        return bairroRepository.findAll().stream()
                .map(BairroMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BairroResponse criar(BairroRequest request) {
        if (bairroRepository.existsByNome(request.nome())) {
            throw new BusinessException("Já existe um bairro cadastrado com o nome: " + request.nome());
        }
        Bairro novoBairro = BairroMapper.toEntity(request);
        Bairro bairroSalvo = bairroRepository.save(novoBairro);
        return BairroMapper.toResponse(bairroSalvo);
    }

    @Transactional
    public void excluir(Long id) {
        if (!bairroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bairro não encontrado com ID: " + id);
        }
        if (pontoColetaRepository.existsByBairroId(id)) {
            throw new BusinessException("Não é possível excluir o bairro. Existem Pontos de Coleta vinculados a ele.");
        }
        if (ruaRepository.existsByOrigemIdOrDestinoId(id, id)) {
            throw new BusinessException("Não é possível excluir o bairro. Ele faz parte de uma rota (rua) cadastrada.");
        }

        bairroRepository.deleteById(id);
    }
}