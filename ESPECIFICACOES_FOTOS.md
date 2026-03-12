# 📸 ESPECIFICAÇÕES DE FOTOS PARA CADASTRO

## 🎯 Tamanho Recomendado

### Tamanho Ideal:
- **Resolução**: 300x300 pixels (quadrado)
- **Formato**: JPEG ou PNG
- **Tamanho do arquivo**: Máximo 200KB
- **Proporção**: 1:1 (quadrado)

### Tamanhos Alternativos Aceitos:
- **Mínimo**: 200x200 pixels
- **Máximo**: 800x800 pixels
- **Recomendado**: 300x300 ou 400x400 pixels

## 📐 Especificações Técnicas

### Por que 300x300?
- ✅ **Qualidade**: Boa resolução para exibição em telas
- ✅ **Performance**: Carregamento rápido
- ✅ **Espaço**: Tamanho de arquivo reduzido (50-200KB)
- ✅ **Responsivo**: Funciona bem em mobile e desktop

### Formatos Aceitos:
```
✅ .jpg / .jpeg (Recomendado)
✅ .png (com transparência se necessário)
⚠️ .gif (não recomendado para fotos)
❌ .bmp (muito pesado)
```

## 🎨 Diretrizes de Qualidade

### Foto Ideal:
- 📷 Boa iluminação
- 👤 Rosto centralizado
- 🖼️ Fundo neutro (preferencialmente)
- 😊 Expressão clara
- 📏 Enquadramento do busto até a cabeça

### Evitar:
- ❌ Fotos muito escuras
- ❌ Imagens borradas
- ❌ Fotos de grupo (apenas a pessoa)
- ❌ Imagens muito pesadas (>500KB)

## 💻 Implementação no Sistema

### Upload Atual:
```javascript
// Sistema aceita e redimensiona automaticamente
Tamanho máximo: 5MB (antes de processar)
Formato final: JPEG
Conversão automática: Sim
Redimensionamento: Automático para 300x300
```

### Onde são salvas:
```
public/avatars/[ID_DO_MEMBRO].jpeg

Exemplo:
public/avatars/LP20251104091155-DL9U.jpeg
```

## 📊 Comparação de Tamanhos

| Resolução | Tamanho Arquivo | Uso | Recomendação |
|-----------|-----------------|-----|--------------|
| 100x100 | ~10KB | ❌ Muito pequeno | Baixa qualidade |
| 200x200 | ~30KB | ⚠️ Aceitável | Mínimo aceitável |
| **300x300** | **~80KB** | **✅ IDEAL** | **Recomendado** |
| 400x400 | ~120KB | ✅ Ótimo | Boa alternativa |
| 500x500 | ~180KB | ⚠️ Bom mas grande | Pode ser pesado |
| 800x800 | ~350KB | ❌ Muito grande | Desnecessário |

## 🔧 Ferramentas de Redimensionamento

### Online (gratuitas):
- https://www.iloveimg.com/resize-image
- https://www.reduceimages.com/
- https://imageresizer.com/

### Desktop:
- Paint (Windows)
- Preview (Mac)
- GIMP (multiplataforma)
- Photoshop (profissional)

### Mobile:
- Snapseed (iOS/Android)
- Photo Resizer (Android)
- Image Size (iOS)

## 💡 Dicas Práticas

### Para Melhores Resultados:
1. **Tire foto em boa iluminação** (natural é melhor)
2. **Use fundo simples** (parede clara)
3. **Centralize o rosto** da pessoa
4. **Mantenha distância adequada** (busto e cabeça)
5. **Evite zoom digital** excessivo
6. **Salve em alta qualidade** antes de redimensionar

### Processo Recomendado:
```
1. Tirar foto original (alta resolução)
2. Recortar para quadrado (1:1)
3. Redimensionar para 300x300
4. Salvar como JPEG (qualidade 85-90%)
5. Fazer upload no sistema
```

## 🎯 Conclusão

**Tamanho Perfeito**: **300x300 pixels**
**Formato**: **JPEG**
**Tamanho Arquivo**: **50-200KB**

Este tamanho oferece o melhor equilíbrio entre:
- ✅ Qualidade visual
- ✅ Performance de carregamento
- ✅ Uso de espaço em disco
- ✅ Compatibilidade com dispositivos

---

**Atualizado**: 04/11/2025  
**Sistema**: Dashboard Membros IBVP
