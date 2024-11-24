//script chatgpt.html

function generaCampi() {
    let num = parseInt(document.getElementById('num_alcolici').value);
    if (isNaN(num) || num <= 0) {
        alert("Inserisci un numero valido.");
        return;
    }
    let container = document.getElementById('campi');
    container.innerHTML = ""; // Pulisce i campi precedenti
    for (let i = 0; i < num; i++) {
        container.innerHTML += ` <div>
                <label>Alcolico ${i + 1} (ml): </label>
                <input type="number" id="ml_alcol${i}" min="0" required>
                <label>Gradazione: </label>
                <input type="number" id="perc_alcol${i}" min="0" max="100" required><br>
            </div> `;
    }
    container.innerHTML += ` <div>
            <label>Diluente (ml): </label>
            <input type="number" id="ml_diluente" min="0" required>
        </div>
        <div> 
            <label for="ghiaccio"> Ghiaccio: </label>
            <select id="ghiaccio" name="ghiaccio">
                <option value=1.3> Si </option>
                <option value=1> No </option>
            </select> 
        </div>
        <button onclick="calcolaGradazione(${num})">Calcola</button> 
        <div>
            <label>Gradazione alcolica totale: </label>
            <input readonly id="gradazione_tot">
        </div> 
        <div>
        <button onclick="go2index()">Calcola il tasso alcolemico</button>
        </div> `;
}

function calcolaGradazione(num) {
    let ml_alcol= [];
    let ml_alcol_tot = 0;
    let grad = []; 
    let gradazioneTot = 0;
    let diluente = parseFloat(document.getElementById('ml_diluente').value) || 0;
    let ghiaccio = parseFloat(document.getElementById('ghiaccio').value);
    
    //recupera i valori inseriti dall'utente e calcola la somma di tutti
    for (let i = 0; i < num; i++) {
        ml_alcol[i] = parseFloat(document.getElementById(`ml_alcol${i}`).value) || 0;
        grad[i] = parseFloat(document.getElementById(`perc_alcol${i}`).value) || 0;
        ml_alcol_tot += ml_alcol[i];
    }
    //calcola  la gradazione finale
    for (i = 0; i < num; i++) {
        gradazioneTot += (ml_alcol[i] * grad[i]) / ((ml_alcol_tot + diluente) * ghiaccio);
    }
    document.getElementById(`gradazione_tot`).value = gradazioneTot.toFixed(1) + "%" //toFixed fa diventare il numero una stringa
}

function go2index() {
    // Recupera i valori richiesti
    let gradazioneTot = parseFloat(document.getElementById('gradazione_tot').value) || 0;
    let diluente = parseFloat(document.getElementById('ml_diluente').value) || 0;

    // Recupera il numero di alcolici
    let num = parseInt(document.getElementById('num_alcolici').value) || 0;

    // Inizializza le variabili per calcoli
    let ml_alcol = [];
    let ml_alcol_tot = 0;

    // Controlla e somma i valori degli alcolici
    for (let i = 0; i < num; i++) {
        ml_alcol[i] = parseFloat(document.getElementById(`ml_alcol${i}`).value) || 0;
        ml_alcol_tot += ml_alcol[i];
    }

    // Verifica che i dati siano validi
    if (isNaN(gradazioneTot) || gradazioneTot === 0 || ml_alcol_tot === 0 || isNaN(diluente)) {
        alert("Inserisci tutti i dati richiesti prima di procedere.");
        return;
    }

    // Passa i dati come parametri nell'URL
    let url = `index.html?gradazioneTot=${gradazioneTot}&ml_alcol_tot=${ml_alcol_tot}&diluente=${diluente}`;
    window.location.href = url;
}

//script prova3.html

function leggiParametri() {
    const urlParams = new URLSearchParams(window.location.search);
    const gradazioneTot = parseFloat(urlParams.get('gradazioneTot'));
    const ml_alcol_tot = parseFloat(urlParams.get('ml_alcol_tot'));
    const diluente = parseFloat(urlParams.get('diluente'));

    // Usa i parametri come preferisci
    if(!isNaN(gradazioneTot)) {
        document.getElementById("perc_alcol").value = gradazioneTot;
        let V_tot = ml_alcol_tot + diluente
        document.getElementById("ml").value = V_tot;
    }
}

// Chiama la funzione al caricamento della pagina
window.onload = leggiParametri;

function go2gradalcol() {
    window.location.href = "grad_alcol.html";
}

function tasso() {
    // Recupero dei valori degli input
    let peso = parseFloat(document.getElementById("peso").value);
    let gradazione = parseFloat(document.getElementById("perc_alcol").value);
    let volume = parseFloat(document.getElementById("ml").value);
    let litri = 1000;
    const grammi = 8;
    let sesso = (document.getElementById("sesso").value == "uomo");
    let stomaco = (document.getElementById("stomaco").value == "full");
    let indice_cibo;
    let tasso_alcolemico;
    
    //controllo validità dati inseriti
    if(isNaN(gradazione) || isNaN(volume) || isNaN(peso)){
        alert("Inserisci dei valori prima di procedere con il calcolo");
        return;
    }
    if(gradazione < 0 || gradazione > 100 ) {
        alert("Inserisci una gradazione valida (tra 0 e 100)");
        return;
    }

    // Calcola l'indice in base al sesso e allo stomaco
    if (sesso) {
        indice_cibo = stomaco ? 1.2 : 0.7; // Uomo
    } else {
        indice_cibo = stomaco ? 0.9 : 0.5; // Donna
    }

    // Calcola il tasso alcolemico
    tasso_alcolemico = ((gradazione * grammi) * (volume / litri)) / (peso * indice_cibo);
    
    // Stampa il risultato nel campo di output
    document.getElementById("tasso_alcolemico").value = tasso_alcolemico.toFixed(2) + "%";
}
