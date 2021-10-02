import React from "react"

const UserContext = React.createContext({
    isAuth: false,
    User: null
})

export default UserContext;