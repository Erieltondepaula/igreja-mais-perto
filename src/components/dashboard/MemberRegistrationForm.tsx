// Componente para gerar ficha de cadastro de membro para impressão
// Local: src/components/dashboard/MemberRegistrationForm.tsx

import { Member } from '@/types/member';
import { calculateAge } from '@/utils/memberUtils';
import { ChurchSettings } from '@/types/churchSettings';
import { useEffect, useState } from 'react';

interface MemberRegistrationFormProps {
  member: Member;
  churchSettings?: ChurchSettings;
}

export const MemberRegistrationForm = ({ member, churchSettings: propChurchSettings }: MemberRegistrationFormProps) => {
  const [churchSettings, setChurchSettings] = useState<ChurchSettings | null>(propChurchSettings || null);

  useEffect(() => {
    if (!propChurchSettings) {
      // Carregar configurações da igreja se não foram fornecidas
      fetch('http://localhost:5001/api/church-settings')
        .then(res => res.json())
        .then(data => setChurchSettings(data))
        .catch(err => console.error('Erro ao carregar configurações:', err));
    }
  }, [propChurchSettings]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const age = calculateAge(member.dataNascimento);

  // Valores padrão caso as configurações ainda não tenham sido carregadas
  const nome = churchSettings?.nome || 'Igreja Evangélica Quadrangular';
  const denominacao = churchSettings?.denominacao || 'Templo Central de Cariacica';
  const telefone = churchSettings?.telefone || '';
  const email = churchSettings?.email || 'cariacica@ieqcariacica.com.br';
  const endereco = churchSettings?.endereco || 'Rua Principal, Centro';
  const cidadeCompleta = churchSettings?.cidade && churchSettings?.estado 
    ? `${churchSettings.cidade}, ${churchSettings.estado}, ${churchSettings.pais || 'Brasil'}`
    : 'Cariacica, ES, Brasil';
  const logoUrl = churchSettings?.logo_url 
    ? `http://localhost:5001${churchSettings.logo_url}`
    : null;

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      width: '210mm',
      margin: '0 auto',
      backgroundColor: '#fff',
      border: '3px solid #005b7f',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      WebkitPrintColorAdjust: 'exact',
      printColorAdjust: 'exact',
      colorAdjust: 'exact',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    } as React.CSSProperties}>
      {/* Cabeçalho Azul */}
      <div style={{
        background: 'linear-gradient(135deg, #005b7f 0%, #0077a3 100%)',
        backgroundColor: '#005b7f',
        color: '#fff',
        padding: '32px 40px 28px 40px',
        position: 'relative',
        overflow: 'hidden',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
        colorAdjust: 'exact',
        fontWeight: 700,
        fontSize: '22px',
        letterSpacing: '1.5px',
        boxShadow: '0 2px 8px #005b7f22',
      } as React.CSSProperties}>
        {/* Onda decorativa */}
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: 0,
          width: '100%',
          height: '60px',
          backgroundColor: '#1aa399',
          borderRadius: '50% 50% 0 0',
          transform: 'scaleX(1.5)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          colorAdjust: 'exact'
        } as React.CSSProperties} />
        
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          letterSpacing: '2px',
          color: '#fff',
          textShadow: '0 2px 8px #00334d99, 0 1px 0 #fff',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>
            Ficha de Cadastro de Membros
          </div>
        </div>
      </div>

      {/* Informações da Igreja */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '15px 30px',
        backgroundColor: '#fff',
        borderBottom: '2px solid #1aa399'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {logoUrl ? (
            <img 
              src={logoUrl}
              alt="Logo"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ fontSize: '50px' }}>⛪</div>
          )}
          <div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#005b7f' }}>
              {nome}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {denominacao}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
          <div>{telefone}</div>
          <div>{email}</div>
          <div>{endereco}</div>
          <div>{cidadeCompleta}</div>
        </div>
      </div>

      {/* Corpo do Formulário */}
      <div style={{ padding: '30px', position: 'relative' }}>
        
        {/* Dados Pessoais com Foto */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#005b7f',
            borderBottom: '2px solid #005b7f',
            paddingBottom: '10px',
            marginBottom: '25px',
            letterSpacing: '1px',
          }}>
            Dados Pessoais
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {/* Foto */}
            <div style={{ flexShrink: 0 }}>
              {member.avatar_url ? (
                <img 
                  src={member.avatar_url.startsWith('http') ? member.avatar_url : `http://localhost:5001${member.avatar_url}`}
                  alt={member.nome}
                  style={{ 
                    width: '100px', 
                    height: '120px', 
                    objectFit: 'cover', 
                    border: '2px solid #005b7f',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <div style={{ 
                  width: '100px', 
                  height: '120px', 
                  backgroundColor: '#f0f0f0',
                  border: '2px solid #005b7f',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: '#ccc'
                }}>
                  👤
                </div>
              )}
            </div>
            
            {/* Dados em grid */}
            <div style={{ flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 0', width: '50%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '140px' }}>Nome Completo:</span>
                        <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                          {member.nomeCompleto || member.nome}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 0 8px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '120px' }}>Data de Nascimento:</span>
                        <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px', minWidth: '80px' }}>
                          {formatDate(member.dataNascimento)}
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '12px', marginLeft: '16px' }}>Idade:</span>
                        <span style={{ borderBottom: '1px solid #333', flexGrow: 0, paddingBottom: '2px', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>
                          {age} anos
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0' }}></td>
                    <td style={{ padding: '8px 0 8px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '140px' }}>Status Civil:</span>
                        <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                          {member.statusCivil || ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0' }} colSpan={2}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '140px' }}>Sexo:</span>
                        <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                          {member.sexo === 'M' ? 'Masculino' : 'Feminino'}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contato e Endereço */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#005b7f',
            borderBottom: '2px solid #005b7f',
            paddingBottom: '10px',
            marginBottom: '25px',
            letterSpacing: '1px',
          }}>
            Contato e Endereço
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0', width: '50%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '80px' }}>Telefone:</span>
                    <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                      {member.telefone || ''}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '8px 0 8px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '80px' }}>Email:</span>
                    <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                      {member.email || ''}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }} colSpan={2}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '80px' }}>Endereço:</span>
                    <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                      {member.endereco || ''}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '80px' }}>Cidade:</span>
                    <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                      {member.cidade || ''}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '8px 0 8px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '80px' }}>Bairro:</span>
                    <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                      {member.bairro || ''}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '80px' }}>CEP:</span>
                    <span style={{ borderBottom: '1px solid #333', flexGrow: 1, paddingBottom: '2px', fontSize: '12px' }}>
                      {member.cep || ''}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '8px 0 8px 15px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dados Eclesiásticos */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#005b7f',
            borderBottom: '2px solid #005b7f',
            paddingBottom: '10px',
            marginBottom: '25px',
            letterSpacing: '1px',
          }}>
            Dados Eclesiásticos
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px', minWidth: '150px' }}>Status do Cadastro:</span>
            <span style={{ borderBottom: '1px solid #333', padding: '4px 12px', fontSize: '12px' }}>
              {member.status === 'ativo' ? 'Ativo' : 'Desligado'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid #005b7f',
                backgroundColor: '#fff',
                borderRadius: '2px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {member.membro && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#005b7f',
                    borderRadius: '1px',
                  }} />
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Membro</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid #005b7f',
                backgroundColor: '#fff',
                borderRadius: '2px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {member.batizado && (
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#005b7f',
                    borderRadius: '1px',
                  }} />
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Batizado</span>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#005b7f',
            borderBottom: '2px solid #005b7f',
            paddingBottom: '10px',
            marginBottom: '25px',
            letterSpacing: '1px',
          }}>
            Observações
          </div>
          <div style={{
            fontSize: '14px',
            minHeight: '300px',
            lineHeight: '30px',
            border: '1.5px solid #ccc',
            borderRadius: '8px',
            padding: '18px',
            background: '#fafcff',
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '320px',
            boxSizing: 'border-box',
          }}>
            <div style={{ minHeight: '220px', flex: 1, wordBreak: 'break-word' }}>
              {member.observacoes || <span style={{ color: '#bbb' }}>[Sem observações]</span>}
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderBottom: '1px solid #e0e0e0', height: '22px', margin: '8px 0' }}></div>
            ))}
          </div>
        </div>

        {/* Marca d'água */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.03,
          fontSize: '300px',
          color: '#005b7f',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          ✝
        </div>
      </div>

      {/* Rodapé */}
      <div style={{
        background: 'linear-gradient(135deg, #1aa399 0%, #17c9bb 100%)',
        backgroundColor: '#1aa399',
        color: '#fff',
        textAlign: 'center',
        padding: '12px',
        fontSize: '11px',
        fontWeight: '500',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
        colorAdjust: 'exact',
        marginTop: 'auto'
      } as React.CSSProperties}>
        {endereco} - {cidadeCompleta}
      </div>
    </div>
  );
};
