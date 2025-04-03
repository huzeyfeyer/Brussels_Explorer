const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_lieux_culturels/records?limit=100";
 
// HTML_elementen
const container = document.getElementById("gegevens");
const zoekInput = document.getElementById("zoek_optie");
const sorteerSelect = document.getElementById("sorteer_optie");
const alleenFavorietenCheckbox = document.getElementById("toon-favorieten");
 
// Favorieten ophalen uit localStorage
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || [];
 
// Gegevens ophalen en tonen
fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const plaatsen = data.results;

    function sorteerPlaatsen(lijst, optie) {
      if (optie === "naam") {
        lijst.sort((a, b) => (a.description || "").localeCompare(b.description || ""));
      } else if (optie === "postcode") {
        lijst.sort((a, b) => (a.code_postal || 0) - (b.code_postal || 0));
      }
    }
 
    // Een optie om plaatsen te tonen op het scherm
    function plaatsLijst(lijst) {
    // Nieuwe lege content maken
    container.innerHTML = "";

      // Sorteerplaatsen
    sorteerPlaatsen(lijst, sorteerSelect.value);
 
    lijst.forEach(place => {
            // is deze plaats favoriet?
            const id = (place.description || "onbekend") + " - " + (place.adresse || "onbekend");
        const isFavoriete = favorieten.includes(id);

        // Favorieten Filter 
        if (alleenFavorietenCheckbox.checked && !isFavoriete) return;
 
      const div = document.createElement("div");
      div.classList.add("plaats-card");
 
       // Elk element bevat naam, adres, postcode en gemeente
       div.innerHTML = `
       <h3>${place.description || "Geen info"}</h3>
       <p><strong>Adres:</strong> ${place.adresse || "Geen info"}</p>
       <p><strong>Post Code:</strong> ${place.code_postal || "Geen info"}</p>
       <p><strong>Gemeente:</strong> ${place.plaats || "Geen info"}</p>
       <button class="favoriete_knopje ${isFavoriete ? "actief" : ""}" data-id="${id}">
           <i class="${isFavoriete ? "fas" : "far"} fa-heart"></i>
       </button>
     `;
 
      const button = div.querySelector(".favoriete_knopje");
// bij het klikken, wordt een actie uitgevoerd
      button.addEventListener("click", () => {
        const icon = button.querySelector("i");
 
        if (favorieten.includes(id)) {
          favorieten = favorieten.filter(fav => fav !== id);
          button.classList.remove("actief");
          icon.className = "far fa-heart"; // leeg
        } else {
          favorieten.push(id);
          button.classList.add("actief");
          icon.className = "fas fa-heart"; // gevuld
        }
 
        localStorage.setItem("favorieten", JSON.stringify(favorieten));
      });
 
      container.appendChild(div);
    });
 
}
 
 
  // Een overzicht van alle plaatsen bij het laden van de pagina
  plaatsLijst(plaatsen);
 
  // Zoek optie – werkt na de invoer van gebruiker
  zoekInput.addEventListener("input", (e) => {
    const zoekterm = e.target.value.toLowerCase();
 
     // Filter de resultaten op basis van de beschrijving of adres
     const gefilterd = plaatsen.filter(place => {
        return (
          (place.description && place.description.toLowerCase().includes(zoekterm)) ||
          (place.adresse && place.adresse.toLowerCase().includes(zoekterm))
        );
      });
      plaatsLijst(gefilterd);

    });
      // Sorteeroptie verandert
      sorteerSelect.addEventListener("change", () => {
        plaatsLijst(plaatsen);
      });


        // Favorieten filter
      alleenFavorietenCheckbox.addEventListener("change", () => {
        plaatsLijst(plaatsen);
      });

    })
 
  .catch(error => {
    console.error("Error 404. Probeer opnieuw.", error);
    document.getElementById("gegevens").innerText = "Kan gegevens niet laden.";
  });