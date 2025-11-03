// Rota para upload de avatar
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../config/postgresql');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const avatarsDir = path.join(__dirname, '../../public/avatars');
    // Criar pasta se não existir
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    // Usar o ID do membro como nome do arquivo quando fornecido,
    // caso contrário gerar um nome temporário com timestamp.
    const memberId = req.body.memberId || 'temp-' + Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${memberId}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'));
    }
  }
});

router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    
    const memberId = req.body.memberId;
    let filename = req.file.filename;
    const ext = path.extname(filename).toLowerCase();
    const avatarsDir = path.join(__dirname, '../../public/avatars');

    // Se recebemos memberId, buscar avatar antigo primeiro
    let oldAvatarUrl = null;
    let targetFilename = null;
    
    if (memberId) {
      try {
        // Buscar avatar atual do membro no banco
        const memberResult = await db.query(
          'SELECT avatar_url FROM membros WHERE id = $1',
          [memberId]
        );
        
        if (memberResult.length > 0 && memberResult[0].avatar_url) {
          oldAvatarUrl = memberResult[0].avatar_url;
          // Extrair o nome do arquivo antigo para manter a referência
          const oldFilename = oldAvatarUrl.replace('/avatars/', '');
          const oldExt = path.extname(oldFilename).toLowerCase();
          const oldBasename = path.basename(oldFilename, oldExt);
          
          // Manter o mesmo nome base do avatar antigo, apenas trocar a extensão se necessário
          targetFilename = ext === oldExt ? oldFilename : `${oldBasename}${ext}`;
          
          console.log(`🔄 Substituindo avatar: ${oldFilename} → ${targetFilename}`);
        } else {
          // Novo avatar, usar o ID do membro como nome
          targetFilename = `${memberId}${ext}`;
          console.log(`➕ Novo avatar para membro ${memberId}: ${targetFilename}`);
        }
      } catch (dbError) {
        console.error('❌ Erro ao buscar avatar antigo:', dbError);
        targetFilename = `${memberId}${ext}`;
      }
      
      const currentPath = path.join(avatarsDir, filename);
      const targetPath = path.join(avatarsDir, targetFilename);

      // Se o nome atual é diferente do desejado, mover/renomear
      if (filename !== targetFilename) {
        try {
          // Remover arquivo antigo se existir (substituição)
          if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
            console.log(`🗑️  Avatar antigo removido: ${targetFilename}`);
          }
          fs.renameSync(currentPath, targetPath);
          filename = targetFilename;
          console.log(`✅ Avatar renomeado: ${filename}`);
        } catch (renameErr) {
          console.error('❌ Erro ao renomear arquivo de avatar:', renameErr);
        }
      }
    }

    const avatarUrl = `/avatars/${filename}`;

    // Se temos o ID do membro, atualizar o banco de dados
    if (memberId) {
      try {
        const result = await db.execute(
          'UPDATE membros SET avatar_url = $1, updated_at = NOW() WHERE id = $2',
          [avatarUrl, memberId]
        );

        if (result.rowCount === 0) {
          console.warn(`⚠️ Membro não encontrado ao atualizar avatar: ${memberId}`);
          return res.status(404).json({ message: 'Membro não encontrado para atualizar avatar.', avatar_url: avatarUrl, memberId });
        }

        console.log(`✅ Avatar atualizado no banco para membro ${memberId}: ${avatarUrl}`);
      } catch (dbError) {
        console.error('❌ Erro ao atualizar avatar no banco:', dbError);
        return res.status(500).json({ message: 'Erro ao atualizar avatar no banco de dados.', error: dbError.message });
      }
    }

    res.json({ 
      avatar_url: avatarUrl,
      message: 'Avatar enviado com sucesso!',
      memberId: memberId
    });
  } catch (error) {
    console.error('❌ Erro ao fazer upload de avatar:', error);
    res.status(500).json({ 
      message: 'Erro ao fazer upload do avatar.',
      error: error.message 
    });
  }
});

// Rota para limpar avatars não utilizados
router.post('/cleanup-avatars', async (req, res) => {
  try {
    const avatarsDir = path.join(__dirname, '../../public/avatars');
    
    // Buscar avatars em uso no banco de dados
    const result = await db.query(
      "SELECT DISTINCT avatar_url FROM membros WHERE avatar_url IS NOT NULL AND avatar_url != ''"
    );
    
    const avatarsEmUso = new Set();
    result.forEach(r => {
      const filename = r.avatar_url.replace('/avatars/', '');
      avatarsEmUso.add(filename);
    });
    
    // Listar todos os arquivos na pasta avatars
    const arquivos = fs.readdirSync(avatarsDir);
    
    const removidos = [];
    const mantidos = [];
    
    arquivos.forEach(arquivo => {
      if (!avatarsEmUso.has(arquivo)) {
        // Arquivo não está em uso, remover
        const filePath = path.join(avatarsDir, arquivo);
        try {
          fs.unlinkSync(filePath);
          removidos.push(arquivo);
          console.log(`🗑️  Avatar não utilizado removido: ${arquivo}`);
        } catch (err) {
          console.error(`❌ Erro ao remover ${arquivo}:`, err);
        }
      } else {
        mantidos.push(arquivo);
      }
    });
    
    console.log(`✅ Limpeza concluída: ${removidos.length} removidos, ${mantidos.length} mantidos`);
    
    res.json({
      message: 'Limpeza de avatars concluída com sucesso',
      removidos: removidos.length,
      mantidos: mantidos.length,
      detalhes: {
        arquivosRemovidos: removidos,
        arquivosMantidos: mantidos
      }
    });
  } catch (error) {
    console.error('❌ Erro ao limpar avatars:', error);
    res.status(500).json({ 
      message: 'Erro ao limpar avatars não utilizados',
      error: error.message 
    });
  }
});

module.exports = router;
