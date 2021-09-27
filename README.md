<h2 align="center">Primeiros Passos</h2>

### Requisitos

Para começar, você deve clonar ou baixar o repositório.

Você também deve ter node.js e yarn instalados em seu computador.

Para baixar o [node.js](https://nodejs.org/en/), basta clicar no link, geralmente o yarn é instalado junto com o node.js.

### Instalando

A primeira etapa que você deve seguir para executar o projeto é instalar todas as suas dependências.

Execute os seguintes comandos:

```
yarn install
```

### Executando o Webpack

```
yarn run dev (ambiente de desenvolvimento)
yarn run build (ambiente de produção)
```

## Uso

### Introdução

Este webpack foi feito basicamente para suprir a necessidade de múltiplas entradas como Javascript e Sass e gerar arquivos separados.

### BrowserSync

Este webpack tem BrowserSync que executa o recarregamento automático após qualquer alteração no arquivo, sem a necessidade de nenhum software como o 'Fiddler' para fazer essa alteração no ambiente de produção / desenvolvimento.

```js
new BrowserSyncPlugin({
    open: 'external',
    https: true,
    ui: false,
    host: `${env.STORE_NAME}.vtexlocal.com.br`,
    startpath: '/admin/login/',
    proxy: `https://${env.STORE_NAME}.vtexcommercestable.com.br`,
    serveStatic: [
      {
        route: '/arquivos',
        dir: `${PATHS.dist}/arquivos`,
      },
    ],
  }),
```

abra o arquivo 'package.json' e faça as seguintes configurações:

Esse json é para você colocar o nome da sua loja, substituindo {{ YOUR_STORE_NAME }} pelo nome da sua loja.

```json
  "scripts": {
    "dev": "webpack --config ./webpack/webpack.dev.js --watch --mode development --env.STORE_NAME={{ YOUR_STORE_NAME }}",
  },
```

Essas variáveis ​​são para a pasta atual onde os arquivos são gerados por padrão, o webpack é configurado para compilar tudo em / dist;

```js
  const PATHS = {
    ....
    global: __dirname + '/../../src/global',
  }
```

Esta variabel é responsável por fazer a troca de arquivos de sua máquina para 'https://{{sua loja}}.vtexcommercestable.com.br/arquivos/' da vtex. Lembrando que os arquivos devem ter o mesmo nome.

Depois de fazer a configuração básica para que o BrowserSync funcione

**Iniciando ambiente de desenvolvimento**

`yarn run dev`

Se tudo estiver ok, o terminal mostrará esta mensagem:

```js
[Browsersync] Proxying: https://{{yourStore}}.vtexcommercestable.com.br
[Browsersync] Access URLs:
 --------------------------------------------
  Local: https://localhost:3000
  External: https://{{yourStore}}.vtexlocal.com.br:3000
 --------------------------------------------
```

Depois de iniciar o terminal, ele abrirá um link para você fazer o login com suas credenciais de loja e depois de fornecer suas credenciais de loja, você pode desenvolver tudo neste url:

`https://{{yourStore}}.vtexlocal.com.br:3000/`

Recomendo o uso do navegador Firefox
