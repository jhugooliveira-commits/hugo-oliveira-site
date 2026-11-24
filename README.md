# Hugo Oliveira — Site profissional

Site estático em HTML/CSS/JavaScript, preparado para hospedagem gratuita na Vercel.

## Estrutura
- `index.html` — início
- `sobre.html` — sobre
- `servicos.html` — como trabalho + FAQ
- `contato.html` — contato + agendamento
- `assets/` — imagens, CSS e JavaScript

## Agendamento
O botão de agendamento usa:
https://calendar.app.google/Kig3jaQkufHSZWHf6

O site tenta abrir o Google Agenda dentro de um modal. Se o navegador/Google bloquear a incorporação, o usuário pode abrir o calendário diretamente.

## Publicação na Vercel
1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. Entre na Vercel e importe o repositório.
4. Como é um site estático, não é necessário banco de dados nem Supabase.
5. Faça o deploy.
6. Depois, se desejar, conecte um domínio próprio.

## Observação
As informações profissionais devem ser conferidas antes da publicação definitiva, especialmente cidades, modalidade de atendimento e demais dados de contato.

## Publicações

Adicione os textos autorizados em `scripts/publicacoes.json`. Cada item deve ter
`slug` (letras minúsculas, números e hífens), `titulo`, `resumo`, `data`
como AAAA-MM-DD e `paragrafos` como uma lista de textos.

Execute `node scripts/gerar-publicacoes.mjs` na raiz do repositório e revise
os arquivos gerados antes de enviá-los ao GitHub. O comando atualiza as
páginas de artigo, a listagem, as três publicações mais recentes na home e o
sitemap. A Vercel publica o HTML estático a partir do Git.
