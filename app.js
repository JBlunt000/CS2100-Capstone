let allPokemon = [];

async function fetchPokemon(generation = "all") {
    try {
        let pokemonUrls = [];

        if (generation === "all") {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

        if (!response.ok) {
            throw new Error("Failed to fetch Pokemon data.");
    }

    const data = await response.json();
    pokemonUrls = data.results.map(pokemon => pokemon.url);

} else {
    const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);

    if (!response.ok) {
        throw new Error("Failed to fetch generation data.");
    }

    const data = await response.json();

    const species = data.pokemon_species.map(pokemon => {
        const parts = pokemon.url.split("/");
        return Number(parts[parts.length - 2]);
    });

    species.sort((a, b) => a - b);

    pokemonUrls = species.slice(0, 20).map(id =>
        `https://pokeapi.co/api/v2/pokemon/${id}/`
    );
}

const pokemonList = await Promise.all(pokemonUrls.map(async url => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch Pokemon details.");
    }

    const details = await response.json();
    return formatPokemonData(details);
}));

    allPokemon = pokemonList;
    filterPokemon()

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

async function matchesPokemonGeneration(pokemon, generation) {
    if (generation === "all") {
        return true;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`);

        if (!response.ok) {
            throw new Error("Failed to fetch Pokemon species.");
        }

        const data = await response.json();

        return data.generation.url.endsWith(`/${generation}/`);

    } catch (error) {
        console.error("Error checking Pokemon generation:", error);
        return false;
    }
}

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("pokemon-search");
    const typeFilter = document.getElementById("type-filter");
    const generationFilter = document.getElementById("generation-filter");
    const searchError = document.getElementById("search-error");

    function validatePokemonName() {
        const name = searchInput.value.trim();

        searchError.textContent = "";
        searchInput.removeAttribute("aria-invalid");

        if (name !== "" && !/^[a-z0-9-]+$/i.test(name)) {
            searchError.textContent = "Only letters, numbers, and hyphens are allowed.";
            searchInput.setAttribute("aria-invalid", "true");
            return false;
        }

        return true;
    }

        searchInput.addEventListener("input", () => {
            searchError.textContent = "";
            searchInput.removeAttribute("aria-invalid");
        });

    function filterPokemon() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedType = typeFilter.value;


        const filteredPokemon = allPokemon.filter(pokemon => {
            const matchesName = pokemon.name.includes(searchTerm);
            const matchesType = selectedType === "all" ||
            pokemon.types.includes(selectedType);

            return matchesName && matchesType;
        });

        displayPokemon(filteredPokemon);
    }

        typeFilter.addEventListener("change", () => {
            filterPokemon();
        });

        generationFilter.addEventListener("change", () => {
            fetchPokemon(generationFilter.value);

            const info = document.getElementById("pokemon-info");
            info.innerHTML = "<p>Select a Pokemon to view its details.</p>";
        });

    searchForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (!validatePokemonName()) {
            return;
        }

        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedType = typeFilter.value;
        const selectedGeneration = generationFilter.value;

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
            const localMatches = allPokemon.filter(pokemon =>
                pokemon.name.includes(searchTerm)
            );

            if (localMatches.length > 0) {
                displayPokemon([]);
                return;
            }

            const pokemon = await fetchPokemonDetails(searchTerm);

            if (pokemon) {
                const matchesType = selectedType === "all" ||
                pokemon.types.includes(selectedType);

                const matchesGeneration =  await matchesPokemonGeneration(pokemon, selectedGeneration);

                if (matchesType && matchesGeneration) {
                    displayPokemon([pokemon]);
                } else {
                    displayPokemon([]);
                }

            } else {
                displayPokemon([]);
            }

        } else {
            displayPokemon([]);
        }
    });


    searchForm.addEventListener("reset", () => {
        searchError.textContent = "";
        searchInput.removeAttribute("aria-invalid");

        
        fetchPokemon("all");

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