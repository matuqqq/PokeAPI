const listapokemon = document.querySelector("#lista-pokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const searchInputPokemon = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const todos = document.getElementById("todospi");
const btnatras = document.getElementById("atras");
const btnadelante = document.getElementById("adelante");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const wiki = "https://www.wikidex.net/wiki/";
let cantpokemon = 1025;
let pag = 0;
let pokemini = 1;
let pokemaxi = 20;
let pokemonDataLoaded = false;
let pokemonData = [];
let tipoFiltroActual = null;

// Hacer las solicitudes a la API y almacenar los datos de los Pokémon
for (let i = pokemini; i <= 1025; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => {
            pokemonData.push(data);
            if (pokemonData.length === cantpokemon) {
                pokemonDataLoaded = true; // Marcar como cargados todos los datos
                mostrarPokemonListprimeravez(); // Llamar a la función para mostrar la lista de Pokémon
            }
        })
        .catch(error => console.error("Error fetching Pokémon:", error));
}

// Event listener para el input de búsqueda
searchInputPokemon.addEventListener('input', async (event) => {
    const term = event.target.value.trim().toLowerCase();

    // Limpiar el contenedor de resultados
    resultsContainer.innerHTML = "";

    // Si el término de búsqueda está vacío, no hacer nada
    if (term === "") {
        return;
    }

    // Filtrar los Pokémon según el término de búsqueda
    const filteredPokemon = pokemonData.filter(pokemon => pokemon.name.toLowerCase().startsWith(term));
    if (filteredPokemon.length > 0) {
        filteredPokemon.forEach(pokemon => {
            mostrarPokemonEnResultados(pokemon);
        });
    }
});

// Función para mostrar un Pokémon en los resultados
function mostrarPokemonEnResultados(pokemon) {
    const pokemonId = pokemon.id.toString().padStart(3, "0");
    const div = document.createElement("div");
    div.classList.add("pokemon-result");
    div.innerHTML = `
        <div class="pokemon-result-image">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-result-info">
            <p class="pokemon-result-id">#${pokemonId}</p>
            <h3 class="pokemon-result-name">${pokemon.name}</h3>
        </div>`;
    resultsContainer.appendChild(div);
}

// Función para mostrar un Pokémon en la lista principal
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');
    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div")
    div.classList.add("pokemon")
    div.innerHTML = `
        <div class="pokemon">
        <a href="https://www.wikidex.net/wiki/${poke.name}">
            <p class="pokemon-id-back">#${pokeId}</p>
            <div class="pokemon-image">
                <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
            </div>
            <div class="pokemon-info">
                <div class="nombre-contenedor">
                    <p class="pokemon-id">${poke.id}</p>
                    <h2 class="pokemon-nombre">${poke.name}</h2>
                </div>
                <div class="pokemon-type">
                    <p class="tipo">${tipos}</p>
                </div>
                <div class="pokemon-stats">
                    <p class="stat">${poke.height}</p>
                    <p class="stat">${poke.weight}kg</p>
                </div>
            </div>
            </a>
        </div>`;
    listapokemon.appendChild(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    tipoFiltroActual = event.currentTarget.id;
    pokemini = 1;
    pokemaxi = 20;
    listapokemon.innerHTML = "";
    mostrarPokemonList();
}));

// Función para mostrar la lista de Pokémon por primera vez
function mostrarPokemonListprimeravez() {
    for (let i = pokemini - 1; i < pokemaxi; i++) {
        mostrarPokemon(pokemonData[i]);
    }
}

// Event listener para la búsqueda de Pokémon
searchInputPokemon.addEventListener('keyup', (event) => {
    const term = event.target.value.trim().toLowerCase();
    console.log(term); // Puedes eliminar esto una vez que esté funcionando correctamente
});

// Botón para avanzar a la siguiente página
btnadelante.addEventListener('click', (event) => {
    if (pokemaxi < cantpokemon) {
        pokemaxi += 20;
        pokemini += 20;
        listapokemon.innerHTML = "";
        mostrarPokemonList();
    }
});// Botón para retroceder a la página anterior
btnatras.addEventListener('click', (event) => {
    if (pokemini > 20) {
        pokemaxi -= 20;
        pokemini -= 20;
        listapokemon.innerHTML = "";
        mostrarPokemonList();
    }
});

function mostrarPokemonList() {
    const pokemonFiltrados = pokemonData.filter(pokemon => {
        if (!tipoFiltroActual || tipoFiltroActual === "ver-todos") {
            return true; // Mostrar todos los Pokémon si no hay filtro o si se selecciona "Ver todos"
        } else {
            return pokemon.types.some(type => type.type.name === tipoFiltroActual); // Filtrar por tipo de Pokémon
        }
    });

    for (let i = pokemini - 1; i < pokemaxi && i < pokemonFiltrados.length; i++) {
        mostrarPokemon(pokemonFiltrados[i]);
    }
}

// Llamar a la función para mostrar la lista de Pokémon inicialmente
mostrarPokemonList();
