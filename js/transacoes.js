// Variaveis globais
const API_URL = "http://localhost:8080/transactions";
let totalBalance = 0
// Seletores do DOM
const ul = document.querySelector("#transaction-list")
const balanceTotal = document.querySelector("#balance")
const type = document.querySelector("#type")

// Funções

const loadTransactions = async ()=>{ // Carregar as transações já realizadas anteriormente. AO iniciar a página
  try {
    const res = await fetch(API_URL)
    const data = await res.json()
    console.log(data)
    data.forEach(t => {
      createTransactionElement(t, t.description, t.value, t.type);
      updateBalance(t.type === "INCOME" ? t.value : -t.value)
    });
  } catch (error) {
      console.log("Erro ao carregar transações: ", error);
  }
}

// Busca dados apenas do tipo Receita / INCOME

const fetchIncome = async (value)=>{
    try {
        const res = await fetch(`${API_URL}/type/${value}`)
        const data = await res.json()
 
        data.forEach(t => {
            createTransactionElement(t, t.description, t.value, t.type);
            updateBalance(t.type === "INCOME" ? t.value : -t.value)
        });
        console.log(data)
    } catch (error) {
        console.log("Erro ao carregar transações: ", error);
    }
}


// Busca dados apenas do tipo Despesa / EXPENSE

const fetchExpense = async (value)=>{
    try {
        const res = await fetch(`${API_URL}/type/${value}`)
        const data = await res.json()
 
        data.forEach(t => {
            createTransactionElement(t, t.description, t.value, t.type);
            updateBalance(t.type === "INCOME" ? t.value : -t.value)
        });
        console.log(data)
    } catch (error) {
        console.log("Erro ao carregar transações: ", error);
    }
}

// Atualizar valor total da conta
const updateBalance = (value)=>{
    totalBalance += Number(value)
    
    const totalBalanceFormatada = new Intl.NumberFormat('pt-br',{
        style:'currency',
        currency:'BRL'
    }).format(totalBalance)
   
    balanceTotal.textContent = `${totalBalanceFormatada}`

    balanceTotal.classList.remove("income-text","expense-text")
    if(totalBalance >= 0){
        balanceTotal.classList.add("income-text")
    }else{
        balanceTotal.classList.add("expense-text")
    }
}


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
    
      const value = Number(amountValue)
      updateBalance(typeValue === "INCOME" ? -value : value)

      li.remove();
    } catch (err) {
      console.log("Erro ao excluir: " + err);
    }
  });

  ul.appendChild(li);
};

// Eventos

const reload = (typeValue)=>{
    document.addEventListener("DOMContentLoaded", ()=>{
    console.log(typeValue)
    if(typeValue == "INCOME"){
        fetchIncome(typeValue)
    }else if(typeValue == "EXPENSE"){
        fetchExpense(typeValue)
    }else{
        loadTransactions()
    }
})
}
reload()
type.addEventListener("change", (event)=>{
    typeValue = event.target.value
    // if(typeValue == "ALL"){
    //     window.location.reload()
    //     return
    // }
    reload(typeValue)
})