# CEGI — Dashboard web público

Dashboard responsivo, em português do Brasil, somente leitura. A página consulta os datastreams do Blynk por uma função server-side do Netlify; o token não é enviado ao navegador.

## Datastreams usados
- V0 tensão
- V1 corrente
- V2 potência aparente
- V3 consumo acumulado
- V4 custo acumulado
- V8 tarifa
- V9 limite econômico
- V13 consumo diário
- V14 variação diária
- V16 referência diária

## Publicação
1. Crie um repositório privado no GitHub e envie os arquivos desta pasta.
2. Importe o repositório no Netlify.
3. Em Site configuration → Environment variables, crie:
   - `BLYNK_AUTH_TOKEN`: token de autenticação do dispositivo Blynk.
   - `BLYNK_BASE_URL`: opcional; use `https://blynk.cloud` se a região do seu projeto usar esse domínio.
4. Faça deploy/redeploy.
5. Abra a URL publicada e verifique se os valores aparecem. Depois gere um QR com essa URL.

## Segurança
- Nunca coloque o token Blynk em `app.js`, `index.html` ou em qualquer arquivo público.
- Use um token de dispositivo com os menores privilégios possíveis. A função só faz chamadas GET.
- A página é pública: qualquer pessoa com o QR pode visualizar os dados. Não inclua dados pessoais nem controles de escrita.

## Observação
A função consulta cada datastream por meio do endpoint HTTP API do Blynk Cloud. O dashboard atualiza a cada 5 segundos. Se o Blynk limitar a frequência de chamadas, aumente `REFRESH_MS` em `app.js`.
