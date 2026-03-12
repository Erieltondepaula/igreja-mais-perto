# 🎯 Atalho com Ícone - Guia Rápido

## ✅ Atalho Criado com Sucesso!

Foi criado o arquivo **"Iniciar Sistema.lnk"** com o ícone personalizado (3.png).

### 📍 Localização
```
C:\Users\eriel\OneDrive - MSFT\Dashboard_Membros\Iniciar Sistema.lnk
```

---

## 🚀 Como Usar

### Opção 1: Usar Direto da Pasta
- Clique duas vezes em **"Iniciar Sistema.lnk"**
- O sistema completo será iniciado com PostgreSQL + Backend + Frontend

### Opção 2: Adicionar à Área de Trabalho
1. Clique com botão direito em **"Iniciar Sistema.lnk"**
2. Selecione **"Enviar para" → "Área de Trabalho (criar atalho)"**
3. Agora você tem um atalho na área de trabalho com o ícone!

### Opção 3: Fixar na Barra de Tarefas
1. Clique com botão direito em **"Iniciar Sistema.lnk"**
2. Selecione **"Fixar na barra de tarefas"**
3. O ícone ficará sempre disponível para acesso rápido!

---

## 🔄 Recriar o Atalho

Se precisar recriar o atalho (por exemplo, se deletou acidentalmente):

1. Abra o PowerShell na pasta do projeto
2. Execute:
   ```powershell
   .\criar-atalho-com-icone.ps1
   ```

Ou simplesmente clique duas vezes em **criar-atalho-com-icone.ps1**

---

## 🎨 Alterar o Ícone

Para usar outro ícone:

1. Substitua o arquivo `public\3.png` por outra imagem
2. Execute novamente o script `criar-atalho-com-icone.ps1`

**Formatos suportados:** PNG, ICO, EXE, DLL

---

## ℹ️ Informações Técnicas

- **Arquivo BAT Original:** `IniciarTudo.bat`
- **Arquivo de Ícone:** `public\3.png`
- **Script de Criação:** `criar-atalho-com-icone.ps1`
- **Atalho Final:** `Iniciar Sistema.lnk`

---

## 🛠️ Solução de Problemas

### O ícone não aparece
- Certifique-se de que `public\3.png` existe
- Tente recriar o atalho executando o script novamente
- Reinicie o Explorer (Ctrl + Shift + Esc → Processos → Windows Explorer → Reiniciar)

### Erro ao executar o script
- Execute como Administrador
- Verifique se o PowerShell está atualizado
- Certifique-se de estar na pasta correta

---

**Criado em:** 16/12/2025
**Projeto:** Dashboard de Membros
