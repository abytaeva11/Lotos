import React from "react";
import { useParams } from "react-router-dom";

function Participant() {
    const { id } = useParams();

    return (
        <div>
            <h1>Участник №{id}</h1>
            <p>Добро пожаловать на вашу страницу торгов.</p>
        </div>
    );
}

export default Participant;
