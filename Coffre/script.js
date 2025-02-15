document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("dataTable");
    const select = document.getElementById("selectItems");
    const form = document.getElementById("stockForm");
    const result = document.getElementById("result");

    let stockData = JSON.parse(localStorage.getItem("stockData")) || [];

    // Fonction pour afficher le stock dans le tableau
    function afficherStock() {
        // Supprimer les anciennes lignes sauf l'en-tête
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        stockData.forEach((item, index) => {
            let row = table.insertRow();
            let cellProduit = row.insertCell(0);
            let cellMaison = row.insertCell(1);
            let cellHangar = row.insertCell(2);
            let cellAction = row.insertCell(3);

            cellProduit.textContent = item.produit;

            // Remplir les colonnes en fonction de la localisation
            if (item.localisation === "Maison") {
                cellMaison.textContent = `${item.quantite} `;
            } else if (item.localisation === "Hangar Miror Park") {
                cellHangar.textContent = `${item.quantite} `;
            }

            cellAction.innerHTML = `<button onclick="supprimerStock(${index})">❌</button>`;
        });
    }

    // Remplir le sélecteur avec les produits du tableau
    for (let i = 1; i < table.rows.length; i++) {
        let cell = table.rows[i].cells[0];
        if (cell) {
            let option = document.createElement("option");
            option.value = cell.id;
            option.textContent = cell.textContent;
            select.appendChild(option);
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let produit = select.options[select.selectedIndex].text;
        let localisation = document.getElementById("localisation").value;
        let action = document.getElementById("choix").value;
        let quantite = document.getElementById("quantite").value;

        if (!produit || !localisation || !action || quantite <= 0) {
            alert("Veuillez remplir tous les champs correctement !");
            return;
        }

        // Vérifier si le produit existe déjà
        let indexProduit = stockData.findIndex(item => item.produit === produit && item.localisation === localisation);
        
        if (indexProduit !== -1) {
            if (action === "Retirer") {
                // Si l'action est "Retirer", vérifier si la quantité est suffisante
                let nouvelleQuantite = parseInt(stockData[indexProduit].quantite) - parseInt(quantite);
                if (nouvelleQuantite < 0) {
                    alert("La quantité ne peut pas être inférieure à 0 !");
                    return;
                }
                stockData[indexProduit].quantite = nouvelleQuantite;
    
            }else{
                stockData[indexProduit].quantite = parseInt(stockData[indexProduit].quantite) + parseInt(quantite);

            }
            stockData[indexProduit].action = action;
        } else {
            // Ajouter un nouveau produit
            let nouvelleAction = {
                date: new Date().toLocaleString(),
                produit: produit,
                localisation: localisation,
                action: action,
                quantite: quantite
            };
            stockData.push(nouvelleAction);
        }

        localStorage.setItem("stockData", JSON.stringify(stockData));
        afficherStock();
    });

    // Fonction pour supprimer un élément du tableau et du stockage
    window.supprimerStock = function (index) {
        stockData.splice(index, 1);
        localStorage.setItem("stockData", JSON.stringify(stockData));
        afficherStock();
    };

    afficherStock();
});
