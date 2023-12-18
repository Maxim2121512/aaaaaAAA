import {createStore} from "vuex";
import io from 'socket.io-client'
import createWebSocketPlugin from "@/store/webSocket.js";
import axios from "axios";
import createPersistedState from 'vuex-persistedstate'
const socket = io('http://localhost:5001', {
    transports: ['websocket']
});

const webSocketPlugin = createWebSocketPlugin(socket);

const store = createStore({
    state: {
        selectedUser: null,
        stocks: [],
        currentDate: null,
        historyDates: [],
        historyPrices: [],
        lots: null,
        lotsInited: false,
    },
    mutations: {
        setSelectedUser(state, user) {
            state.selectedUser = user;

        },

        setStocks(state, stocks) {
            state.stocks = stocks;

            if(!state.lotsInited) {
                this.commit('initLots');
                state.lotsInited = true;
            }

            state.stocks.forEach(stock => {
                if (state.historyPrices.hasOwnProperty(stock.label)) {
                    state.historyPrices[stock.label].push(stock.price);
                } else {
                    state.historyPrices[stock.label] = [];
                    state.historyPrices[stock.label].push(stock.price);
                }
            });
        },

        setCurrentDate(state, date) {
            state.currentDate = date;
            state.historyDates.push(state.currentDate);
        },

        initLots(state) {
            let id = state.selectedUser.userId;
            axios.get(`http://localhost:5000/api/broker-purchases/get/${id}`)
                .then(response => {
                    let lots = response.data;


                    const filteredLots = Object.keys(lots).filter(lotKey => state.stocks.some(stock => stock.label === lotKey));

                    state.lots = {};
                    filteredLots.forEach(lotKey => {
                        state.lots[lotKey] = lots[lotKey];
                    });

                    console.log(state.lots);

                })
                .catch(error => {
                    console.error(error);
                })
        },

        updateBalance(state, value) {
            let balance = parseFloat(state.selectedUser.cash);
            state.selectedUser.cash = (balance + value).toString();

            const data = {
                cash: (state.selectedUser.cash).toString()
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            const id = state.selectedUser.userId;
            axios.put(`http://localhost:5000/api/brokers/put/${id}`, data, config)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                })

        },

        addStock(state, {label, count}) {
            console.log(state.lots)
            if (state.lots.hasOwnProperty(label)) {
                let purchase = state.lots[label].purchases.find(stock => stock.date === state.currentDate);
                if (purchase === undefined) {
                    state.lots[label].purchases.push({
                        date: state.currentDate,
                        price: state.stocks.find(stock => stock.label=== label).price,
                        count: count.toString()
                    })
                } else {
                    let prevCount = parseInt(purchase.count);
                    state.lots[label].purchases.find(stock => stock.date === state.currentDate).count = (prevCount + count).toString();
                }

                let prevTotal = parseInt(state.lots[label].totalCount);
                state.lots[label].totalCount = (prevTotal + count).toString();
            } else {
                state.lots[label] = {};
                state.lots[label]["totalCount"] = count.toString();
                state.lots[label].lossProfit = "0";
                state.lots[label].purchases = [];
                state.lots[label].purchases.push({
                    date: state.currentDate,
                    price: state.stocks.find(stock => stock.label=== label).price,
                    count: count.toString()
                })
            }

            const id = state.selectedUser.userId;
            console.log(id);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            axios.put(`http://localhost:5000/api/broker-purchases/put/${id}`, state.lots, config)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                })
        },

        removeStock(state, {label, date, count, lossProfit, totalMoney}) {
            let stock = state.lots[label].purchases.find(stock => stock.date === date);

            if (stock.count > count ) {
                let prevCount = parseInt(state.lots[label].purchases.find(stock => stock.date === date).count);
                state.lots[label].purchases.find(stock => stock.date === date).count = (prevCount - count).toString();
            } else {
                let idx = state.lots[label].purchases.findIndex(stock=> stock.date === date);
                state.lots[label].purchases.splice(idx, 1);
            }

            let prevTotal = parseFloat(state.lots[label].totalCount);
            state.lots[label].totalCount = (prevTotal - count).toString();

            let prevCash = parseFloat(state.selectedUser.cash);
            state.selectedUser.cash = (prevCash + count * totalMoney).toString();
            let prevLossProfit = parseFloat(state.lots[label].lossProfit);
            state.lots[label].lossProfit = (prevLossProfit + lossProfit * count).toString();

            const id = state.selectedUser.userId;

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            axios.put(`http://localhost:5000/api/broker-purchases/put/${id}`, state.lots, config)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.error(error);
                })

        },
        stopTrading(state) {
            state.stocks =  []
            state.currentDate = null
            state.historyDates = []
            state.historyPrices = []
            state.lots = null
            state.lotsInited = false;

        },

        outOfProfile(state) {
            state.stocks =  []
            state.currentDate = null
            state.lots = null
            state.lotsInited = false;
        }

    },
    actions: {
        updateDate({commit}, data) {
            commit('setCurrentDate', data);
        },
        updateStocks({commit}, data) {
            commit('setStocks', data);
        },
        stop({commit}) {
            commit('stopTrading');
        }
    },
    plugins: [
        webSocketPlugin,
        createPersistedState(),
    ]
});

export default store;