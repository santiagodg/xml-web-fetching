// videogames.js v1.0.0
// September 7th, 2021
// Author: Santiago Díaz Guevara <santidiazg@hotmail.es>

// Videogames is a class that fetches and XML file with a Videogames schema, parses it,
// and displays both the raw XML and an HTML styled format after a button click trigger.
export class Videogames {
    constructor() {
        this.videogames   = []
        this.xmlURL       = "assets/videogames/videogames.xml"
        this.rawXML       = ""
        this.buttonID     = ""
        this.xmlInputID   = ""
        this.xmlDisplayID = ""
    }

    // fetch gets the XML file, parses its contents and populates `this.videogames`.
    async fetch() {
        const req = new Request(this.xmlURL)
        await fetch(req)
            .then(resp => resp.text())
            .then(str => {
                this.rawXML = str
                return (new window.DOMParser()).parseFromString(str, "text/xml")
            })
            .then(doc => {
                const xmlVideogames = doc.getElementsByTagName("videogame")
                for (let i = 0; i < xmlVideogames.length; i++) {
                    const title = xmlVideogames[i].getElementsByTagName("title")[0].firstChild.nodeValue
                    const company = xmlVideogames[i].getElementsByTagName("company")[0].firstChild.nodeValue
                    let awards = []

                    const xmlAwards = xmlVideogames[i].getElementsByTagName("award")
                    for (let j = 0; j < xmlAwards.length; j++) {
                        const newAward = new Award(xmlAwards[j].firstChild.nodeValue)
                        awards.push(newAward)
                    }

                    const newVideogame = new Videogame(title, company, awards)
                    this.videogames.push(newVideogame)
                }
            })
    }

    // listen takes an HTML button ID which triggers the display of the fetched videogames
    // as raw XML and styled content. All parameters must be strings.
    //
    // xmlInputID is the HTML element ID where the raw XML will be dumped.
    // xmlDisplayID is the HTML element ID where the styled videogames data will be displayed.
    listen(buttonID, xmlInputID, xmlDisplayID) {
        this.buttonID     = buttonID
        this.xmlInputID   = xmlInputID
        this.xmlDisplayID = xmlDisplayID

        const usersButton = document.getElementById(buttonID)
        usersButton.addEventListener("click", _ => {
            if (this.videogames.length === 0) {
                this.fetch()
                    .then(() => this.display())
                return
            }
            this.display()
        })
    }

    // display populates the view by setting the specified HTML elements' contents
    // to their respective raw and styled formats. This method is called by `listen` when
    // the specified button is clicked.
    display() {
        const xmlInputDiv = document.getElementById(this.xmlInputID)
        const xmlDisplayDiv = document.getElementById(this.xmlDisplayID)

        xmlInputDiv.innerText = this.rawXML

        let videogamesHTML = `<p class="videogames-videogames">Videogames</p>\n`
        this.videogames.forEach(videogame => {
            videogamesHTML += videogame.html() + "\n"
        })

        xmlDisplayDiv.innerHTML = videogamesHTML
    }
}

// Videogame stores data of a single videogame.
class Videogame {
    constructor(title, company, awards) {
        this.title   = title
        this.company = company
        this.awards  = awards
    }

    // html returns the HTML styled content of this object as a string ready to be 
    // displayed.
    html() {
        let htmlAwards = ""
        this.awards.forEach(award => {
            htmlAwards += award.li()
        })

        return `<div class="videogame">
        <p>
            <span class="videogame-title">
                ${this.title}
            </span>
            </br>
            <span class="videogame-company">
                ${this.company}
            </span>
        </p>
        <p class="videogame-awards">
            Awards:
        </p>
        <ul class="videogame-awards-ul">
            ${htmlAwards}
        </ul>
        </div>
        `
    }
}

// Award stores data about a videogame's award.
class Award {
    constructor(awardStr) {
        this.name = awardStr
    }

    // li returns the content of this object as a styled HTML list item ready to be displayed.
    li() {
        return `<li class="videogame-award-li">${this.name}</li>`
    }
}
