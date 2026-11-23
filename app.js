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
    displayPokemon(pokemonList);

} catch (error) {
    console.error("Error fetching Pokemon:", error);
    }
}

fetchPokemon();

function displayPokemon(pokemonList) {
    const grid = document.getElementById("pokemon-grid");
    const fragment = document.createDocumentFragment();

    grid.innerHTML = "";

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
        
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

async function fetchPokemonDetails(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
            throw new Error("Failed to fetch Pokemon details.");
        }

        const data = await response.json();
        const pokemon = formatPokemonData(data);
        console.log(pokemon);
    } catch (error) {
        console.error("Error fetching Pokemon details:", error);
    }
}

fetchPokemonDetails("bulbasaur");

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
    }
}