// Variaveis globais
const API_URL = "http://localhost:8080/transactions";
let totalBalance = 0
// Seletores do DOM
const ul = document.querySelector("#transaction-list")
const balanceTotal = document.querySelector("#balance")
const type = document.querySelector("#type")
const date = document.querySelector("#date") // Exibir data
const month = document.querySelector("#month-filter")
const year = document.querySelector("#year-filter")
const search = document.querySelector("#search")
// Funções

const loadYear = ()=>{ // Carregar anos 
    const selectYear = document.querySelector("#year-filter")
    let yearCurrenty = new Date().getFullYear()
    for(let i = 0; i<10 ; i++){
        let optionYear = document.createElement("option")
        optionYear.appendChild(document.createTextNode(yearCurrenty))
        optionYear.value = `${yearCurrenty}`
        selectYear.appendChild(optionYear)
        yearCurrenty -= 1
    }
}

const showDate = ()=>{ // Exibir a data na tela
    const dateCurrenty = new Date()
    const day = dateCurrenty.getDate()
    const month = dateCurrenty.getMonth() + 1 
    const year = dateCurrenty.getFullYear()
    date.textContent = `${day}/${month}/${year}`
}

// const loadTransactions = async ()=>{ // Carregar as transações já realizadas anteriormente. AO iniciar a página
//   try {
//     const res = await fetch(API_URL)
//     const data = await res.json()

//     data.forEach(t => {
//       createTransactionElement(t, t.description, t.value, t.type);
//       updateBalance(t.type === "INCOME" ? t.value : -t.value)
//     });
//   } catch (error) {
//       console.log("Erro ao carregar transações: ", error);
//   }
// }


const findByMonthYear = async (month, year)=>{ 
    totalBalance = 0
    try{

        const res = await fetch(`${API_URL}/date?month=${month}&year=${year}`)
        const data = await res.json()

        ul.innerHTML = ""
         
        balanceTotal.textContent = `R$ 0`

        data.forEach(t=>{
            createTransactionElement(t, t.description, t.value, t.type)
            updateBalance(t.type === "INCOME" ? t.value : -t.value)
        })
        if(ul.innerHTML == ""){
            ul.innerHTML = "Não há transações realizadas nesse periodo!"
        }
    }catch(error){
        console.log("Erro: ", error)
    }

}

// Busca dados apenas do tipo Receita / Despesa

const findByType = async (value,month,year)=>{
    totalBalance = 0
    try {
        const res = await fetch(`${API_URL}/search?type=${value}&month=${month}&year=${year}`)
        const data = await res.json()
        
        data.forEach(t => {
            createTransactionElement(t, t.description, t.value, t.type);
            updateBalance(t.type === "INCOME" ? t.value : -t.value)
        });
        if(ul.innerHTML == ""){
            ul.innerHTML = "Não há transações realizadas nesse periodo!"
        }
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
    <div class="valueDelete">
    <span>R$ ${amountValue}</span>
    <button class="delete">X</button>
    </div>
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

// Ao carregar a tela
document.addEventListener("DOMContentLoaded", ()=>{
    const monthCurrenty = new Date().getMonth() + 1
    const yearCurrenty = new Date().getFullYear()
    month.value = monthCurrenty
    year.value = yearCurrenty
    findByMonthYear(monthCurrenty,yearCurrenty)
    showDate()
    loadYear()

})

type.addEventListener("change", (event)=>{
    const typeValue = event.target.value
    ul.innerHTML = ""
    totalBalance = 0
    
    if(typeValue === "ALL"){
        findByMonthYear(month.value,year.value)
    }else{
        findByType(typeValue,month.value,year.value)
    }
})

month.addEventListener("change", (event)=>{
    const monthSelect = event.target.value
    const year = document.querySelector("#year-filter").value
    
    findByMonthYear(monthSelect,year)
})
year.addEventListener("change", (event)=>{
    const yearSelect = event.target.value
    const month = document.querySelector("#month-filter").value
    findByMonthYear(month,yearSelect)
})
search.addEventListener("input", (event)=>{
    let digitado = event.target.value
    console.log(digitado)
})