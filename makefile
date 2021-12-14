build-dev:
	cd server && docker build -t api-server .
	cd web && docker build -t react-web .

run-dev:
	docker-compose up