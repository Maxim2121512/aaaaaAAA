<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Market from "@/components/Market.vue";

export default {
    components: {
        Market,
        Login,
        History,

    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;

}
</style>
