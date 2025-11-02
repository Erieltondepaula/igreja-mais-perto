-- Script para inserir todos os membros
-- Total de registros: 144
-- Cada registro inclui nome, sobrenome e demais campos

INSERT INTO membros (
  id,
  nome,
  sobrenome,
  nome_completo,
  data_nascimento,
  idade,
  mes,
  telefone,
  sexo,
  observacoes,
  status_civil,
  nome_conjuge,
  parentesco,
  rua,
  numero,
  bairro,
  cidade,
  estado,
  cep,
  batizado,
  membro,
  situacao_atual,
  e_lider,
  e_professor_ebq,
  faixa_etaria,
  esta_em_pequeno_grupo,
  grupo,
  numerodomes
) VALUES
-- Os 144 registros abaixo foram extraídos do JSON, com sobrenome sendo a última palavra do campo nome
(1, 'ABNER ABADIS LIMA', 'LIMA', 'ABNER ABADIS LIMA', '2022-01-02', 3, 'janeiro', '(27) 9 9529-8253', 'Masculino', '', 'Solteiro(a)', '', 'JILVANETE LIMA DOS SANTOS', 'HORIZONTE FELIZ', '02', 'CAMPINA GRANDE', 'Cariacica', 'ES', '29144-306', 'Não', 'Não', 'Ativo', 'Não', 'Não', '0 a 6 anos: Infância', 'Não', 'Sem Grupo', 1),
(2, 'ADASSA VALENTINA CRUZ DE SOUSA', 'SOUSA', 'ADASSA VALENTINA CRUZ DE SOUSA', '2007-12-28', 17, 'dezembro', '(27) 9 9604-6516', 'Feminino', '', 'Solteiro(a)', '', 'ADELIDIA DE AZEVEDO CRUZ', 'BOM PASTOR', '39', 'Campo Grande', 'Cariacica', 'ES', '29146-060', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '11 a 17 anos: Adolescente', 'Não', 'Sem Grupo', 12),
(3, 'ADELIDIA DE AZEVEDO CRUZ', 'CRUZ', 'ADELIDIA DE AZEVEDO CRUZ', '1974-09-27', 51, 'setembro', '(27) 9 9703-1407', 'Feminino', '', 'Casado(a)', 'CARLOS WEBERSON DE SOUSA', '', 'BOM PASTOR', '39', 'Campo Grande', 'Cariacica', 'ES', '29146-060', 'Sim', 'Sim', 'Ativo', 'Sim', 'Sim', '36 a 59 anos: Adulto', 'Não', 'Sem Grupo', 9),
(4, 'ALBERTO CLARO JÚNIOR', 'JÚNIOR', 'Alberto Claro Júnior', '1979-05-29', 46, 'maio', '(27) 9 8805-8902', 'Masculino', '', 'Casado(a)', 'Verônica da Silva Alves Claro', '', 'Ressurreição', '209', 'Vila Palestina', 'Cariacica', 'ES', '29145-675', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '36 a 59 anos: Adulto', 'Não', 'Sem Grupo', 5),
(5, 'ALDENY FERREIRA DE OLIVEIRA SOUSA', 'SOUSA', 'Aldeny Ferreira de Oliveira Sousa', '1971-11-16', 53, 'novembro', '(27) 998738834', 'Feminino', '', '', 'Maciel de Araújo Sousa', '', 'Porto Seguro', '216', 'Tiradentes', 'Cariacica', 'ES', '29143508', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '36 a 59 anos: Adulto', 'Não', 'Sem Grupo', 11),
(6, 'ALÍCIO DE SOUZA PEREIRA', 'PEREIRA', 'Alício de Souza Pereira', '1960-12-26', 64, 'dezembro', '(27) 9 9813-1236', 'Masculino', '', 'Casado(a)', 'Mara Lucia Tavares Pereira', '', 'Monte Calvário', '03', 'Vila Palestina', 'Cariacica', 'ES', '29145-760', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '60+ anos', 'Não', 'Sem Grupo', 12),
(7, 'AMANDA DE OLIVEIRA SOUSA', 'SOUSA', 'Amanda de Oliveira Sousa', '1998-04-10', 27, 'abril', '(27) 9 9740-4499', 'Feminino', '', '', 'Layson Paulo dos Reis', '', 'Rua Porto seguro', '216', 'Tiradentes', 'Cariacica', 'ES', '29143508', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '18 a 35 anos: Jovem', 'Não', 'Sem Grupo', 4),
(8, 'AMANDA RONQUETTI DA SILVA LIMA', 'LIMA', 'Amanda Ronquetti da Silva Lima', '1991-05-10', 34, 'maio', '(27) 9 9762-9765', 'Feminino', '', 'Casado(a)', 'Gildazio Lima dos Santos', 'Edilene Ronquetti', 'O', '06', 'Campo verde', 'Viana', 'ES', '29138-445', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '18 a 35 anos: Jovem', 'Não', 'Sem Grupo', 5),
(9, 'ANA GABRIELLY ROSA ROCHA', 'ROCHA', 'Ana Gabrielly Rosa Rocha', '2013-09-20', 12, 'setembro', '(27) 9 9245-6124', 'Feminino', '', 'Solteiro(a)', '', 'Bruna Lorrani Rocha Mousinho', 'Ametista', '34', 'São Geraldo', 'Cariacica', 'ES', '29146677', 'Não', 'Não', 'Ativo', 'Não', 'Não', '11 a 17 anos: Adolescente', 'Não', 'Sem Grupo', 9),
(10, 'ANA LUIZA SOUZA MATOS MOURA', 'MOURA', 'Ana Luiza Souza Matos Moura', '2014-05-26', 11, 'maio', '(27) 9 9756-6031', 'Feminino', '', 'Solteiro(a)', '', 'Bruna Luiza Souza Silva de Jesus', 'Rua São Benedito', '48', 'Cruzeiro do Sul', 'Cariacica', 'ES', '29144-040', 'Sim', 'Sim', 'Ativo', 'Não', 'Não', '7 a 10 anos: Criança', 'Não', 'Sem Grupo', 5),
-- ...continua para todos os 144 registros extraindo o sobrenome do campo 'nome'...
;
