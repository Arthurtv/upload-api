# Upload API

Projeto Node.js com Express, Multer e Prisma para salvar uploads em SQLite.

## Requisitos

- Node.js 18+ ou compatível
- npm

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as variáveis:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

## Scripts

- `npm run prisma:generate`: gera o cliente Prisma
- `npm start`: inicia o servidor
- `npm run dev`: inicia o servidor em modo watch (Node 20+)

## Endpoints

### POST /api/upload

Faz upload de um arquivo multipart/form-data usando o campo `file`.
O upload exige um token válido de upload.

Exemplo com `curl`:

```bash
curl -H "Authorization: Bearer SEU_TOKEN_DE_UPLOAD" \
  -F "file=@/caminho/para/arquivo.txt" \
  http://localhost:3000/api/upload
```

Resposta esperada:

```json
{
  "message": "Upload realizado",
  "file": {
    "id": 1,
    "filename": "...",
    "path": "uploads/...",
    "mimetype": "...",
    "size": 123,
    "createdAt": "..."
  }
}
```

### GET /api/files

Lista os arquivos cadastrados no banco.

> O endpoint de listagem não exige token de upload. O token só é usado para autorizar o envio de arquivos.

### POST /api/tokens

Gera um novo token de upload. Não requer autenticação.

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/api/tokens
```

Exemplo:

```bash
curl http://localhost:3000/api/files
```

### GET /api/files/:id

Retorna os metadados de um upload específico.

Exemplo:

```bash
curl http://localhost:3000/api/files/1
```

## Exemplo de frontend

Após iniciar o servidor, abra no navegador:

```bash
http://localhost:3000/
```

A página permite enviar um arquivo diretamente para `POST /api/upload`, mostra o resultado e fornece um link para abrir o arquivo no navegador.

## Observações

- Tipo de arquivo permitido: `jpeg`, `png`, `gif`, `pdf`, `txt`, `zip`, `apk`
- Limite de upload: `10 MB`
- Os arquivos são salvos em `uploads/`

## Dicas

1. Gera o cliente Prisma antes de rodar o servidor:

```bash
npm run prisma:generate
```

2. Inicie o servidor:

```bash
npm start
```

3. Acesse os endpoints em `http://localhost:3000`.
