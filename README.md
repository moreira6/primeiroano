# Pequenos Guardiões do Respeito

Jogo educativo para estudantes do 1º ano do Ensino Fundamental, com cinco fases e cinco desafios em cada fase.

## Recursos
- Cinco fases desbloqueadas em sequência.
- Jogo da memória com imagens e emojis.
- Associação de imagens e palavras.
- Formação de palavras com letras.
- Situações de respeito e convivência.
- Quiz sobre cultura afro-brasileira e Consciência Negra.
- Pontuação, efeitos sonoros e narração das instruções.
- Certificado imprimível ao concluir todas as fases.
- Interface responsiva para computador, tablet e celular.

## Executar localmente
É necessário ter Node.js instalado.

```bash
npm install
npm run dev
```

## Publicar na Vercel
1. Extraia o ZIP.
2. Envie a pasta do projeto para um repositório no GitHub.
3. Na Vercel, escolha **Add New → Project** e importe o repositório.
4. A Vercel identificará o Vite automaticamente.
5. Use `npm run build` como comando de build e `dist` como diretório de saída, se esses campos não forem preenchidos automaticamente.
6. Clique em **Deploy**.

## Observações pedagógicas
- A narração utiliza a voz disponível no navegador/dispositivo (Web Speech API). A disponibilidade e a qualidade da voz em português dependem do dispositivo.
- Os efeitos sonoros são sintetizados no próprio navegador.
- Os elementos visuais principais usam emojis e CSS, sem depender de imagens externas.
- Recomenda-se que o professor acompanhe a atividade, leia os enunciados e converse com a turma sobre as respostas.
- O quiz apresenta fatos introdutórios: o Dia da Consciência Negra é celebrado em 20 de novembro; Zumbi foi uma liderança do Quilombo dos Palmares; a capoeira é uma expressão cultural afro-brasileira.
- O jogo não coleta nem envia dados dos estudantes. O nome digitado no certificado é usado somente na página para impressão.
