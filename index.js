import { lancerConfettis } from './confetti.js';

var pokemonsListFile = "https://theoneveu.github.io/CirmonTCG/pokemonList.json";
var request = new XMLHttpRequest();
request.open("GET", pokemonsListFile);
request.responseType = "json";
request.send();

var pokemonsList;
var pokemonTarget;
var isSearchBarLocked = false;

request.onload = function () {
    pokemonsList = request.response;
    initialiserJeu();
};

function initialiserJeu() {
    pokemonTarget = Math.floor(Math.random() * pokemonsList.length);
    
    document.getElementById("SearchBar").addEventListener('keyup', function(e) {
        let nameSearch = this.value.toLowerCase();
        ajouterResultat(nameSearch);
    });

    document.getElementById("SearchBar").addEventListener('focusin', () => {
        if (isSearchBarLocked) document.getElementById("SearchBar").blur();
        else expandDiv(document.getElementById("SearchResults"));
    });

    document.getElementById("SearchBar").addEventListener('focusout', () => {
        setTimeout(() => {
            if(document.activeElement != document.getElementById("SearchBar")) shrinkDiv(document.getElementById("SearchResults"));
        }, 100);
    });

    document.getElementById("solution").onclick = () => {
        ajouterLigne(pokemonTarget, pokemonTarget);
        console.log("Show Solution");
        isSearchBarLocked = true;
    }

    document.getElementById("restart").onclick = () => {
        const trylist = document.getElementById("trylist");
        while (trylist.firstChild) {
            trylist.removeChild(trylist.firstChild);
        }
        console.log("Start New Game");
        pokemonTarget = Math.floor(Math.random() * pokemonsList.length);
        pokemonsList.forEach(element => element.checked = false);
        isSearchBarLocked = false;
    }
}

function ajouterLigne(pokemonTarget, pokemonGuess) {
    const trylist = document.getElementById("trylist");

    document.getElementById("SearchBar").value = "";
    const resultList = document.getElementById("SearchResults");
    while(resultList.firstChild){
        resultList.removeChild(resultList.firstChild);
    }

    const newRow = document.createElement("div");
    newRow.classList.add("row");

    const pokemon = pokemonsList[pokemonGuess];

    const infos = [
        pokemon.types[0], 
        pokemon.types[1] || "Aucun", 
        pokemon.evolution, 
        pokemon.couleur, 
        pokemon.taille, 
        pokemon.poids, 
        pokemon.generation, 
    ];

    const targetinfos = [
        pokemonsList[pokemonTarget].types[0], 
        pokemonsList[pokemonTarget].types[1] || "Aucun", 
        pokemonsList[pokemonTarget].evolution, 
        pokemonsList[pokemonTarget].couleur, 
        pokemonsList[pokemonTarget].taille, 
        pokemonsList[pokemonTarget].poids, 
        pokemonsList[pokemonTarget].generation, 
    ];

    for (let i = 0; i < 8; i++) {
        const square = document.createElement("div");
        square.classList.add("square");

        const squareInner = document.createElement("div");
        squareInner.classList.add("square-inner");

        const front = document.createElement("div");
        front.classList.add("square-front");
        const back = document.createElement("div");
        back.classList.add("square-back");

        if (i == 0) {
            const imgTry = document.createElement("img");
            imgTry.id = "pokemonSprite";
            imgTry.src = 'https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/' + pokemon.nomAnglais + '.avif';
            imgTry.alt = pokemon.nom;
            back.appendChild(imgTry);
        } else {
            back.textContent = infos[i - 1]; 
            back.style.backgroundColor = (infos[i - 1] == targetinfos[i - 1]) ? "green" : '#C60C30';
            if((i==5 || i==6) && infos[i - 1] != targetinfos[i - 1]){
                const arrow = document.createElement("img");
                arrow.src = "arrow.png";
                arrow.classList.add("arrow");
                arrow.style.rotate = (infos[i - 1] < targetinfos[i - 1]) ? "180deg" : "0deg";
                back.appendChild(arrow);
            }
        }

        front.style.backgroundImage = "url('carte.png')";
        front.style.backgroundSize = "cover";

        squareInner.appendChild(front);
        squareInner.appendChild(back);
        square.appendChild(squareInner);
        newRow.appendChild(square);

        setTimeout(() => {
            squareInner.style.transform = "rotateY(180deg)";
        }, 50 + i * 300);
    }

    trylist.insertBefore(newRow, trylist.firstChild);
    pokemonsList[pokemonGuess].checked = true;
    ajouterResultat(document.getElementById("SearchBar").value.toLowerCase());
    if(pokemonTarget == pokemonGuess){
        setTimeout(() => {lancerConfettis();}, 2800);
        isSearchBarLocked = true;
    }
    else {
        setTimeout(() => {document.getElementById("SearchBar").focus();}, 2800);
    } 

    
}

function ajouterResultat(pokemonNameSearch) {
    const resultList = document.getElementById("SearchResults");
    
    while(resultList.firstChild){
        resultList.removeChild(resultList.firstChild);
    }

    pokemonsList.forEach(element => {
        if (element.nom.toLowerCase().includes(pokemonNameSearch)) {
            const newResult = document.createElement("button");
            newResult.classList.add("result");
            if(!element.checked){
                newResult.onclick = () => {
                    ajouterLigne(pokemonTarget, element.id - 1);
                    console.log("Guessed " + element.nom);
                }
            }
            else{
                newResult.style.color = 'grey';
                newResult.onclick = () => {
                    document.getElementById("SearchBar").focus();
                }
            }

            newResult.textContent = ""+element.id+". "+element.nom;
            resultList.appendChild(newResult); 
        }
    });
}

function shrinkDiv(element) {
    element.classList.remove('expand');
    setTimeout(() => {
        element.classList.add('shrink'); 
    }, 10);
    setTimeout(() => {
        element.style.display = 'none';
    }, 500);
}

function expandDiv(element) {
    element.style.display = 'block';
    setTimeout(() => {
        element.classList.remove('shrink');
        element.classList.add('expand');
    }, 50);
}
