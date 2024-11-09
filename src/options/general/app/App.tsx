import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import Container from "./component/Container";

import "../../general.css"
import "../../custom.css";
import "@fontsource/roboto"

export default function App(props: {}) {
    return (
        <React.StrictMode>
            <Router future={{ v7_startTransition: true }}>
                <Container />
            </Router>
        </React.StrictMode>
    )
}