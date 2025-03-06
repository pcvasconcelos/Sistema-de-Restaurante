async function listarPedidos() {
    const mesaInput = document.getElementById("mesaInput");
    const mesaId = mesaInput.value.trim();

    if (!mesaId) {
        alert("Digite um número de mesa válido!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/pedidos/${mesaId}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();
        const tabela = document.getElementById("tabelaPedidos");
        const tbody = tabela.querySelector("tbody");
        tbody.innerHTML = ""; 

        if (!data.pedidos || data.pedidos.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4'>Nenhum pedido encontrado.</td></tr>";
            return;
        }

        data.pedidos.forEach(pedido => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.produto}</td>
                <td>${pedido.quantidade}</td>
                <td>R$ ${pedido.preco ? pedido.preco.toFixed(2).replace(".", ",") : "0,00"}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        document.getElementById("resultado").innerHTML = "<p>Erro ao buscar pedidos.</p>";
    }
}


async function adicionarPedido() {
    const mesaId = document.getElementById("novaMesa").value.trim();
    const produto = document.getElementById("novoProduto").value.trim();
    const quantidade = document.getElementById("novaQuantidade").value.trim();
    const preco = document.getElementById("novoPreco").value.trim();

    if (!mesaId || !produto || !quantidade || !preco) {
        document.getElementById("mensagemPedido").innerText = "Preencha todos os campos!";
        return;
    }

    const pedido = {
        mesa: Number(mesaId),
        produto,
        quantidade: Number(quantidade),
        preco: Number(preco)
    };

    try {
        const response = await fetch("http://localhost:4000/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        const data = await response.json();
        document.getElementById("mensagemPedido").innerText = data.mensagem || "Pedido adicionado com sucesso!";
    } catch (error) {
        console.error("Erro ao adicionar pedido:", error);
        document.getElementById("mensagemPedido").innerText = "Erro ao adicionar pedido.";
    }
}

async function fecharConta() {
    const mesaId = document.getElementById("mesaFechar").value.trim();
    const formaPagamento = document.getElementById("formaPagamento").value;

    if (!mesaId) {
        document.getElementById("mensagemFechamento").innerText = "Digite um número de mesa!";
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/fechar-conta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mesa: Number(mesaId), pagamento: formaPagamento })
        });

        const data = await response.json();
        document.getElementById("mensagemFechamento").innerText = data.mensagem || "Conta fechada com sucesso!";
    } catch (error) {
        console.error("Erro ao fechar conta:", error);
        document.getElementById("mensagemFechamento").innerText = "Erro ao fechar conta.";
    }
}

async function fazerLogin() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!usuario || !senha) {
        document.getElementById("mensagemLogin").innerText = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        const data = await response.json();

        if (data.sucesso) {
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("conteudoPrincipal").style.display = "block";
        } else {
            document.getElementById("mensagemLogin").innerText = "Usuário ou senha incorretos.";
        }
    } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        document.getElementById("mensagemLogin").innerText = "Erro ao conectar com o servidor.";
    }
}
async function cadastrarUsuario() {
    const nome = document.getElementById("nomeCadastro").value.trim();
    const usuario = document.getElementById("usuarioCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value.trim();

    if (!nome || !usuario || !senha) {
        document.getElementById("mensagemCadastro").innerText = "Preencha todos os campos!";
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/cadastrar", { // Porta corrigida para 4000
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, usuario, senha })
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("mensagemCadastro").innerText = data.mensagem;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        document.getElementById("mensagemCadastro").innerText = "Erro ao cadastrar usuário.";
    }
}
async function listarPedidos() {
    const mesaInput = document.getElementById("mesaInput");
    const mesaId = mesaInput.value.trim();

    if (!mesaId) {
        alert("Digite um número de mesa válido!");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/pedidos/${mesaId}"); // URL correta
        if (!response.ok) {
            throw new Error("Erro HTTP: ${response.status}");
        }

        const data = await response.json();
        const tabela = document.getElementById("tabelaPedidos");
        const tbody = tabela.querySelector("tbody");
        tbody.innerHTML = ""; // Limpa a tabela antes de adicionar novos pedidos

        if (!data.pedidos || data.pedidos.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4'>Nenhum pedido encontrado.</td></tr>";
            return;
        }

        data.pedidos.forEach((pedido) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.produto}</td>
                <td>${pedido.quantidade}</td>
                <td>R$ ${pedido.preco ? pedido.preco.toFixed(2).replace(".", ",") : "0,00"}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        document.getElementById("resultado").innerHTML = "<p>Erro ao buscar pedidos.</p>";
    }
}