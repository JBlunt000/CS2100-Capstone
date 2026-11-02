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