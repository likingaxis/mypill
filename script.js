document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const createAccountBtn = document.getElementById('create-account-btn');
    const resetLocalStorageBtn = document.getElementById('reset-localstorage-btn');
    const nomeInput = document.getElementById('nome');
    const passwordInput = document.getElementById('password');

    // Funzioni per la gestione degli utenti (sostituisci con la tua logica)
    function loginUser(username, password) {
        // Verifica le credenziali dell'utente 
        const utentiMemorizzati = JSON.parse(localStorage.getItem('utenti')) || [];
        const utente = utentiMemorizzati.find(u => u.nome === username && u.password === password);

        if (utente) {
            // Accesso riuscito
            alert('Benvenuto, ' + username + '!');
            window.location.href = 'calendar.html'; 
        } else {
            // Accesso fallito
            alert('Nome utente o password errati.');
        }
    }

    function createAccount(username, password) {
        // Verifica se l'utente esiste già
        const utentiMemorizzati = JSON.parse(localStorage.getItem('utenti')) || [];
        const utenteEsistente = utentiMemorizzati.find(u => u.nome === username);

        if (utenteEsistente) {
            alert('Nome utente già in uso. Scegli un altro nome.');
        } else {
            // Crea il nuovo account
            utentiMemorizzati.push({ nome: username, password: password });
            localStorage.setItem('utenti', JSON.stringify(utentiMemorizzati));
            alert('Account creato con successo!');
            nomeInput.value = '';
            passwordInput.value = '';
        }
    }

    // Gestisci il clic sul pulsante "Accedi"
    loginBtn.addEventListener('click', () => {
        const username = nomeInput.value;
        const password = passwordInput.value;
        loginUser(username, password);
    });

    // Gestisci il clic sul pulsante "Crea un account"
    createAccountBtn.addEventListener('click', () => {
        const username = nomeInput.value;
        const password = passwordInput.value;
        createAccount(username, password);
    });

    // Gestisci il clic sul pulsante "Reset LocalStorage"
    resetLocalStorageBtn.addEventListener('click', () => {
        localStorage.clear();
        alert('LocalStorage resettato!');
        // Puoi aggiungere qui un eventuale reindirizzamento o aggiornamento della pagina
    });
});
