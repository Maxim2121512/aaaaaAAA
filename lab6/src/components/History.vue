<template>
    <NavigationMenu/>
    <div id="history">
        <div v-if="selectedStockLabel && selectedStockData">
            <h3>График акции {{ selectedStockLabel }}</h3>
            <Line :data="chartData" :options="chartOptions"/>
        </div>
    </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import NavigationMenu from "@/components/NavigationMenu.vue";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
export default {
    components: {NavigationMenu, Line},

    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: '',
                        backgroundColor: '#000000',
                        data: []
                    }
                ]
            },
            chartOptions: {
                responsive: true
            },
            selectedStockLabel: this.$route.params.label,
        }
    },

    computed: {
        selectedStockData() {
            return this.$store.state.historyPrices[this.selectedStockLabel];
        },

        selectedDates() {
            return this.$store.state.historyDates;
        },
    },

    watch: {
        selectedStockData: {
            handler: "updateData",
            immediate: true,
            deep: true
        },
        selectedDates: {
            handler: "updateDate",
            immediate: true,
            deep: true
        }
    },

    methods: {
        updateData() {
            console.log("updateData called");
            this.chartData = {
                labels: [...this.chartData.labels],
                datasets: [
                    {
                        label: '',
                        backgroundColor: '#000000',
                        data: [...this.selectedStockData]
                    }
                ]
            };
        },
        updateDate() {
            this.chartData.labels = [...this.selectedDates];
        }
    },

    mounted() {
        this.chartData = {
            labels: [...this.chartData.labels],
            datasets: [
                {
                    label: '',
                    backgroundColor: '#000000',
                    data: [...this.selectedStockData]
                }
            ]
        },
        this.chartOptions = {
            responsive: true
        },
        this.selectedStockLabel = this.$route.params.label
    }

};
</script>

<style>

</style>
