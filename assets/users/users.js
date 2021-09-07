// users.js v1.0.0
// September 7th, 2021
// Author: Santiago Díaz Guevara <santidiazg@hotmail.es>

// Users is a class that fetches an XML file with a Users schema, parses it,
// and displays both the raw XML and an HTML styled format after a button click trigger.
export class Users {
    constructor() {
        this.users        = []
        this.xmlURL       = "assets/users/users.xml"
        this.rawXML       = ""
        this.buttonID     = ""
        this.xmlInputID   = ""
        this.xmlDisplayID = ""
    }

    // fetch gets the XML file, parses its contents and populates `this.users`.
    async fetch() {
        const req = new Request(this.xmlURL);
        await fetch(req)
            .then(resp => resp.text())
            .then(str => {
                this.rawXML = str
                return (new window.DOMParser()).parseFromString(str, "text/xml")
            })
            .then(doc => {
                const xmlUsers = doc.getElementsByTagName("user")
                for (let i = 0; i < xmlUsers.length; i++) {
                    const id = xmlUsers[i].getElementsByTagName("id")[0].firstChild.nodeValue
                    const firstname = xmlUsers[i].getElementsByTagName("firstname")[0].firstChild.nodeValue
                    const lastname = xmlUsers[i].getElementsByTagName("lastname")[0].firstChild.nodeValue
                    let hobbies = []

                    const xmlHobbies = xmlUsers[i].getElementsByTagName("hobbies")[0].getElementsByTagName("hobby")

                    for (let j = 0; j < xmlHobbies.length; j++) {
                        const newHobby = new Hobby(xmlHobbies[j].firstChild.nodeValue)
                        hobbies.push(newHobby)
                    }

                    const newUser = new User(id, firstname, lastname, hobbies)
                    this.users.push(newUser)
                }
            })
    }

    // listen takes an HTML button ID which triggers the display of the fetched users
    // as raw XML and styled content. All parameters must be strings.
    //
    // xmlInputID is the HTML element ID where the raw XML will be dumped.
    // xmlDisplayID is the HTML element ID where the styled users data will be displayed.
    listen(buttonID, xmlInputID, xmlDisplayID) {
        this.buttonID     = buttonID
        this.xmlInputID   = xmlInputID
        this.xmlDisplayID = xmlDisplayID

        const usersButton = document.getElementById(buttonID)
        usersButton.addEventListener("click", _ => {
            if (this.users.length === 0) {
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

        let usersHTML = `<p class="users-users">Users</p>\n`
        this.users.forEach(user => {
            usersHTML += user.html() + "\n"
        })

        xmlDisplayDiv.innerHTML = usersHTML
    }
}

// User stores data of a single user.
class User {
    constructor(id, firstname, lastname, hobbies) {
        this.id        = id
        this.firstname = firstname
        this.lastname  = lastname
        this.hobbies   = hobbies
    }

    // html returns the HTML styled content of this object as a string ready to be 
    // displayed.
    html() {
        let htmlHobbies = ""
        this.hobbies.forEach(hobby => {
            htmlHobbies += hobby.li()
        })

        return `<div class="user">
        <p>
            <span class="user-id">
                ${this.id}
            </span>
            <span class="user-firstname">
                ${this.firstname}
            </span>
            <span class="user-lastname">
                ${this.lastname}
            </span>
        </p>
        <p class="user-hobbies">
            Hobbies:
        </p>
        <ul class="user-hobbies-ul">
            ${htmlHobbies}
        </ul>
        </div>`
    }
}

// Hobby stores data about a user's hobby.
class Hobby {
    constructor(hobbyStr) {
        this.name = hobbyStr
    }

    // li returns the content of this object as a styled HTML list item ready to be displayed.
    li() {
        return `<li class="user-hobby-li">${this.name}</li>`
    }
}
