<template>
    <div id="login">
        <p id="getUser">Выберите пользователя</p>
        <select id="userSelect" v-model="selectedUser">
            <option v-for="user in users" :key="user.userId" :value="user">{{user.username}}</option>
        </select>
        <button @click="onConfirmClick" id="loginButton">Войти</button>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                users: [],
                selectedUser: null,
            };
        },


        mounted() {
            axios.get('http://localhost:5000/api/brokers/get/all')
                .then(response => {
                    this.users =  response.data;
                })
                .catch(error => {
                    console.error('Ошибка при запросе данных', error);
                })
        },

        methods: {
            onConfirmClick() {
                if (this.selectedUser) {
                    console.log(this.selectedUser);
                    this.$store.commit('setSelectedUser', this.selectedUser);
                    this.$store.commit('initLots');
                    this.$router.push({name: 'market'});
                }
            }
        }
    };
</script>


<style scoped>
#login {
    display: flex;
    font-family: Arial;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
}

#userSelect {
    margin-bottom: 20px;
    padding: 5px 50px;
}

#loginButton {
    background-color: #3498db;
    color: #ffffff;
    border: none;
    padding: 20px 50px;
    cursor: pointer;
}

#loginButton:hover {
    background-color: #2980b9;
}

#getUser {
    margin-bottom: 30px;
    font-size: 30px
}
</style>
