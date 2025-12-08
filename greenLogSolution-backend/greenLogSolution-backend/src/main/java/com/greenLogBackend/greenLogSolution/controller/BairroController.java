package com.greenLogBackend.greenLogSolution.controller;

import com.greenLogBackend.greenLogSolution.dto.BairroRequest;
import com.greenLogBackend.greenLogSolution.dto.BairroResponse;
import com.greenLogBackend.greenLogSolution.service.BairroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/{id}")
    public ResponseEntity<BairroResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(bairroService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<BairroResponse> criar(@RequestBody @Valid BairroRequest request) {
        BairroResponse novoBairro = bairroService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoBairro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BairroResponse> atualizar(@PathVariable Long id, @RequestBody @Valid BairroRequest request) {
        return ResponseEntity.ok(bairroService.atualizar(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        bairroService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}