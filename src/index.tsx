import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { App } from "./components/App/App"
import reportWebVitals from "./reportWebVitals"
import "maplibre-gl/dist/maplibre-gl.css"

const root = document.getElementById("root")

if (!root) {
    throw new Error("can't find root element")
}

if (!window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = ReactDOM.createRoot(root)
}

window.__REACT_ROOT__.render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <App />
        </Suspense>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
