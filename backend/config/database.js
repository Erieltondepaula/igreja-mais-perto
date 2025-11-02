// Configuração do PostgreSQL
const config = {
  development: {
    user: 'membros_user',
    host: 'localhost',
    database: 'dashboard_membros',
    password: '252088',
    port: 5432,
    max: 20, // máximo de conexões no pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  production: {
    user: process.env.DB_USER || 'membros_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'dashboard_membros',
    password: process.env.DB_PASSWORD || '252088',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];