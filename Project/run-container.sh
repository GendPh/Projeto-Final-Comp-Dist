# 1. Inicia o docker-compose em modo detached
set -e
docker-compose up -d || { echo "Erro ao iniciar os contêineres."; exit 1; }

# 2. Aguarda o contêiner estar pronto
echo "Aguardando o contêiner iniciar..."
until curl -s http://localhost:3000 > /dev/null; do
  sleep 1
done

# 3. Detecta o sistema operacional e abre o navegador
URL="http://localhost:3000"

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open $URL
elif [[ "$OSTYPE" == "darwin"* ]]; then
  open $URL
elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  start $URL
else
  echo "Não foi possível detectar o sistema operacional para abrir o navegador."
  echo "Por favor, acesse manualmente: $URL"
fi