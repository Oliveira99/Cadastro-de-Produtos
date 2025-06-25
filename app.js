// Recupera ou inicializa os dados no localStorage
const fornecedores = JSON.parse(localStorage.getItem("fornecedores")) || [];
const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
const associacoes = JSON.parse(localStorage.getItem("associacoes")) || {}; // {codigoProduto: [cnpj1, cnpj2]}

const mensagemFornecedor = document.getElementById("mensagemFornecedor");
const mensagemProduto = document.getElementById("mensagemProduto");
const mensagemAssociacao = document.getElementById("mensagemAssociacao");
const mensagemDados = document.getElementById("mensagemDados");

const fornecedorSelect = document.getElementById("fornecedorSelect");
const produtoSelect = document.getElementById("produtoSelect");
const fornecedoresAssociados = document.getElementById("fornecedoresAssociados");

// Função para salvar dados no localStorage
function salvarDados() {
  localStorage.setItem("fornecedores", JSON.stringify(fornecedores));
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("associacoes", JSON.stringify(associacoes));
}

// Cadastro de fornecedor
function cadastrarFornecedor() {
  mensagemFornecedor.innerHTML = "";
  const nome = document.getElementById("nomeFornecedor").value.trim();
  const cnpj = document.getElementById("cnpjFornecedor").value.trim();
  const endereco = document.getElementById("enderecoFornecedor").value.trim();
  const telefone = document.getElementById("telefoneFornecedor").value.trim();
  const email = document.getElementById("emailFornecedor").value.trim();
  const contato = document.getElementById("contatoFornecedor").value.trim();

  if (!nome || !cnpj || !endereco || !telefone || !email || !contato) {
    mensagemFornecedor.innerHTML = '<p class="error">Preencha todos os campos obrigatórios.</p>';
    return;
  }
  if (fornecedores.find(f => f.cnpj === cnpj)) {
    mensagemFornecedor.innerHTML = '<p class="error">Fornecedor com esse CNPJ já está cadastrado!</p>';
    return;
  }

  fornecedores.push({ nome, cnpj, endereco, telefone, email, contato });
  salvarDados();
  mensagemFornecedor.innerHTML = '<p class="success">Fornecedor cadastrado com sucesso!</p>';
  atualizarDropdowns();
  limparCamposFornecedor();
}

// Cadastro de produto
function cadastrarProduto() {
  mensagemProduto.innerHTML = "";
  const nome = document.getElementById("nomeProduto").value.trim();
  const codigo = document.getElementById("codigoProduto").value.trim();
  const descricao = document.getElementById("descricaoProduto").value.trim();
  const quantidade = document.getElementById("quantidadeProduto").value.trim();
  const categoria = document.getElementById("categoriaProduto").value;

  if (!nome || !descricao || !categoria) {
    mensagemProduto.innerHTML = '<p class="error">Preencha todos os campos obrigatórios.</p>';
    return;
  }
  if (produtos.find(p => p.codigo === codigo)) {
    mensagemProduto.innerHTML = '<p class="error">Produto com este código de barras já está cadastrado!</p>';
    return;
  }

  produtos.push({ nome, codigo, descricao, quantidade, categoria });
  if (!associacoes[codigo]) associacoes[codigo] = [];
  salvarDados();
  mensagemProduto.innerHTML = '<p class="success">Produto cadastrado com sucesso!</p>';
  atualizarDropdowns();
  limparCamposProduto();
}

// Atualiza dropdowns da associação
function atualizarDropdowns() {
  fornecedorSelect.innerHTML = fornecedores.map(f => `<option value="${f.cnpj}">${f.nome}</option>`).join("");
  produtoSelect.innerHTML = produtos.map(p => `<option value="${p.codigo}">${p.nome}</option>`).join("");
  // Atualiza lista associados para o produto selecionado
  if (produtoSelect.value) {
    atualizarListaAssociados(produtoSelect.value);
  } else if (produtos.length > 0) {
    atualizarListaAssociados(produtos[0].codigo);
  } else {
    fornecedoresAssociados.innerHTML = "";
  }
}

// Associa fornecedor a produto
function associarFornecedor() {
  mensagemAssociacao.innerHTML = "";
  const produtoCodigo = produtoSelect.value;
  const fornecedorCNPJ = fornecedorSelect.value;
  if (!produtoCodigo || !fornecedorCNPJ) {
    mensagemAssociacao.innerHTML = '<p class="error">Selecione um produto e um fornecedor.</p>';
    return;
  }
  if (associacoes[produtoCodigo]?.includes(fornecedorCNPJ)) {
    mensagemAssociacao.innerHTML = '<p class="error">Fornecedor já está associado a este produto!</p>';
    return;
  }
  associacoes[produtoCodigo].push(fornecedorCNPJ);
  salvarDados();
  mensagemAssociacao.innerHTML = '<p class="success">Fornecedor associado com sucesso ao produto!</p>';
  atualizarListaAssociados(produtoCodigo);
}

// Atualiza lista de fornecedores associados ao produto selecionado
function atualizarListaAssociados(produtoCodigo) {
  fornecedoresAssociados.innerHTML = "";
  (associacoes[produtoCodigo] || []).forEach(cnpj => {
    const fornecedor = fornecedores.find(f => f.cnpj === cnpj);
    if (fornecedor) {
      const li = document.createElement("li");
      li.innerHTML = `${fornecedor.nome} (${cnpj}) <button onclick="desassociarFornecedor('${produtoCodigo}', '${cnpj}')">Desassociar</button>`;
      fornecedoresAssociados.appendChild(li);
    }
  });
}

// Desassocia fornecedor do produto
function desassociarFornecedor(produtoCodigo, cnpj) {
  associacoes[produtoCodigo] = associacoes[produtoCodigo].filter(f => f !== cnpj);
  salvarDados();
  mensagemAssociacao.innerHTML = '<p class="success">Fornecedor desassociado com sucesso!</p>';
  atualizarListaAssociados(produtoCodigo);
}

// Limpa os campos do formulário fornecedor
function limparCamposFornecedor() {
  document.getElementById("nomeFornecedor").value = "";
  document.getElementById("cnpjFornecedor").value = "";
  document.getElementById("enderecoFornecedor").value = "";
  document.getElementById("telefoneFornecedor").value = "";
  document.getElementById("emailFornecedor").value = "";
  document.getElementById("contatoFornecedor").value = "";
}

// Limpa os campos do formulário produto
function limparCamposProduto() {
  document.getElementById("nomeProduto").value = "";
  document.getElementById("codigoProduto").value = "";
  document.getElementById("descricaoProduto").value = "";
  document.getElementById("quantidadeProduto").value = "";
  document.getElementById("categoriaProduto").value = "";
  document.getElementById("validadeProduto").value = "";
  document.getElementById("imagemProduto").value = "";
}

// Exporta dados como JSON e inicia download
function exportarDados() {
  const data = {
    fornecedores,
    produtos,
    associacoes
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dados_cadastro.json";
  a.click();
  URL.revokeObjectURL(url);
  mensagemDados.innerHTML = '<p class="success">Dados exportados com sucesso!</p>';
}

// Importa dados do arquivo JSON selecionado
function importarDados(event) {
  mensagemDados.innerHTML = "";
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);

      if (
        !data.fornecedores || !data.produtos || !data.associacoes ||
        !Array.isArray(data.fornecedores) || !Array.isArray(data.produtos) || typeof data.associacoes !== "object"
      ) {
        throw new Error("Formato inválido do arquivo JSON.");
      }

      // Substituir dados atuais
      fornecedores.length = 0;
      fornecedores.push(...data.fornecedores);

      produtos.length = 0;
      produtos.push(...data.produtos);

      Object.keys(associacoes).forEach(k => delete associacoes[k]);
      Object.assign(associacoes, data.associacoes);

      salvarDados();
      atualizarDropdowns();
      mensagemDados.innerHTML = '<p class="success">Dados importados com sucesso!</p>';
    } catch (err) {
      mensagemDados.innerHTML = `<p class="error">Erro ao importar dados: ${err.message}</p>`;
    }
  };
  reader.readAsText(file);

  // Limpar o input para poder importar o mesmo arquivo novamente se quiser
  event.target.value = "";
}

// Limpa o banco local (localStorage)
function limparBancoLocal() {
  if (!confirm("Tem certeza que deseja limpar todos os dados armazenados? Esta ação é irreversível.")) return;

  fornecedores.length = 0;
  produtos.length = 0;
  Object.keys(associacoes).forEach(k => delete associacoes[k]);

  salvarDados();
  atualizarDropdowns();
  mensagemDados.innerHTML = '<p class="success">Banco local limpo com sucesso!</p>';
}

// Eventos dos botões
document.getElementById("btnCadastrarFornecedor").addEventListener("click", cadastrarFornecedor);
document.getElementById("btnCadastrarProduto").addEventListener("click", cadastrarProduto);
document.getElementById("btnAssociarFornecedor").addEventListener("click", associarFornecedor);
document.getElementById("btnExportarDados").addEventListener("click", exportarDados);
document.getElementById("btnImportarDados").addEventListener("click", () => document.getElementById("inputImportarDados").click());
document.getElementById("inputImportarDados").addEventListener("change", importarDados);
document.getElementById("btnLimparDados").addEventListener("click", limparBancoLocal);

// Atualiza lista ao mudar o produto selecionado
produtoSelect.addEventListener("change", () => {
  atualizarListaAssociados(produtoSelect.value);
});

// Inicialização da página
atualizarDropdowns();
if (produtos.length > 0) atualizarListaAssociados(produtos[0].codigo);
