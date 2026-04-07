## Requisitos

- Conferir a versão do Node.js 22 ou superior: nove -v
- Conferir se esta instalado o npx: npx -v

## Como rodar o projeto baixado

Alterar o endereço da API no arquivo services/api.tsx

Instalar todas as dependências indicadas pelo package.json.

```
npm install
```

Rodar o projeto React.

```
npm run dev
```

Acessar no navegador a URL

```
http://localhost:3000
```

## Sequencia para criar o projeto

Criar o projeto com React e Next.js . O ponto "." indica que deve ser criado no próprio diretório.

```
npx create-next-app@latest.
```

Pacote para conectar a aplicação à API.

```
npm i axios
```

Instalar a dependência Yup para validar o formulário. O react-hook-form para gerenciar o formulário. O resolvers para conectar react-hook-form com Yup.

```
npm install @hookform/resolvers yup react-hook-form
```

Rodar o projeto React.

```
npm run dev
```

Acessar no navegador a URL.

```
http://localhost:3000
```

## Como enviar e baixar os arquivos do GitHub

Baixar os arquivos do Git.

```
git clone -b <branch_name> <repository_url>
```

Verificar em qual branch esta

```
git branch
```

Baixar as atualizações do GitHub

```
git pull
```

Adicionar todos os arquivos modificados no staging area - área de preparação.

```
git add .
```

Commit representa um conjunto de alterações em um ponto específico da história do seu projeto, registra apenas as alterações adicionadas ao índice de preparação.
O comando -m permite que insira a mensagem de commit diretamente na linha de comando.

```
git commit -m "Base projeto"
```

Enviar os commits locais, para um repositório remoto.

```
git push <remote> <branch>
git push origin develop
```
