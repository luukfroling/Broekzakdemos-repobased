# Broekzakdemos - repository based

In deze versie worden 2 talen gebouwd door middel van een engelse en nederlandse folder. 

in de root: 
- myst.yml: Basisconfiguratie van het project
- toc_en.yml / toc_nl.yml: Taal-specifieke inhoudsopgaven
- content/en/ en content/nl/: Taal-specifieke boekbestanden
- deploy.yml: GitHub Action die beide talen bouwt en publiceert

1) GitHub Actions triggert bij elke push naar main of handmatig via “Run workflow”.

2) De actie:
- Installeert Node.js en MyST CLI.
- Past myst.yml tijdelijk aan voor elke taal (Engels/Nederlands). Er wordt een action knop toegevoegd en de TOC wordt aangepast
- Bouwt de site twee keer, één keer per taal.
- Kopieert de build-resultaten naar site/en/ en site/nl/.
- Plaatst een index.html in de root om te redirecten naar /en/.
- Uploadt alles naar GitHub Pages.

De URLs zijn dan bijvoorbeeld:
- https://luukfroling.github.io/Broekzakdemos-repobased/en/
- https://luukfroling.github.io/Broekzakdemos-repobased/nl/
