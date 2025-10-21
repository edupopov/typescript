// Importa as bibliotecas necessárias
import { Pool } from 'pg';
import * as readlineSync from 'readline-sync';

// --- 1. Configuração da Conexão com o Banco de Dados ---
// Usamos os dados da sua imagem do Docker
const dbConfig = {
    user: 'aluno',
    host: 'localhost', // Como o Docker está expondo a porta, usamos localhost
    database: 'db_profedu',
    password: '102030',
    port: 5432,       // A porta padrão do PostgreSQL
};

// Cria um "pool" de conexões
const pool = new Pool(dbConfig);

// --- 2. Função Principal para Executar a Lógica ---
async function inserirDados() {
    console.log("--- Cadastro de Novo Aluno ---");

    // Coleta os dados do usuário via terminal
    const nome = readlineSync.question('Digite o nome: ');
    const idade = readlineSync.questionInt('Digite a idade: '); // questionInt já converte para número
    const dataNasc = readlineSync.question('Digite a data de nascimento (formato AAAA-MM-DD): ');

    // Validação simples para garantir que os campos não estão vazios
    if (!nome || !idade || !dataNasc) {
        console.error("Erro: Todos os campos são obrigatórios!");
        return; // Encerra a função se algum campo estiver vazio
    }

    try {
        // --- 3. Conecta e Insere os Dados ---
        console.log("\nConectando ao banco de dados...");
        const client = await pool.connect(); // Pega uma conexão do pool

        // O SQL para inserir os dados.
        // Usamos $1, $2, $3 para evitar SQL Injection. É a forma segura!
        const insertQuery = `
            INSERT INTO public.pessoas (nome, idade, data_nasc)
            VALUES ($1, $2, $3)
        `;

        // O array de valores que substituirá $1, $2, $3
        const values = [nome, idade, dataNasc];

        // Executa a query
        await client.query(insertQuery, values);

        // Libera a conexão de volta para o pool
        client.release();

        console.log("-----------------------------------------");
        console.log(`Dados inseridos com sucesso!`);
        console.log(`Nome: ${nome}, Idade: ${idade}, Nascimento: ${dataNasc}`);
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("Ocorreu um erro ao inserir os dados:", error);
    } finally {
        // --- 4. Encerra a Conexão ---
        // Garante que o pool de conexões será fechado ao final
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

// --- 5. Chama a função principal para iniciar o processo ---
inserirDados();
