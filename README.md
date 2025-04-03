BrusselsExplorer

*Een interactieve webapplicatie waarmee gebruikers culturele locaties in Brussel kunnen ontdekken. De app maakt gebruik van de open data 	API van opendata.brussels.

---

Projectstatus

- (done) GitHub-repository aangemaakt  

- (done) Basisbestanden (HTML, CSS, JS) zijn opgezet  

- (done) Dataset gekozen via opendata.brussels  

- (done) Taakverdeling tussen teamleden vastgelegd  

- (done) Eerste versie: data ophalen & weergeven (description, adres, postcode, gemeente)  

- (done) Favorieten kunnen worden opgeslagen (❤️ button met localStorage)  

- (nog niet) Sorteren en filtering zijn nog niet geïmplementeerd  

- (nog niet) Design nog niet geoptimaliseerd

Screenshots van de applicatie:

./screenshots/BasisOpmaak.png
 
---

- Taakverdeling

	* Huzeyfe:
		Opzetten van API-koppeling
		Data ophalen en dynamisch tonen in de DOM
		Zoekfunctie implementeren
		Favorietenfunctie met localStorage
	* Abdullah:
		HTML en CSS structuur
		Styling van zoekveld en kaarten
		Dropdownmenu voor filtering (in ontwikkeling)

--- 

- Functionaliteiten (tot nu toe)
	Lijstweergave van culturele locaties in Brussel
	Zoekfunctie op naam of adres
	Gebruikers kunnen locaties toevoegen aan favorieten
	Favorieten worden opgeslagen in localStorage en blijven behouden
	Responsive layout met eenvoudige navigatie

--- 


- Bestandenstructuur
	index.html – basisstructuur van de webpagina
	style.css – styling met focus op gebruiksvriendelijkheid
	app.js – logica voor data ophalen, tonen, zoeken en favorieten
