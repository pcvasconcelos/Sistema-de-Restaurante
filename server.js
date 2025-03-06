const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 4000;
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(express.json());  // Usando express.json() ao invés de body-parser

// ✅ Mensagem de boas-vindas do servidor
app.get('/', (req, res) => {
    res.send('🔥 Servidor do Restaurante está rodando!');
});

// ✅ ROTA PARA LISTAR PEDIDOS POR MESA
app.get('/pedidos/:mesaId', (req, res) => {
    const { mesaId } = req.params;

    db.all("SELECT * FROM Pedidos WHERE mesa_id = ?", [mesaId], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar pedidos:", err);
            return res.status(500).json({ mensagem: "Erro ao buscar pedidos." });
        }

        if (rows.length === 0) {
            return res.json({ mensagem: "Nenhum pedido encontrado para esta mesa.", pedidos: [] });
        }

        res.json({ pedidos: rows });
    });
});

// ✅ ADICIONAR PEDIDO
app.post('/pedidos', (req, res) => {
    const { mesa, produto, quantidade, preco } = req.body;

    if (!mesa || !produto || !quantidade || !preco) {
        return res.status(400).json({ mensagem: "Preencha todos os campos corretamente." });
    }

    db.run(
        "INSERT INTO Pedidos (mesa_id, produto, quantidade, preco, data) VALUES (?, ?, ?, ?, datetime('now'))",
        [mesa, produto, quantidade, preco],
        function (err) {
            if (err) {
                console.error("Erro ao adicionar pedido:", err);
                return res.status(500).json({ mensagem: "Erro ao adicionar pedido." });
            }
            res.json({ mensagem: "Pedido adicionado com sucesso!", pedidoId: this.lastID });
        }
    );
});

// ✅ FECHAR CONTA
app.post('/fechar-conta', (req, res) => {
    const { mesa, pagamento } = req.body;

    if (!mesa || !pagamento) {
        return res.status(400).json({ mensagem: "Preencha todos os campos corretamente." });
    }

    db.get("SELECT SUM(preco * quantidade) AS total FROM Pedidos WHERE mesa_id = ?", [mesa], (err, row) => {
        if (err) {
            console.error("Erro ao calcular total:", err);
            return res.status(500).json({ mensagem: "Erro ao calcular total." });
        }

        if (!row || row.total === null) {
            return res.json({ mensagem: "Nenhum pedido encontrado para essa mesa." });
        }

        const total = row.total.toFixed(2);

        db.run(
            "INSERT INTO Pagamentos (mesa_id, total, forma_pagamento, data) VALUES (?, ?, ?, datetime('now'))",
            [mesa, total, pagamento],
            function (err) {
                if (err) {
                    console.error("Erro ao registrar pagamento:", err);
                    return res.status(500).json({ mensagem: "Erro ao registrar pagamento." });
                }

                db.run("DELETE FROM Pedidos WHERE mesa_id = ?", [mesa], function (err) {
                    if (err) {
                        console.error("Erro ao limpar pedidos:", err);
                        return res.status(500).json({ mensagem: "Erro ao limpar pedidos." });
                    }
                    res.json({ mensagem: "Conta da Mesa ${mesa} fechada! Total: R$ ${total} pago em ${pagamento}. "});
                });
            }
        );
    });
});

// ✅ LOGIN SEGURO COM SENHA HASH
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos." });
    }

    db.get("SELECT * FROM Funcionarios WHERE usuario = ?", [usuario], (err, funcionario) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
        }

        if (!funcionario) {
            return res.json({ sucesso: false, mensagem: "Usuário ou senha incorretos." });
        }

        // 🔒 Comparar senha digitada com a senha hashada no banco
        bcrypt.compare(senha, funcionario.senha, (err, result) => {
            if (err) {
                console.error("Erro ao comparar senha:", err);
                return res.status(500).json({ sucesso: false, mensagem: "Erro ao validar senha." });
            }

            if (result) {
                res.json({ sucesso: true, mensagem: "Login bem-sucedido!" });
            } else {
                res.json({ sucesso: false, mensagem: "Usuário ou senha incorretos." });
            }
        });
    });
});

// ✅ CADASTRO SEGURO COM HASH DE SENHA
app.post('/cadastrar', async (req, res) => {
    const { nome, usuario, senha } = req.body;

    if (!nome || !usuario || !senha) {
        return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos." });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        db.run(
            "INSERT INTO Funcionarios (nome, usuario, senha) VALUES (?, ?, ?)",
            [nome, usuario, senhaHash],
            function (err) {
                if (err) {
                    console.error("Erro ao cadastrar usuário:", err);
                    return res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar usuário." });
                }
                res.json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
            }
        );
    } catch (error) {
        console.error("Erro ao processar senha:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao processar senha." });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor do restaurante rodando na porta ${PORT}!`);
});
