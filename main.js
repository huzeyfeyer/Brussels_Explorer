// Culturele locaties API
const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_lieux_culturels/records?limit=100";

// Stripmuren API
const API_STRIP = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=20";

// HTML_elementen
// Culturele plaatsen
const container = document.getElementById("gegevens");
// Stripmuren plaatsen
const plaatsStripMuren = document.getElementById("stripmuren");
const gegevensFilter = document.getElementById("gegevens_filter");
const zoekInput = document.getElementById("zoek_optie");
const sorteerSelect = document.getElementById("sorteer_optie");
const alleenFavorietenCheckbox = document.getElementById("toon-favorieten");
 
// Favorieten ophalen uit localStorage
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || [];
//om stripMuren globaal te maken
let stripMuren = [];
// Gegevens ophalen en tonen
fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const plaatsen = data.results;

  //Sorteerfunctie
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

      // Filteren op basis van de geselecteerde gegevens
      if (gegevensFilter.value !== "alle" && gegevensFilter.value !== "cultureel") return;

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
     const gefilterd = plaatsen.filter(place => 
          (place.description && place.description.toLowerCase().includes(zoekterm)) ||
          (place.adresse && place.adresse.toLowerCase().includes(zoekterm))
        );
        plaatsLijst(gefilterd);
      });

      sorteerSelect.addEventListener("change", () => plaatsLijst(plaatsen));
      alleenFavorietenCheckbox.addEventListener("change", () => plaatsLijst(plaatsen));
      gegevensFilter.addEventListener("change", () => plaatsLijst(plaatsen));

    })

    .catch(error => {
      console.error("Error 404. Probeer opnieuw.", error);
      document.getElementById("gegevens").innerText = "Kan gegevens niet laden.";
    });
     

      // Stripmuren gegevens ophalen en tonen
    fetch(API_STRIP)
    .then(response => response.json())
    .then(data => {
       stripMuren = data.results;

      function toonStripMuren(lijst) {

        // Nieuwe lege content maken
        plaatsStripMuren.innerHTML = "";

        lijst.forEach(mural => {
          // Filteren op basis van de geselecteerde gegevens
          if (gegevensFilter.value !== "alle" && gegevensFilter.value !== "strip") return;

          const id = mural.nom_de_la_fresque + " - " + mural.adresse;
          const isFavoriete = favorieten.includes(id);

          if (alleenFavorietenCheckbox.checked && !isFavoriete) return;

          const div = document.createElement("div");
          div.classList.add("stripmuren");

          div.innerHTML = `
            <h3>${mural.nom_de_la_fresque || "Geen info"}</h3>
            <p><strong>Adres:</strong> ${mural.adresse || "Geen info"}</p>
            <p><strong>Gemeente:</strong> ${mural.commune_gemeente || "Geen info"}</p>
            <p><strong>Tekenaar:</strong> ${mural.dessinateur || "Geen info"}</p>
            <p><strong>Jaar:</strong> ${mural.date || "Onbekend"}</p>
            <img src="${mural.image}" alt="Muurschildering" style="width:100%; max-height:200px; object-fit:cover;" />
            <a href="${mural.lien_site_parcours_bd}" target="_blank">Meer info</a>
            <button class="favoriete_knopje ${isFavoriete ? "actief" : ""}" data-id="${id}">
              <i class="${isFavoriete ? "fas" : "far"} fa-heart"></i>
            </button>
          `;

          const button = div.querySelector(".favoriete_knopje");
          button.addEventListener("click", () => {
            const icon = button.querySelector("i");

            if (favorieten.includes(id)) {
              favorieten = favorieten.filter(fav => fav !== id);
              button.classList.remove("actief");
              icon.className = "far fa-heart";
            } else {
              favorieten.push(id);
              button.classList.add("actief");
              icon.className = "fas fa-heart";
            }

            localStorage.setItem("favorieten", JSON.stringify(favorieten));
          });

          plaatsStripMuren.appendChild(div);
        });
      }

      toonStripMuren(stripMuren);

      // Zoekfunctie voor stripmuren
      zoekInput.addEventListener("input", (e) => {
        const zoekterm = e.target.value.toLowerCase();
        const gefilterd = stripMuren.filter(mural =>
          (mural.nom_de_la_fresque && mural.nom_de_la_fresque.toLowerCase().includes(zoekterm)) ||
          (mural.adresse && mural.adresse.toLowerCase().includes(zoekterm)) ||
          (mural.dessinateur && mural.dessinateur.toLowerCase().includes(zoekterm)) ||
          (mural.date && mural.date.toString().includes(zoekterm))
        );

        toonStripMuren(gefilterd);
      });

      // Enkel favorieten filter
      alleenFavorietenCheckbox.addEventListener("change", () => 
        toonStripMuren(stripMuren));
        gegevensFilter.addEventListener("change", () => toonStripMuren(stripMuren));
      });
  