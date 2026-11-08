// Garante que todos os testes utilizem exclusivamente o banco de testes.
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'digital_store_test';
process.env.DB_HOST = '127.0.0.1';
process.env.DB_PORT = '3307';