import { Users } from "./users/users.js"
import { Videogames } from "./videogames/videogames.js"

(() => {
    const _usersButtonID      = "btn-xml-1"
    const _videogamesButtonID = "btn-xml-2"
    const _xmlInputID         = "xml-input"
    const _xmlDisplayID       = "xml-display"

    // Setup users' fetching and displaying
    const users = new Users()
    users.listen(_usersButtonID, _xmlInputID, _xmlDisplayID)

    // Setup videogames' fetching and displaying
    const videogames = new Videogames()
    videogames.listen(_videogamesButtonID, _xmlInputID, _xmlDisplayID)
})()
