import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function Admin() {
    const [auctionStatus, setAuctionStatus] = useState("Ожидание");

    const startAuction = () => setAuctionStatus("Торги начались!");
    const endAuction = () => setAuctionStatus("Торги завершены!");

    const { id } = useParams();
    const location = useLocation();
    const participantIndex = id ? parseInt(id) - 1 : null;

    const isMainScreen = !id;

    const [currentTurn, setCurrentTurn] = useState(0);
    const [remainingTime, setRemainingTime] = useState(15 * 60);
    const [turnTime, setTurnTime] = useState(30);
    const [isAuctionActive, setIsAuctionActive] = useState(true);

    // Получение данных о ценах из localStorage (или начальные значения)
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

    // Обновление цен в localStorage при изменении
    useEffect(() => {
        localStorage.setItem("prices", JSON.stringify(prices));
    }, [prices]);

    useEffect(() => {
        if (!isAuctionActive) return;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev > 0) return prev - 1;
                setIsAuctionActive(false);
                return 0;
            });

            setTurnTime((prev) => {
                if (prev > 1) return prev - 1;
                passTurn();
                return 30;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isAuctionActive]);

    const passTurn = () => {
        setCurrentTurn((prev) => (prev + 1) % participants.length);
        setTurnTime(30);
    };

    const hasAccess = (index) => {
        if (isMainScreen) return true;
        if (index === currentTurn && turnTime > 0) return true;
        return false;
    };

    const updatePrice = (field, newValue, index) => {
        if (!hasAccess(index)) return;
        setPrices((prevPrices) => {
            const updatedPrices = [...prevPrices];
            updatedPrices[index][field] = newValue;
            return updatedPrices;
        });
    };

    const [selectedParticipant, setSelectedParticipant] = useState(0);

    return (
        <div>
            <h1>Администратор</h1>
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
                            <p>Статус торгов: {auctionStatus}</p>
                            <button onClick={startAuction}>Начать торги</button>
                            <button onClick={endAuction}>Завершить торги</button>

                            {isMainScreen && (
                                <div>
                                    <label>Выберите участника для редактирования: </label>
                                    <select onChange={(e) => setSelectedParticipant(e.target.value)}>
                                        {participants.map((participant, index) => (
                                            <option key={index} value={index}>
                                                {participant}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="timer">


                                <div className="timer-wrapper">
                                    <p>Общее оставшееся время:</p>
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
                                            {(isMainScreen || index === selectedParticipant) ? (
                                                <input
                                                    type="number"
                                                    value={price.cost}
                                                    onChange={(e) =>
                                                        updatePrice("cost", Number(e.target.value), index)
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
                                            {(isMainScreen || index === selectedParticipant) ? (
                                                <input
                                                    type="text"
                                                    value={price.quality}
                                                    onChange={(e) =>
                                                        updatePrice("quality", e.target.value, index)
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
                                            {(isMainScreen || index === selectedParticipant) ? (
                                                <input
                                                    type="text"
                                                    value={price.term}
                                                    onChange={(e) =>
                                                        updatePrice("term", e.target.value, index)
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
                                            {(isMainScreen || index === selectedParticipant) ? (
                                                <input
                                                    type="text"
                                                    value={price.warranty}
                                                    onChange={(e) =>
                                                        updatePrice("warranty", e.target.value, index)
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
                                            {(isMainScreen || index === selectedParticipant) ? (
                                                <input
                                                    type="text"
                                                    value={price.payment}
                                                    onChange={(e) =>
                                                        updatePrice("payment", e.target.value, index)
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
                                            {(isMainScreen || index === selectedParticipant) ? (
                                                <input
                                                    type="text"
                                                    value={price.additionalCost}
                                                    onChange={(e) =>
                                                        updatePrice("additionalCost", e.target.value, index)
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

        </div>
    );
}

export default Admin;
