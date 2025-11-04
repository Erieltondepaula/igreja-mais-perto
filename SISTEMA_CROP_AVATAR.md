# Sistema de Crop de Avatar - Documentação

## Visão Geral
Sistema de edição de imagem com crop e zoom para avatares de membros, implementado no Dashboard de Membros.

## Funcionalidade
Quando o usuário faz upload de uma foto de membro, o sistema agora:
1. Abre um diálogo de edição de imagem
2. Permite ajustar a posição da imagem (arrastar)
3. Permite ajustar o zoom (slider de 1x a 3x)
4. Mostra preview em formato circular (1:1)
5. Converte automaticamente para 300x300px JPEG ao salvar

## Componentes Implementados

### 1. AvatarCropDialog.tsx
**Localização:** `src/components/ui/AvatarCropDialog.tsx`

**Props:**
- `isOpen: boolean` - Controla se o diálogo está aberto
- `onClose: () => void` - Callback ao fechar o diálogo
- `imageFile: File | null` - Arquivo de imagem selecionado
- `onCropComplete: (blob: Blob) => void` - Callback com imagem cortada

**Funcionalidades:**
- Crop circular com proporção 1:1
- Zoom de 1x a 3x (slider)
- Arraste para reposicionar
- Conversão automática para 300x300px
- Saída em JPEG com 92% de qualidade
- Reset automático do estado ao fechar

**Dependências:**
- `react-easy-crop` - Biblioteca de crop de imagem
- Componentes UI: Dialog, Button, Slider (shadcn/ui)

### 2. MemberEdit.tsx (Modificado)
**Localização:** `src/components/dashboard/MemberEdit.tsx`

**Mudanças:**
1. Adicionado import do AvatarCropDialog
2. Adicionados estados:
   ```typescript
   const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
   const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
   ```

3. Modificado handler do input de arquivo:
   - Antes: Upload direto para servidor
   - Agora: Abre diálogo de crop

4. Adicionada função `handleCropComplete`:
   - Recebe imagem cortada como Blob
   - Envia para API `/api/upload-avatar`
   - Atualiza campo `avatar_url` no formulário
   - Mostra toast de sucesso/erro

## Fluxo de Uso

```
1. Usuário clica em "Editar Membro"
2. Clica na foto/avatar para fazer upload
3. Seleciona arquivo do computador
   ↓
4. Sistema abre diálogo de crop
5. Usuário ajusta posição (arrasta)
6. Usuário ajusta zoom (slider)
7. Usuário clica "Salvar Foto"
   ↓
8. Sistema:
   - Corta imagem na área selecionada
   - Redimensiona para 300x300px
   - Converte para JPEG (92% qualidade)
   - Envia para servidor via FormData
   - Atualiza avatar_url no formulário
   - Mostra mensagem de sucesso
```

## Especificações Técnicas

### Imagem de Saída
- **Dimensões:** 300x300 pixels (fixo)
- **Formato:** JPEG
- **Qualidade:** 92%
- **Tamanho esperado:** 50-200 KB (conforme ESPECIFICACOES_FOTOS.md)
- **Aspect Ratio:** 1:1 (quadrado/circular)

### API Endpoint
**URL:** `http://localhost:5001/api/upload-avatar`
**Método:** POST
**Content-Type:** multipart/form-data

**Campos FormData:**
- `avatar` - Blob da imagem cortada (avatar.jpg)
- `memberId` - ID do membro (string)

**Resposta Esperada:**
```json
{
  "avatar_url": "/avatars/LP20251104091155-DL9U.jpeg"
}
```

### Biblioteca react-easy-crop
**Instalação:**
```bash
npm install react-easy-crop
```

**Configuração usada:**
- `aspect={1}` - Proporção 1:1
- `cropShape="round"` - Formato circular
- `showGrid={false}` - Sem grade
- `zoom` - Range: 1 a 3, step: 0.1

## Tratamento de Erros

### Erros Capturados
1. **Erro ao criar canvas:** "Não foi possível obter contexto do canvas"
2. **Erro ao criar blob:** "Erro ao criar blob da imagem"
3. **Erro de upload:** Mensagens do servidor ou "Erro HTTP: {status}"
4. **Erro desconhecido:** Fallback genérico

### Logs de Console
- `📸 Arquivo selecionado:` - Quando usuário seleciona arquivo
- `📸 Imagem cortada recebida:` - Quando crop é concluído
- `🔄 Enviando avatar para o servidor...` - Antes do upload
- `✅ Avatar enviado:` - Upload bem-sucedido
- `✅ Avatar URL atualizado no formulário:` - URL atualizada
- `❌ Erro ao fazer upload do avatar:` - Erro no upload

## Melhorias Futuras (Opcional)

1. **Rotação de imagem** - Permitir rotacionar a imagem antes do crop
2. **Filtros** - Adicionar filtros (preto e branco, contraste, etc.)
3. **Histórico** - Permitir desfazer/refazer ajustes
4. **Múltiplos formatos** - Suportar PNG com transparência
5. **Compressão adaptativa** - Ajustar qualidade baseado no tamanho do arquivo
6. **Preview antes de salvar** - Mostrar como ficará no card do membro
7. **Arrastar e soltar** - Upload via drag & drop

## Compatibilidade

✅ Browsers modernos (Chrome, Firefox, Edge, Safari)
✅ Mobile (touch para arrastar/pinch para zoom)
✅ TypeScript completo
✅ React hooks modernos
✅ Shadcn/ui components

## Testes Sugeridos

1. **Teste de upload básico**
   - Selecionar imagem pequena (< 100KB)
   - Verificar crop funciona
   - Confirmar saída é 300x300px

2. **Teste de imagem grande**
   - Selecionar imagem > 5MB
   - Verificar performance do crop
   - Confirmar compressão para 50-200KB

3. **Teste de formatos**
   - JPG, PNG, WEBP
   - Verificar conversão para JPEG

4. **Teste de proporções**
   - Imagem vertical (retrato)
   - Imagem horizontal (paisagem)
   - Imagem quadrada
   - Verificar crop mantém qualidade

5. **Teste de erros**
   - Servidor offline
   - Arquivo inválido
   - Arquivo muito grande
   - Verificar mensagens de erro

6. **Teste de UX**
   - Arrastar funciona suavemente
   - Zoom responde bem
   - Botão cancelar funciona
   - Avatar atualiza imediatamente após salvar

## Status
✅ **IMPLEMENTADO** - Sistema completo e funcional
✅ **BUILD OK** - Compilação sem erros
⏳ **TESTE PENDENTE** - Aguardando teste end-to-end com servidor rodando
