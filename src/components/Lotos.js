import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Lotos.css";

const Lotos = () => {
    const { id } = useParams();
    const location = useLocation();
    const participantIndex = id ? parseInt(id) - 1 : null;
    const isMainScreen = !id;

    const [remainingTime, setRemainingTime] = useState(15 * 60);
    const [participantTime, setParticipantTime] = useState(30);
    const [isAuctionActive, setIsAuctionActive] = useState(true);
    const [prices, setPrices] = useState(() => {
        const savedPrices = localStorage.getItem("prices");
        return savedPrices ? JSON.parse(savedPrices) : [
            { cost: 100000, quality: "", term: "", warranty: "", payment: "", additionalCost: "" },
            { cost: "", quality: "", term: "", warranty: "", payment: "", additionalCost: "" },
            { cost: "", quality: "", term: "", warranty: "", payment: "", additionalCost: "" },
            { cost: "", quality: "", term: "", warranty: "", payment: "", additionalCost: "" },
        ];
    });

    const participants = ["Участник №1", "Участник №2", "Участник №3", "Участник №4"];

    // Таймеры
    useEffect(() => {
        if (!isAuctionActive) return;

        const globalInterval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev > 0) return prev - 1;
                setIsAuctionActive(false);
                return 0;
            });
        }, 1000);

        if (!isMainScreen && participantIndex !== null) {
            const participantInterval = setInterval(() => {
                setParticipantTime((prev) => {
                    if (prev > 1) return prev - 1;
                    clearInterval(participantInterval);
                    return 0;
                });
            }, 1000);

            return () => clearInterval(participantInterval);
        }

        return () => clearInterval(globalInterval);
    }, [isAuctionActive, participantIndex, isMainScreen]);

    // Проверка доступа
    const hasAccess = () => {
        if (isMainScreen) return true;
        if (participantIndex !== null && participantTime > 0) return true;
        return false;
    };

    const updatePrice = (field, newValue) => {
        if (!hasAccess()) return;
        setPrices((prevPrices) => {
            const updatedPrices = [...prevPrices];
            updatedPrices[participantIndex][field] = newValue;
            localStorage.setItem("prices", JSON.stringify(updatedPrices));
            return updatedPrices;
        });
    };

    return (
        <div className="App">
            <div className="container">
                <header className="header">
                    <h2>
                        Ход торгов: Тестовые торги на аппарат ЛОТОС №2033564 (09.11.2020 07:00)
                    </h2>
                </header>
                <hr />

                {isAuctionActive ? (
                    <>
                        <h3>
                            {isMainScreen
                                ? "Главный экран: Вы можете изменять данные всех участников"
                                : `Уважаемый ${participants[participantIndex]}, вы можете изменить свои данные.`}
                        </h3>

                        <div className="timer">
                            <div className="timer-wrapper">
                                <p>Осталось времени для вас:</p>
                                <h1>{participantTime}</h1>
                            </div>

                            <div className="timer-wrapper">
                                <p>Общее оставшееся время торгов:</p>
                                <h1>{Math.floor(remainingTime / 60)} мин {remainingTime % 60} сек</h1>
                            </div>
                        </div>

                        <table>
                            <thead>
                            <tr>
                                <th>Параметры и требования</th>
                                {participants.map((participant, index) => (
                                    <th key={index}>{participant}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Стоимость изготовления лота, руб. (без НДС)</td>
                                {prices.map((price, index) => (
                                    <td key={index}>
                                        {hasAccess() && participantIndex === index ? (
                                            <input
                                                type="number"
                                                value={price.cost}
                                                onChange={(e) =>
                                                    updatePrice("cost", Number(e.target.value))
                                                }
                                            />
                                        ) : (
                                            price.cost || "—"
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Наличие комплекса мероприятий, повышающих стандарты качества изготовления</td>
                                {prices.map((price, index) => (
                                    <td key={index}>
                                        {hasAccess() && participantIndex === index ? (
                                            <input
                                                type="text"
                                                value={price.quality}
                                                onChange={(e) =>
                                                    updatePrice("quality", e.target.value)
                                                }
                                            />
                                        ) : (
                                            price.quality || "—"
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Срок изготовления лота, дней</td>
                                {prices.map((price, index) => (
                                    <td key={index}>
                                        {hasAccess() && participantIndex === index ? (
                                            <input
                                                type="text"
                                                value={price.term}
                                                onChange={(e) =>
                                                    updatePrice("term", e.target.value)
                                                }
                                            />
                                        ) : (
                                            price.term || "—"
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Гарантийные обязательства, мес</td>
                                {prices.map((price, index) => (
                                    <td key={index}>
                                        {hasAccess() && participantIndex === index ? (
                                            <input
                                                type="text"
                                                value={price.warranty}
                                                onChange={(e) =>
                                                    updatePrice("warranty", e.target.value)
                                                }
                                            />
                                        ) : (
                                            price.warranty || "—"
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Условия оплаты</td>
                                {prices.map((price, index) => (
                                    <td key={index}>
                                        {hasAccess() && participantIndex === index ? (
                                            <input
                                                type="text"
                                                value={price.payment}
                                                onChange={(e) =>
                                                    updatePrice("payment", e.target.value)
                                                }
                                            />
                                        ) : (
                                            price.payment || "—"
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Дополнительные расходы</td>
                                {prices.map((price, index) => (
                                    <td key={index}>
                                        {hasAccess() && participantIndex === index ? (
                                            <input
                                                type="text"
                                                value={price.additionalCost}
                                                onChange={(e) =>
                                                    updatePrice("additionalCost", e.target.value)
                                                }
                                            />
                                        ) : (
                                            price.additionalCost || "—"
                                        )}
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </>
                ) : (
                    <h3>Торги завершены! Итоговые данные: {JSON.stringify(prices)}</h3>
                )}
            </div>
        </div>
    );
};

export default Lotos;
