let allPokemon = [];

async function fetchPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

        if (!response.ok) {
            throw new Error("Failed to fetch Pokemon data.");
    }

    const data = await response.json();

    const pokemonList = await Promise.all(data.results.map(async pokemon => {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        return formatPokemonData(details);
    }));

    allPokemon = pokemonList;
    displayPokemon(allPokemon);

} catch (error) {
    console.error("Error fetching Pokemon:", error);
    }
}

fetchPokemon();

function displayPokemon(pokemonList) {
    const grid = document.getElementById("pokemon-grid");
    const fragment = document.createDocumentFragment();

    grid.innerHTML = "";

        if (pokemonList.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No Pokemon Found.";
        grid.appendChild(message);
        return;
    }

    pokemonList.forEach(pokemon => {
        const card = document.createElement("article");
        card.classList.add("pokemon-card");

        const name = document.createElement("h3");
        name.textContent = pokemon.name;

        const image = document.createElement("img");
        image.src = pokemon.image;
        image.alt = pokemon.name;

        const types = document.createElement("p");
        types.textContent = "Type: " + pokemon.types.join(" / ");

        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(types);

        card.addEventListener("click", () => {
            displayPokemonDetails(pokemon);
        });

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

function displayPokemonDetails(pokemon) {
    const info = document.getElementById("pokemon-info");

    info.innerHTML = "";

    const name = document.createElement("h3");
    name.textContent = pokemon.name;

    const typesHeading = document.createElement("h4");
    typesHeading.textContent = "Types";

    const types = document.createElement("p");
    types.textContent = pokemon.types.join(" / ");

    const abilitiesHeading = document.createElement("h4");
    abilitiesHeading.textContent = "Abilities";

    const abilities = document.createElement("p");
    abilities.textContent = pokemon.abilities.join(", ");

    const statsHeading = document.createElement("h4");
    statsHeading.textContent = "Stats";

    const statsList = document.createElement("ul");

    pokemon.stats.forEach(stat => {
        const item = document.createElement("li");
        item.textContent = stat.name + ": " + stat.value;
        statsList.appendChild(item);
    });

    info.appendChild(name);
    info.appendChild(typesHeading);
    info.appendChild(types);
    info.appendChild(abilitiesHeading);
    info.appendChild(abilities);
    info.appendChild(statsHeading);
    info.appendChild(statsList);
}

async function fetchPokemonDetails(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
            throw new Error("Failed to fetch Pokemon details.");
        }

        const data = await response.json();
        return formatPokemonData(data);
    } catch (error) {
        console.error("Error fetching Pokemon details:", error);
        return null;
    }
}

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("pokemon-search");
    const typeFilter = document.getElementById("type-filter");

    function filterPokemon() {
        const selectedType = typeFilter.value;

        if (selectedType === "all") {
            displayPokemon(allPokemon);
            return;
        }

        const filteredPokemon = allPokemon.filter(pokemon => 
            pokemon.types.includes(selectedType)
        );

        displayPokemon(filteredPokemon);
    }

        typeFilter.addEventListener("change", () => {
            filterPokemon();
        });

    searchForm.addEventListener("submit", async event => {
        event.preventDefault();

        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedType = typeFilter.value;

        let matchingPokemon = allPokemon.filter(pokemon =>
            pokemon.name.includes(searchTerm)
        );

        if (selectedType !== "all") {
            matchingPokemon = matchingPokemon.filter(pokemon =>
                pokemon.types.includes(selectedType)
            );
        }

        if (matchingPokemon.length > 0) {
            displayPokemon(matchingPokemon);
        } else if (searchTerm !== "") {
            const pokemon = await fetchPokemonDetails(searchTerm);

            if (pokemon && (selectedType === "all" || pokemon.types.includes(selectedType))) {
                displayPokemon([pokemon]);
            } else {
                displayPokemon([]);
            }

        } else {
            displayPokemon([]);
        }
    });


    searchForm.addEventListener("reset", () => {
        displayPokemon(allPokemon);

        const info = document.getElementById("pokemon-info");
        info.innerHTML = "<p>Select a Pokemon to view its details.</p>";
    });

function formatPokemonData(data) {
    return {
        id: data.id,
        name: data.name,
        types: data.types.map(type => type.type.name),
        abilities: data.abilities.map(ability => ability.ability.name),
        stats: data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
        })),
        image: data.sprites.front_default
    };
}