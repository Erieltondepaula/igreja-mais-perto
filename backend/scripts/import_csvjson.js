// Script Node.js para transformar e importar dados do csvjson.json para o PostgreSQL
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dashboard_membros',
  password: 'SUA_SENHA_AQUI', // Altere para sua senha
  port: 5432,
});

function toBoolean(val) {
  if (typeof val === 'string') return val.trim().toLowerCase() === 'sim';
  return !!val;
}

function splitNome(nome) {
  if (!nome) return { nome: '', sobrenome: '' };
  const partes = nome.trim().split(' ');
  return {
    nome: partes[0],
    sobrenome: partes.slice(1).join(' ')
  };
}

async function importar() {
  const filePath = path.join(__dirname, '../Excel Membros/csvjson.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const item of data) {
    const { nome, sobrenome } = splitNome(item.nome);
    const membro = {
      id_externo: item.Id,
      nome,
      sobrenome,
      nome_completo: item['Nome Completo'],
      data_nascimento: item.data_nascimento,
      idade: item.idade,
      mes: item.mes,
      telefone: item.telefone,
      sexo: item.sexo,
      observacoes: item.observacoes,
      status_civil: item.status_civil,
      conjuge: item.nome_conjuge,
      parentesco: item.parentesco,
      rua: item.rua,
      numero: item.numero,
      bairro: item.bairro,
      cidade: item.cidade,
      estado: item.estado,
      cep: item.cep,
      batizado: toBoolean(item.batizado),
      membro: toBoolean(item.membro),
      situacao_atual: item.situacao_atual,
      lider: toBoolean(item.e_lider),
      e_professor_ebq: toBoolean(item.e_professor_ebq),
      faixa_etaria: item.faixa_etaria,
      pequeno_grupo: toBoolean(item['Está em um pequeno grupo ?']),
      grupo: item.grupo,
      numerodomes: item.numerodomes
    };

    const keys = Object.keys(membro);
    const values = keys.map(k => membro[k]);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `INSERT INTO membros (${keys.join(', ')}) VALUES (${placeholders})`;
    try {
      await pool.query(sql, values);
      console.log(`Importado: ${membro.nome} ${membro.sobrenome}`);
    } catch (err) {
      console.error('Erro ao importar:', membro.nome, err.message);
    }
  }
  await pool.end();
}

importar();
