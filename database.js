const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// 📌 Caminho do banco de dados
const dbPath = path.join(__dirname, "restaurante.db");

// 📌 Conectar ao banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("✅ Conectado ao banco de dados SQLite.");

        // 🔒 Ativar chaves estrangeiras
        db.run("PRAGMA foreign_keys = ON;", (err) => {
            if (err) {
                console.error("❌ Erro ao ativar chaves estrangeiras:", err.message);
            } else {
                console.log("🔒 Integridade referencial ativada.");
            }
        });
    }
});

// 📌 Função para adicionar uma nova mesa
function adicionarMesa(numero, callback) {
    if (!numero || isNaN(numero)) {
        return callback(new Error("Número da mesa é obrigatório e deve ser um número válido."), null);
    }

    const sql = `INSERT INTO Mesas (numero) VALUES (?)`;
    db.run(sql, [numero], function (err) {
        if (err) {
            console.error("❌ Erro ao adicionar mesa:", err.message);
            return callback(err, null);
        }
        console.log(`✅ Mesa ${numero} adicionada com sucesso!`);
        return callback(null, this.lastID);
    });
}

// 📌 Função para adicionar um pedido
function adicionarPedido(mesa_id, produto_id, funcionario_id, quantidade, preco_total, callback) {
    if (!mesa_id || !produto_id || !funcionario_id || !quantidade || !preco_total) {
        return callback(new Error("Todos os campos do pedido são obrigatórios."), null);
    }

    if (isNaN(mesa_id) || isNaN(produto_id) || isNaN(funcionario_id) || isNaN(quantidade) || isNaN(preco_total)) {
        return callback(new Error("Os valores informados devem ser numéricos."), null);
    }

    const sql = `
        INSERT INTO Pedidos (mesa_id, produto_id, funcionario_id, quantidade, preco_total) 
        VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [mesa_id, produto_id, funcionario_id, quantidade, preco_total], function (err) {
        if (err) {
            console.error("❌ Erro ao adicionar pedido:", err.message);
            return callback(err, null);
        }
        console.log(`✅ Pedido adicionado para a Mesa ${mesa_id}!`);
        return callback(null, this.lastID);
    });
}

// 📌 Função para listar pedidos de uma mesa específica
function listarPedidosPorMesa(mesa_id, callback) {
    if (!mesa_id || isNaN(mesa_id)) {
        return callback(new Error("Número da mesa é obrigatório e deve ser um número válido."), null);
    }

    const sql = `
        SELECT Pedidos.id, Produtos.nome AS produto, Pedidos.quantidade, Pedidos.preco_total
        FROM Pedidos
        JOIN Produtos ON Pedidos.produto_id = Produtos.id
        WHERE Pedidos.mesa_id = ?`;

    db.all(sql, [mesa_id], (err, rows) => {
        if (err) {
            console.error("❌ Erro ao buscar pedidos:", err.message);
            return callback(err, null);
        }

        if (!rows || rows.length === 0) {
            console.log(`🔎 Nenhum pedido encontrado para a Mesa ${mesa_id}.`);
            return callback(null, []);
        }

        console.log(`📜 Pedidos encontrados para a Mesa ${mesa_id}.`);
        return callback(null, rows);
    });
}

// 📌 Função para fechar conexão ao encerrar aplicação corretamente
function fecharConexao() {
    db.close((err) => {
        if (err) {
            console.error("❌ Erro ao fechar o banco de dados:", err.message);
        } else {
            console.log("🔌 Conexão com o banco de dados encerrada.");
        }
    });
}

// 📌 Capturar sinais de encerramento para fechar conexão corretamente
process.on("SIGINT", () => {
    console.log("\n🛑 Encerrando aplicação...");
    fecharConexao();
    process.exit(0);
});

process.on("SIGTERM", () => {
    fecharConexao();
    process.exit(0);
});

process.on("exit", fecharConexao);

// 📌 Exportar funções para outros arquivos corretamente
module.exports = {
    db,
    adicionarMesa,
    adicionarPedido,
    listarPedidosPorMesa,
    fecharConexao
};
