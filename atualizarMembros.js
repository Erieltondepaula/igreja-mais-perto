import mongoose from 'mongoose';
import Member from './models/Member'; // ajuste para o caminho do seu modelo

async function atualizarStatusMembros() {
  await mongoose.connect('mongodb://localhost:27017/seu_banco_de_dados'); // ajuste sua string de conexão

  // Atualizar status: "membro" ou "batizado" para "ativo"
  await Member.updateMany(
    { status: { $in: ['membro', 'batizado'] } },
    { $set: { status: 'ativo' } }
  );

  // Atualizar Batizado e Membro: se batizado = true, membro = true, senão false
  const membros = await Member.find();

  for (const m of membros) {
    const batizado = !!m.batizado;
    const status = m.status === 'desligado' ? 'desligado' : 'ativo';
    await Member.updateOne(
      { _id: m._id },
      {
        $set: {
          batizado,
          membro: batizado,
          status
        }
      }
    );
  }

  console.log('Atualização finalizada.');
  await mongoose.disconnect();
}

atualizarStatusMembros().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
