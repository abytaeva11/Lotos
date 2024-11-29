import React from "react";
import { NavLink} from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Добро пожаловать на торги</h1>
            <p>Выберите вашу роль:</p>
            <ul>
                <li>
                    <NavLink to="/admin">Войти как Администратор</NavLink>
                </li>
                <li>
                    <NavLink to="/participant/1">Участник №1</NavLink>
                </li>
                <li>
                    <NavLink to="/participant/2">Участник №2</NavLink>
                </li>
                <li>
                    <NavLink to="/participant/3">Участник №3</NavLink>
                </li>
                <li>
                    <NavLink to="/participant/4">Участник №4</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Home;
