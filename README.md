# Como usar o projeto com Docker Compose
Este projeto utiliza imagens publicadas no Docker Hub para facilitar sua execução. Siga as etapas abaixo para rodar o projeto:

# Pré-requisitos
Certifique-se de que o Docker e o Docker Compose estão instalados em sua máquina.
    Instale o Docker
    Instale o Docker Compose

# Etapas para rodar o projeto

## Clone esse repositório
git clone https://github.com/GendPh/Projeto-Final-Comp-Dist.git
cd Projeto-Final-Comp-Dist

## Configure o arquivo .env
No diretório Server, renomeie o arquivo .env.example para .env e configure as variáveis de ambiente necessárias.

## Suba o projeto com o Docker Compose:
No diretório Project, execute o comando docker-compose up -d, que baixará as imagens e iniciará os containeres, acesse a aplicação pelo localhost:3000

Opcionalmente, disponibiliza-se o arquivo run-container.sh, com atalho na pasta raiz, para rápida inicialização do projeto através do docker-compose. Basta executá-lo após configuração do .env.
O script iniciará a app em seu browser automaticamente.

## Interrupção do projeto
Execute o comando docker-compose down para encerrar o projeto
