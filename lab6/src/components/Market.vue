<template>
    <div id="market">
        <NavigationMenu/>
        <div id="userInfo" v-if="selectedUser">
            <p>Информация о пользователе</p>
            <p>id: {{selectedUser.userId}}</p>
            <p>Имя: {{selectedUser.username}}</p>
            <p id="balance">Количество средств: {{selectedUser.cash}}</p>
        </div>
        <div id="stocks" v-if="getCurrentDate && getStocks.length !== 0">
            <p id="currentDate">Текущая дата: {{getCurrentDate}}</p>
            <table>
                <thead>
                    <tr>
                        <th>Идентификатор</th>
                        <th>Цена</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="stock in getStocks" :key="stock.label">
                        <td>{{stock.label}}</td>
                        <td>{{stock.price}}</td>
                        <td><button @click="openHistory(stock.label)">График</button></td>
                        <td><button :id="'buyStock' + stock.label" @click="buyStock(stock.label)" id="buyStock">Купить</button></td>
                        <td><input :id="'countBuy' + stock.label" type="number"  v-model.number="stockQuantities[stock.label]" @input="checkMin(stock.label)" min="1" ></td>
                    </tr>
                </tbody>
            </table>

            <div id="lots">
                <h1>Покупки</h1>
                <div id="lots-content" v-for="(stock, stockKey) in getLots" :key="stockKey">
                    <p>Акция: {{stockKey}}</p>
                    <p>Количество: {{stock.totalCount}}</p>
                    <p>Общая Прибыль/Убыток: {{stock.lossProfit}}</p>
                    <ul>
                        <li v-for="(purchase, index) in stock.purchases" :key="index">
                            <p>Дата покупки: {{purchase.date}}</p>
                            <p>Цена: {{purchase.price}}</p>
                            <p>Прибыль/Убыток: {{(parseFloat(getStockPrice(stockKey)) - parseFloat(purchase.price)) * purchase.count}}</p>
                            <p>Количество: {{purchase.count}}</p>
                            <input type="number" value="1" v-model.number="stockSellQuantities[stockKey + purchase.date]" @input="checkMin(stockKey + purchase.data)" min="1">
                            <button @click="sellStock(stockKey, purchase.date, stockSellQuantities[stockKey + purchase.date], parseFloat(getStockPrice(stockKey)) - parseFloat(purchase.price), parseFloat(getStockPrice(stockKey)))">Продать</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Торги завершены!</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import NavigationMenu from "@/components/NavigationMenu.vue";
    export default {
        components: {NavigationMenu},
        data(){
            return {
                stockQuantities: {},
                stockSellQuantities: {}
            };
        },
        computed: {
            selectedUser() {
                return this.$store.state.selectedUser;
            },

            getStocks() {
                return this.$store.state.stocks;
            },

            getCurrentDate() {
                return this.$store.state.currentDate;
            },
            getLots() {
                return this.$store.state.lots;
            }
        },

        methods: {
            openHistory(label) {
                this.$router.push(`history/${label}`);
            },
            buyStock(label) {
                if (!this.stockQuantities[label]) {
                    alert("Введите значение!")
                } else {
                    let stock = this.$store.state.stocks.find(stock => stock.label === label);
                    let totalPrice = stock.price * this.stockQuantities[label]
                    if (totalPrice > this.$store.state.selectedUser.cash) {
                        alert("Недостаточно средств");
                    } else {
                        this.$store.commit('updateBalance', -1*totalPrice);
                        this.$store.commit('addStock', {label, count: this.stockQuantities[label]});
                    }
                }

            },
            sellStock(label, date, count, lossProfit, totalMoney) {
                if (!this.stockSellQuantities[label + date]) {
                    alert("Введите значение!");
                } else {
                    if (this.$store.state.lots[label].purchases.find(stock => stock.date === date).count < this.stockSellQuantities[label + date]) {
                        alert("Вы не можете продать больше, чем имеете");
                    } else {
                        this.$store.commit('removeStock', {label, date, count, lossProfit, totalMoney});
                    }
                }
            },

            checkMin(label) {
                if (this.stockQuantities[label] < 1) {
                    this.stockQuantities[label] = 1;
                } else {
                    let totalProfit = 0;
                }
            },

            getStockPrice(label){
                return this.$store.state.stocks.find(stock => stock.label === label).price
            },
        }
    }
</script>

<style scoped>
#market {
    font-family: Arial;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#userInfo {
    margin-top: 20px;
    border: 1px solid black;
    padding: 5px;
}

#userInfo p {
    margin: 5px 0;
}

#stocks table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

#lots-content {
    border: 1px solid black;
    padding: 10px;
    margin-bottom: 10px;
}
#lots-content ul {
    border-top: 1px solid black;
}
#lots-content li {
    border: 1px solid black;
    margin: 10px;
    padding: 5px;
}

#stocks th, #stocks td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

#stocks th {
    background-color: #3498db;
    color: #ffffff;
}

#lots h1 {
    color: #3498db;
    margin-top: 20px;
}

#lots p {
    margin: 5px 0;
}

#lots ul {
    list-style: none;

}

#lots input {
    margin-right: 10px;
}

button {
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}

button:hover {
    background-color: #c0392b;
}
</style>
