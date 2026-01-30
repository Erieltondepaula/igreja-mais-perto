<<<<<<< HEAD
// Script para limpar localStorage e testar conexão com Access
console.log('🧹 Limpando dados locais...');
localStorage.clear();

console.log('🔄 Testando conexão com API...');
fetch('http://localhost:5001/api/members')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Dados do Access carregados:', data);
    location.reload();
  })
  .catch(error => {
    console.error('❌ Erro ao conectar com Access:', error);
=======
// Script para limpar localStorage e testar conexão com Access
console.log('🧹 Limpando dados locais...');
localStorage.clear();

console.log('🔄 Testando conexão com API...');
fetch('http://localhost:5001/api/members')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Dados do Access carregados:', data);
    location.reload();
  })
  .catch(error => {
    console.error('❌ Erro ao conectar com Access:', error);
>>>>>>> d40cf2ed0fd887f2355535dfcd58873dffe4130a
  });