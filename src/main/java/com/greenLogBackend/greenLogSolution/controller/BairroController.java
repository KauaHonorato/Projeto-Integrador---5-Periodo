package com.greenLogBackend.greenLogSolution.controller;

import com.greenLogBackend.greenLogSolution.dto.BairroRequest; // Importar
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.service.BairroService;
import jakarta.validation.Valid; // Importar
import org.springframework.http.HttpStatus; // Importar
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bairros")
public class BairroController {

    private final BairroService bairroService;

    public BairroController(BairroService bairroService) {
        this.bairroService = bairroService;
    }

    @GetMapping
    public ResponseEntity<List<BairroResponse>> listarTodos() {
        return ResponseEntity.ok(bairroService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<BairroResponse> criar(@RequestBody @Valid BairroRequest request) {
        BairroResponse novoBairro = bairroService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoBairro);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        bairroService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}