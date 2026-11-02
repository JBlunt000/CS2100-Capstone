async function fetchPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

        if (!response.ok) {
            throw new Error("Failed to fetch Pokemon data.");
    }

    const data = await response.json();
    console.log(data.results);
} catch (error) {
    console.error("Error fetching Pokemon:", error);
    }
}

fetchPokemon();

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