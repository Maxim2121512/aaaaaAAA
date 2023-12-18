<template>
    <div id="navBar">
        <button @click="redirectToTraiding">Торговля</button>
        <button @click="redirectToAdmin">Все пользователи</button>
        <button @click="exit">Выйти</button>
    </div>
</template>

<script>
    export default {
        methods: {
            redirectToTraiding() {
                this.$router.push('/market');
            },
            redirectToAdmin() {
                this.$router.push('/admin');
            },
            exit() {
                this.$store.commit('outOfProfile');
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>
#navBar {
    display: flex;
    justify-content: space-around;
    background-color: #3498db;
    padding: 10px;
}

#navBar button {
    background-color: #2ecc71;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}

#navBar button:hover {
    background-color: #27ae60;
}
</style>
