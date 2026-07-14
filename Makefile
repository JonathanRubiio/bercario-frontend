# Comandos locales con Docker y compose (alineado con ticket-sales)

dev:
	docker compose -f docker-compose.local.yml up --build -d

down:
	docker compose -f docker-compose.local.yml down --remove-orphans

down-all:
	docker compose -f docker-compose.local.yml down -v --rmi all --remove-orphans

stop:
	docker compose -f docker-compose.local.yml stop

logs:
	docker compose -f docker-compose.local.yml logs -f

# --- Comandos locales nativos (opcional) ---
install:
	pnpm install

build:
	pnpm build

clean:
	rm -rf .next node_modules out build
