// ---------------------------
// Variáveis globais

// const { response } = require("express");

// ---------------------------
let totalBalance = 0;
const API_URL = "http://localhost:8080/transactions";

// ---------------------------
// Seletores do DOM
// ---------------------------
const form = document.querySelector("#transactionForm");
const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const transactionList = document.querySelector("#transaction-list");
const balance = document.querySelector("#balance");

// ---------------------------
// Funções auxiliares
// ---------------------------

// Define a data atual no campo "date"
const dataNow = () => {
  const today = new Date().toISOString().split("T")[0];
  date.value = today;
};


const loadTransactions = async ()=>{ // Carregar as transações já realizadas anteriormente. AO iniciar a página
  try {
    const res = await fetch(API_URL)
    const data = await res.json()
    data.forEach(t => {
      createTransactionElement(t, t.description, t.value, t.type);
      updateBalance(t.type === "INCOME" ? t.value : -t.value);
    });
  } catch (error) {
      console.log("Erro ao carregar transações: ", error);
  }
}

// Atualiza o saldo na tela
const updateBalance = (value) => {
  totalBalance += Number(value);
  const totalBalanceFormatada = Intl.NumberFormat("pt-br",{
    style:"currency",
    currency:"BRL"
  }).format(totalBalance)
  balance.textContent = `${totalBalanceFormatada}`;

  // Define cor conforme positivo/negativo
  balance.classList.remove("income-text", "expense-text");
  if (totalBalance >= 0) {
    balance.classList.add("income-text");
  } else {
    balance.classList.add("expense-text");
  }
};


 

// Cria elemento de transação na lista
const createTransactionElement = (data, descValue, amountValue, typeValue) => {

  const li = document.createElement("li");
  li.classList.add("transaction");
  li.dataset.id = data.id;

  // Define classe conforme tipo
  li.classList.add(typeValue === "INCOME" ? "income" : "expense");

  // Conteúdo da transação
  li.innerHTML = `
    <span>${descValue}</span>
    <span>R$ ${amountValue}</span>
    <button class="delete">X</button>
  `;

  // Botão de exclusão
  const deleteBtn = li.querySelector(".delete");
  deleteBtn.addEventListener("click", async () => {
    const decisao = confirm("Deseja realmente excluir?");
    if (!decisao) return;

    try {
      await fetch(`${API_URL}/${li.dataset.id}`, { method: "DELETE" });

      // Ajusta saldo ao excluir
      const value = Number(amountValue);
      updateBalance(typeValue === "INCOME" ? -value : value);

      li.remove();
    } catch (err) {
      console.log("Erro ao excluir: " + err);
    }
  });

  transactionList.appendChild(li);
};

// ---------------------------
// Eventos
// ---------------------------

// Define data ao carregar página
document.addEventListener("DOMContentLoaded",(type)=>{
  dataNow(),
  loadTransactions()
})

// Submissão do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Validação
  if (description.value.trim() === "" || amount.value === "") {
    alert("Preencha todos os campos!");
    form.reset();
    dataNow();
    return;
  }

  // Dados da transação
  const transaction = {
    description: description.value,
    value: Number(amount.value),
    type: type.value,
    date: date.value,
  };

  try {
    // Envia para API
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });

    const data = await res.json();
    console.log("Criado: ", data);

    // Cria elemento na lista
    createTransactionElement(data, description.value, amount.value, type.value);

    // Atualiza saldo
    const value = Number(amount.value);
    updateBalance(type.value === "INCOME" ? value : -value);

    // Resetar formulário
    description.value = ""
    amount.value = ""
    dataNow();
  } catch (err) {
    console.log("Erro: Não foi possível realizar a transação ", err);
  }
});

// Ao trocar o valor de receita para despesa ou vice e versa

type.addEventListener("change", (event)=>{
  typeValue = event.target
  typeValue.classList.toggle("expenseTextColorType")
})