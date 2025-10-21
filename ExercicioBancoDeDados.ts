// --- 1. Importação das Bibliotecas ---

// Driver para conectar ao PostgreSQL
import { Pool } from 'pg'; 
// Biblioteca para ler a entrada do usuário no terminal.
// A importação foi corrigida para funcionar com o "type": "module" no package.json.
import readlineSync from 'readline-sync'; 

// --- 2. Configuração da Conexão com o Banco de Dados ---
// As informações são baseadas na sua imagem do Docker.
// Lembre-se: este é um exemplo de aula - NUNCA deixe o usuário e senha fixos no código em um projeto real.
const dbConfig = {
    user: 'aluno',
    host: 'localhost', // O Docker expõe a porta do container para a sua máquina (localhost)
    database: 'db_profedu',
    password: '102030',
    port: 5432,       // Porta padrão do PostgreSQL
};

// O "Pool" gerencia múltiplas conexões para otimizar a performance.
const pool = new Pool(dbConfig);

// --- 3. Função Principal para Executar a Lógica ---
// Usamos 'async' para poder usar 'await', que simplifica o código assíncrono.
async function inserirDados() {
    console.log("--- Cadastro de Novo Aluno ---");

    // Coleta os dados do usuário via terminal de forma síncrona (espera pela resposta)
    const nome = readlineSync.question('Digite o nome: ');
    const idade = readlineSync.questionInt('Digite a idade: '); // questionInt já converte para número
    const dataNasc = readlineSync.question('Digite a data de nascimento (formato AAAA-MM-DD): ');

    // Validação simples para garantir que o usuário não deixou campos em branco
    if (!nome || !idade || !dataNasc) {
        console.error("Erro: Todos os campos são obrigatórios! Operação cancelada.");
        // Encerra a função se algum campo estiver vazio.
        // Precisamos fechar o pool de conexões aqui também para o programa terminar.
        await pool.end();
        return; 
    }

    try {
        // --- 4. Conexão e Inserção dos Dados ---
        console.log("\nConectando ao banco de dados...");
        const client = await pool.connect(); // Pega uma conexão disponível do pool

        console.log("Conexão bem-sucedida! Inserindo dados...");
        
        // Comando SQL para inserir os dados.
        // NOTA: Se você criou a coluna com hífen ("data-nasc"), troque data_nasc por "data-nasc" abaixo.
        // Usar $1, $2, $3 é a prática mais segura para passar valores para uma query (evita SQL Injection).
        const insertQuery = `
            INSERT INTO public.pessoas (nome, idade, data_nasc)
            VALUES ($1, $2, $3)
        `;

        // Array de valores que substituirão $1, $2, $3 na ordem correta
        const values = [nome, idade, dataNasc];

        // Executa a query no banco de dados
        await client.query(insertQuery, values);

        // Libera a conexão de volta para o pool para que possa ser reutilizada
        client.release();

        console.log("-----------------------------------------");
        console.log(`Dados inseridos com sucesso!`);
        console.log(`Nome: ${nome}, Idade: ${idade}, Nascimento: ${dataNasc}`);
        console.log("-----------------------------------------");

    } catch (error) {
        // Captura qualquer erro que possa ocorrer durante a conexão ou inserção
        console.error("Ocorreu um erro ao interagir com o banco de dados:", error);
    } finally {
        // --- 5. Encerramento da Conexão ---
        // O bloco 'finally' sempre será executado, com ou sem erro.
        // Isso garante que o pool de conexões será fechado e o programa não ficará "travado".
        await pool.end();
        console.log("Conexão com o banco de dados encerrada.");
    }
}

// --- 6. Chamada da Função ---
// Inicia todo o processo
inserirDados();
