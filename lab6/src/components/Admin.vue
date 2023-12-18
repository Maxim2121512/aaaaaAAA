<template>
    <NavigationMenu/>
    <div id="userInfo">
        <div id="user" v-for="user in users" :key="user.userId">
            <p>Имя: {{user.username}}</p>
            <p>Количество средств: {{user.cash}}</p>

            <div id="stocks" v-if="usersPurchases.hasOwnProperty(user.userId)">
                <table>
                    <thead>
                    <tr>
                        <th>Акция</th>
                        <th>Прибыль/Убыток</th>
                        <th>Общее количество</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(stockInfo, stockSymbol) in usersPurchases[user.userId]" :key="stockSymbol">
                        <th>{{stockSymbol}}</th>
                        <th>{{stockInfo.lossProfit}}</th>
                        <th>{{stockInfo.totalCount}}</th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>Брокер не совершал никаких действий</p>
            </div>
        </div>
    </div>
</template>

<script>

    import axios from "axios";
    import NavigationMenu from "@/components/NavigationMenu.vue";

    export default {
        components: {NavigationMenu},
        data() {
            return {
                users: [],
                usersPurchases: {},
            }
        },

        mounted() {
            axios.get('http://localhost:5000/api/brokers/get/all')
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.error('Ошибка при запросе данных', error);
                })

            axios.get('http://localhost:5000/api/broker-purchases/get/all')
                .then(response => {
                    this.usersPurchases = response.data;
                    console.log(this.usersPurchases);
                })
                .catch(error => {
                    console.error('Ошибка при запросе данных', error);
                })
        }
    }


</script>

<style scoped>
#userInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#user {
    margin: 20px 0;
}

#stocks table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
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
</style>
