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
 

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}
 
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
 
document.getElementById("theme-toggle").addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});
 
 
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
      div.classList.add("gegevens");
 
      // Taalinstelling
      const language = localStorage.getItem("language") || "nl";
const naam = language === "fr" ? place.description : place.beschrijving;
const adres = language === "fr" ? place.adresse : place.adres;
const gemeente = language === "fr" ? place.lieu : place.plaats;
 
const labels = {
  adres: language === "fr" ? "Adresse" : "Adres",
  postcode: language === "fr" ? "Code postal" : "Post Code",
  gemeente: language === "fr" ? "Commune" : "Gemeente"
};

       // Elk element bevat naam, adres, postcode en gemeente
       div.innerHTML = `
       <h3>${naam || "Geen info"}</h3>
       <p><strong>${labels.adres}:</strong> ${adres || "Geen info"}</p>
       <p><strong>${labels.postcode}:</strong> ${place.code_postal || "Geen info"}</p>
       <p><strong>${labels.gemeente}:</strong> ${gemeente || "Geen info"}</p>
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
 
      sorteerSelect.addEventListener("change", () => {
        if (gegevensFilter.value === "cultureel" || gegevensFilter.value === "alle") {
          plaatsLijst(plaatsen);
        }
        if (gegevensFilter.value === "strip" || gegevensFilter.value === "alle") {
          toonStripMuren(stripMuren);
        }
      });
 
 
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
 
       function sorteerStripmuren(lijst, optie) {
        if (optie === "naam") {
          lijst.sort((a, b) => (a.nom_de_la_fresque || "").localeCompare(b.nom_de_la_fresque || ""));
        } else if (optie === "postcode") {
          const getPostcode = adres => parseInt(adres?.match(/\d{4}/)?.[0]) || 0;
          lijst.sort((a, b) => getPostcode(a.adresse) - getPostcode(b.adresse));
        }
      }
 
      function toonStripMuren(lijst) {
 
        // Nieuwe lege content maken
        plaatsStripMuren.innerHTML = "";
 
        sorteerStripmuren(lijst, sorteerSelect.value);
 
        lijst.forEach(mural => {
          // Filteren op basis van de geselecteerde gegevens
          if (gegevensFilter.value !== "alle" && gegevensFilter.value !== "strip") return;
 
          const id = mural.nom_de_la_fresque + " - " + mural.adresse;
          const isFavoriete = favorieten.includes(id);
 
          if (alleenFavorietenCheckbox.checked && !isFavoriete) return;
 
          const language = localStorage.getItem("language") || "nl";
  const titel = language === "fr" ? mural.nom_de_la_fresque : mural.naam_fresco_nl;
  const adres = language === "fr" ? mural.adresse : mural.adres;
  const link = language === "fr" ? mural.lien_site_parcours_bd : mural.link_site_striproute;
 
  const labels = {
    adres: language === "fr" ? "Adresse" : "Adres",
    gemeente: language === "fr" ? "Commune" : "Gemeente",
    tekenaar: language === "fr" ? "Dessinateur" : "Tekenaar",
    jaar: language === "fr" ? "Année" : "Jaar",
    meerinfo: language === "fr" ? "Plus d'infos" : "Meer info"
  };
 
          const div = document.createElement("div");
          div.classList.add("stripmuren");
 
          div.innerHTML = `
    <h3>${titel || "Geen info"}</h3>
    <p><strong>${labels.adres}:</strong> ${adres || "Geen info"}</p>
    <p><strong>${labels.gemeente}:</strong> ${mural.commune_gemeente || "Geen info"}</p>
    <p><strong>${labels.tekenaar}:</strong> ${mural.dessinateur || "Geen info"}</p>
    <p><strong>${labels.jaar}:</strong> ${mural.date || "Onbekend"}</p>
    <img src="${mural.image}" alt="Muurschildering" style="width:100%; max-height:200px; object-fit:cover;" />
    <a href="${link}" target="_blank">${labels.meerinfo}</a>
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
 
      document.addEventListener("DOMContentLoaded", () => {
        const languageSelect = document.getElementById("language-select");
        const savedLang = localStorage.getItem("language") || "nl";
        languageSelect.value = savedLang;
      
        languageSelect.addEventListener("change", () => {
          const lang = languageSelect.value;
          localStorage.setItem("language", lang);
          
        });
      });
 
      document.addEventListener("DOMContentLoaded", () => {
        const languageSelect = document.getElementById("language-select");
        const savedLang = localStorage.getItem("language") || "nl";
        languageSelect.value = savedLang;
      
        languageSelect.addEventListener("change", () => {
          localStorage.setItem("language", languageSelect.value);
          location.reload(); // opnieuw laden van de pagina om de taalwijziging toe te passen
        });
      });
 
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (positie) => {
            const lat = positie.coords.latitude;
            const lon = positie.coords.longitude;
      
            // Sla locatie op in localStorage
            localStorage.setItem("geolocatie", JSON.stringify({ lat, lon }));
      
            const locatieElement = document.getElementById("geolocatie-weergave");
            if (locatieElement) {
              try {
                // Vraag adresinfo op via OpenStreetMap (Nominatim)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                const data = await response.json();
      
                const taal = localStorage.getItem("language") || "nl";
                const gemeente = data.address.city || data.address.town || data.address.village || data.address.municipality || "Onbekend";
                const provincie = data.address.state || "";
                const label = taal === "fr" ? "Commune" : "Gemeente";
      
                locatieElement.textContent = `📍 ${label}: ${gemeente}, ${provincie}`;
              } catch (fout) {
                console.warn("Adres ophalen mislukt:", fout);
                locatieElement.textContent = `📍 (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
              }
            }
          },
          (fout) => {
            console.warn("Geolocatie geweigerd of mislukt:", fout.message);
          }
        );
      } else {
        console.warn("Geolocatie wordt niet ondersteund door deze browser.");
      }
      
      // Laat eerder opgeslagen locatie zien als gebruiker niet opnieuw toestemming geeft
      const opgeslagenLocatie = localStorage.getItem("geolocatie");
      if (opgeslagenLocatie && !document.getElementById("geolocatie-weergave").textContent) {
        const { lat, lon } = JSON.parse(opgeslagenLocatie);
        const locatieElement = document.getElementById("geolocatie-weergave");
        if (locatieElement) {
          locatieElement.textContent = `📍 (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
        }
      }
 