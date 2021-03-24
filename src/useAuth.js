import { useState, useEffect } from 'react'
import axios from "axios"

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    
    useEffect(() => {
        console.log("Server Login")
        axios.post("http://localhost:3001/login", {
            code,
        }).then(res => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            console.log("History")
            // window.history.pushState({}, null, "/")
        })
        .catch((e) => {
            console.log(e.message)
            window.location = "/"
        })
    }, [])

    useEffect(() => {
        console.log("Refresh")
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {

        axios.post("http://localhost:3001/refresh", {
                refreshToken,
            }).then(res => {
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
                console.log("UseAuth-2")
                window.location = "/"
            })
        }, (expiresIn - 60) * 1000)
        console.log("Epires = 60 Before Return")

        return () => clearInterval(interval)
    }, [])
    
    return accessToken
}