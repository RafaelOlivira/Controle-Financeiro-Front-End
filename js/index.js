// ---------------------------
// Variáveis globais

// const { response } = require("express");

// ---------------------------
// let totalBalance = 0;
const API_URL = "http://localhost:8080/transactions";

// ---------------------------
// Seletores do DOM
// ---------------------------
const form = document.querySelector("#transactionForm");
const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const notification = document.querySelector("#notification")
 
// ---------------------------
// Funções auxiliares
// ---------------------------

// Define a data atual no campo "date"
const dataNow = () => {
  const today = new Date().toISOString().split("T")[0];
  date.value = today;
};

const showNotification = (message,type) =>{
  notification.textContent = message
  notification.classList.remove("hidden","success","error")
  notification.classList.add(type)

  setTimeout(()=>{
    notification.classList.add("hidden")
  },3000)
}

// ---------------------------
// Eventos
// ---------------------------

// Define data ao carregar página
document.addEventListener("DOMContentLoaded",(type)=>{
  dataNow()
  // loadTransactions()
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

    // Resetar formulário
    description.value = ""
    amount.value = ""
    dataNow();
    showNotification("Transação realizada com sucesso!","successe")
  } catch (err) {
    showNotification("Falha ao realizar a transação!","error")
    console.log("Erro: Não foi possível realizar a transação ", err);
  }
});

// Ao trocar o valor de receita para despesa ou vice e versa

type.addEventListener("change", (event)=>{
  typeValue = event.target
  typeValue.classList.toggle("expenseTextColorType")
})

