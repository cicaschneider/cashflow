// ===================================================================
// 1. VARIÁVEIS E FUNÇÕES GLOBAIS DE SUPORTE (MODAL, TOAST, URL)
// ===================================================================

const BACKEND_URL = 'https://financas-pessoais-backend-0dbj.onrender.com';

window.closeModal = function() {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
};

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.classList.add('show'); }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); }, 300);
    }, 3000);
}

function createModal(title, message, type = 'info', onConfirm = null) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = `modal modal-${type}`;
    
    const modalContent = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" onclick="window.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            ${onConfirm ? 
                `<button class="btn btn-secondary" onclick="window.closeModal()">Cancelar</button>
                 <button class="btn btn-primary" id="confirm-action-btn">Confirmar</button>` :
                `<button class="btn btn-primary" onclick="window.closeModal()">OK</button>`
            }
        </div>
    `;
    
    modal.innerHTML = modalContent;
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    setTimeout(() => { modalOverlay.classList.add('show'); modal.classList.add('show'); }, 10);
    
    if (onConfirm) {
        document.getElementById('confirm-action-btn').onclick = async () => {
            await onConfirm(); 
            window.closeModal(); 
        };
    }
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            window.closeModal();
        }
    });
}

// ===================================================================
// 2. FUNÇÕES DE CARREGAMENTO E ATUALIZAÇÃO (LOAD/FETCH) - GLOBAIS
// ===================================================================

async function loadDashboard() {
    const dashboardContent = document.getElementById('dashboard-content');
    dashboardContent.innerHTML = 'Carregando dashboard...';
    try {
        const response = await fetch(`${BACKEND_URL}/dashboard`);
        const data = await response.json();
        if (data.message === 'success') {
            const { totalReceitas, totalDespesas, saldoAtual, metas } = data.data;
            
            // FILTRA AS METAS REMOVIDAS DA UI DO DASHBOARD
            const metasHtml = metas.length > 0 
                ? 'Metas removidas da visualização.' 
                : 'Nenhuma meta cadastrada.';

            dashboardContent.innerHTML = `
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Total de Receitas</h3>
                        <p>R$ ${totalReceitas.toFixed(2)}</p>
                    </div>
                    <div class="dashboard-card despesas">
                        <h3>Total de Despesas</h3>
                        <p>R$ ${totalDespesas.toFixed(2)}</p>
                    </div>
                    <div class="dashboard-card saldo">
                        <h3>Saldo Atual</h3>
                        <p>R$ ${saldoAtual.toFixed(2)}</p>
                    </div>
                    <div class="dashboard-card metas-summary" style="display: none;">
                        <h3>Metas Financeiras</h3>
                        <ul>
                           ${metasHtml}
                        </ul>
                    </div>
                </div>
            `;
        } else { dashboardContent.innerHTML = `<p>Erro ao carregar dashboard: ${data.error}</p>`; }
    } catch (error) { dashboardContent.innerHTML = `<p>Erro de conexão: ${error.message}</p>`; console.error('Erro ao carregar dashboard:', error); }
}

async function fetchReceitas() {
    const tabelaReceitasBody = document.querySelector('#tabela-receitas tbody');
    tabelaReceitasBody.innerHTML = '<tr><td colspan="5">Carregando receitas...</td></tr>';
    try {
        const response = await fetch(`${BACKEND_URL}/receitas`);
        const data = await response.json();
        if (data.message === 'success') {
            tabelaReceitasBody.innerHTML = '';
            data.data.forEach(receita => {
                const row = tabelaReceitasBody.insertRow();
                row.insertCell(0).textContent = receita.descricao;
                row.insertCell(1).textContent = `R$ ${receita.valor.toFixed(2)}`;
                row.insertCell(2).textContent = receita.data;
                row.insertCell(3).textContent = receita.categoria;
                const actionsCell = row.insertCell(4);
                actionsCell.innerHTML = `<button class="btn-delete" onclick="window.deleteReceita(${receita.id})">Excluir</button>`;
            });
        } else { tabelaReceitasBody.innerHTML = `<tr><td colspan="5">Erro ao carregar receitas: ${data.error}</td></tr>`; }
    } catch (error) { tabelaReceitasBody.innerHTML = `<tr><td colspan="5">Erro de conexão: ${error.message}</td></tr>`; console.error('Erro ao buscar receitas:', error); }
}

async function loadReceitas() {
    const receitasContent = document.getElementById('receitas-content');
    receitasContent.innerHTML = `
        <h3>Cadastrar Nova Receita</h3>
        <form id="form-receita">
            <div><label for="receita-descricao">Descrição:</label><input type="text" id="receita-descricao" required></div>
            <div><label for="receita-valor">Valor:</label><input type="number" id="receita-valor" step="0.01" required></div>
            <div><label for="receita-data">Data:</label><input type="date" id="receita-data" required></div>
            <div><label for="receita-categoria">Categoria:</label><input type="text" id="receita-categoria" required></div>
            <button type="submit">Adicionar Receita</button>
        </form>
        <h3>Histórico de Receitas</h3>
        <table id="tabela-receitas">
            <thead><tr><th>Descrição</th><th>Valor</th><th>Data</th><th>Categoria</th><th>Ações</th></tr></thead>
            <tbody></tbody>
        </table>
    `;

    const formReceita = document.getElementById('form-receita');
    formReceita.addEventListener('submit', async (e) => {
        e.preventDefault();
        const [descricao, valor, data, categoria] = ['receita-descricao', 'receita-valor', 'receita-data', 'receita-categoria'].map(id => document.getElementById(id).value);
        try {
            const response = await fetch(`${BACKEND_URL}/receitas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ descricao, valor: parseFloat(valor), data, categoria }) });
            const result = await response.json();
           if (result.message === 'success') {
                showToast('Receita adicionada com sucesso!', 'success');
                formReceita.reset();
                await fetchReceitas();
                await loadDashboard(); 
            } else { showToast(`Erro ao adicionar receita: ${result.error}`, 'error'); }
        } catch (error) { showToast(`Erro de conexão: ${error.message}`, 'error'); console.error('Erro ao adicionar receita:', error); }
    });

    await fetchReceitas();
}

async function fetchDespesas() {
    const tabelaDespesasBody = document.querySelector('#tabela-despesas tbody');
    tabelaDespesasBody.innerHTML = '<tr><td colspan="6">Carregando despesas...</td></tr>';
    try {
        const response = await fetch(`${BACKEND_URL}/despesas`);
        const data = await response.json();
        if (data.message === 'success') {
            tabelaDespesasBody.innerHTML = '';
            data.data.forEach(despesa => {
                const row = tabelaDespesasBody.insertRow();
                row.insertCell(0).textContent = despesa.descricao_original;
                row.insertCell(1).textContent = `${despesa.numero_parcela}/${despesa.total_parcelas}`;
                row.insertCell(2).textContent = `R$ ${despesa.valor.toFixed(2)}`;
                row.insertCell(3).textContent = despesa.data_vencimento;
                const statusCell = row.insertCell(4);
                statusCell.textContent = despesa.status;
                if (despesa.status === 'em aberto') {
                    statusCell.innerHTML += ` <button class="btn-mark-paid" onclick="window.markParcelaAsPaid(${despesa.id})">Pagar</button>`;
                }
                const actionsCell = row.insertCell(5);
                actionsCell.innerHTML = `<button class="btn-delete" onclick="window.deleteDespesa(${despesa.despesa_id})">Excluir Despesa</button>`;
            });
        } else { tabelaDespesasBody.innerHTML = `<tr><td colspan="6">Erro ao carregar despesas: ${data.error}</td></tr>`; }
    } catch (error) { tabelaDespesasBody.innerHTML = `<tr><td colspan="6">Erro de conexão: ${error.message}</td></tr>`; console.error('Erro ao buscar despesas:', error); }
}

async function loadDespesas() {
    const despesasContent = document.getElementById('despesas-content');
    despesasContent.innerHTML = `
        <h3>Cadastrar Nova Despesa</h3>
        <form id="form-despesa">
            <div><label for="despesa-descricao">Descrição:</label><input type="text" id="despesa-descricao" required></div>
            <div><label for="despesa-valor">Valor:</label><input type="number" id="despesa-valor" step="0.01" required></div>
            <div><label for="despesa-data">Data:</label><input type="date" id="despesa-data" required></div>
            <div><label for="despesa-categoria">Categoria:</label><input type="text" id="despesa-categoria" required></div>
            <div><label for="despesa-parcelada">Despesa Parcelada?</label><input type="checkbox" id="despesa-parcelada"></div>
            <div id="parcelas-fields" style="display: none;">
                <label for="despesa-parcelas-total">Total de Parcelas:</label><input type="number" id="despesa-parcelas-total" min="1" value="1">
                <label for="despesa-data-primeira-parcela">Data da 1ª Parcela:</label><input type="date" id="despesa-data-primeira-parcela">
            </div>
            <button type="submit">Adicionar Despesa</button>
        </form>
        <h3>Histórico de Despesas</h3>
        <table id="tabela-despesas">
            <thead><tr><th>Descrição</th><th>Parcela</th><th>Valor da Parcela</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody></tbody>
        </table>
    `;

    const formDespesa = document.getElementById('form-despesa');
    const despesaParceladaCheckbox = document.getElementById('despesa-parcelada');
    const parcelasFields = document.getElementById('parcelas-fields');

    despesaParceladaCheckbox.addEventListener('change', () => {
        parcelasFields.style.display = despesaParceladaCheckbox.checked ? 'block' : 'none';
    });

    formDespesa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const [descricao, valor, data, categoria, parcelas_total, data_primeira_parcela] = ['despesa-descricao', 'despesa-valor', 'despesa-data', 'despesa-categoria', 'despesa-parcelas-total', 'despesa-data-primeira-parcela'].map(id => document.getElementById(id).value);
        const parcelada = despesaParceladaCheckbox.checked ? 1 : 0;
        
        try {
            const response = await fetch(`${BACKEND_URL}/despesas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao, valor: parseFloat(valor), data, categoria, parcelada, parcelas_total, data_primeira_parcela })
            });
            const result = await response.json();
            if (result.message === 'success') {
                showToast('Despesa adicionada com sucesso!', 'success');
                formDespesa.reset();
                parcelasFields.style.display = 'none';
                await fetchDespesas();
                await loadDashboard();
            } else { showToast(`Erro ao adicionar despesa: ${result.error}`, 'error'); }
        } catch (error) { showToast(`Erro de conexão: ${error.message}`, 'error'); }
    });

    await fetchDespesas();
    await loadDashboard();
}

// ** FUNÇÕES DE METAS COMENTADAS/REMOVIDAS **

/*
async function fetchMetas() {
    // Código de busca de metas removido
    const metasCards = document.getElementById('metas-cards');
    metasCards.innerHTML = '<p>Funcionalidade de Metas desativada.</p>';
}

async function loadMetas() {
    const metasContent = document.getElementById('metas-content');
    metasContent.innerHTML = `
        <h3>Metas Financeiras</h3>
        <p>A funcionalidade de Metas foi desativada para manter a estabilidade do sistema.</p>
        <div id="metas-cards"></div>
    `;
    await fetchMetas(); // Chama a função que retorna mensagem de desativado
}
*/

// ===================================================================
// 3. FUNÇÕES DE AÇÃO CRUD (Chamadas pelo HTML/onlick)
//    Manter as referências, mas garantir que as funções de Metas não existam.
// ===================================================================

window.deleteReceita = async function(id) {
    createModal('Confirmar Exclusão', 'Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.', 'warning', async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/receitas/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.message === 'success') {
                showToast('Receita excluída com sucesso!', 'success');
                await fetchReceitas();
                await loadDashboard(); 
            } else { showToast(`Erro ao excluir receita: ${result.error}`, 'error'); }
        } catch (error) { showToast(`Erro de conexão: ${error.message}`, 'error'); }
    });
};

window.markParcelaAsPaid = async function(id) {
    createModal('Confirmar Pagamento', 'Tem certeza que deseja marcar esta parcela como paga?', 'info', async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/parcelas/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'paga' }) });
            const result = await response.json();
            if (result.message === 'success') {
                showToast("Parcela marcada como paga com sucesso!", "success");
                await fetchDespesas();
                await loadDashboard();
            } else { showToast(`Erro ao marcar parcela como paga: ${result.error}`, 'error'); }
        } catch (error) { showToast(`Erro de conexão: ${error.message}`, 'error'); }
    });
};

window.deleteDespesa = async function(id) {
    createModal('Confirmar Exclusão', 'Tem certeza que deseja excluir esta despesa?', 'warning', async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/despesas/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.message === 'success') {
                showToast('Despesa excluída com sucesso!', 'success');
                await fetchDespesas();
                await loadDashboard();
            } else { showToast(`Erro ao excluir despesa: ${result.error}`, 'error'); }
        } catch (error) { showToast(`Erro de conexão: ${error.message}`, 'error'); }
    });
};

// ***********************************************
// FUNÇÕES DE AÇÃO DE METAS COMENTADAS/REMOVIDAS
// ***********************************************

/*
window.deleteMeta = async function(id) {
    createModal('Confirmar Exclusão', 'Tem certeza que deseja excluir esta meta?', 'warning', async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/metas/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.message === 'success') {
                showToast('Meta excluída com sucesso!', 'success');
                await fetchMetas(); 
                await loadDashboard(); 
            } else { showToast(`Erro ao excluir meta: ${result.error}`, 'error'); }
        } catch (error) { showToast(`Erro de conexão: ${error.message}`, 'error'); }
    });
};

window.adicionarValorMeta = async function(event, metaId) {
    // Lógica removida
};
*/


// ===================================================================
// 4. LÓGICA DE NAVEGAÇÃO E INICIALIZAÇÃO
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // VARIÁVEIS DOM LOCAIS
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');

    async function loadContent(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                await loadDashboard();
                break;
            case 'receitas':
                await loadReceitas();
                break;
            case 'despesas':
                await loadDespesas();
                break;
            case 'metas':
                // REMOVIDO: A TELA METAS FOI REMOVIDA
                // await loadMetas(); 
                break;
            default:
                break;
        }
    }

    // Lógica de Navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);

            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Se tentar ir para #metas, não faz nada (ou mantém no dashboard)
            if (targetId !== 'metas') {
                document.getElementById(targetId).classList.add('active');
                loadContent(targetId);
            }
        });
    });

    // Carregar o dashboard por padrão ao carregar a página
    loadContent('dashboard');
});
