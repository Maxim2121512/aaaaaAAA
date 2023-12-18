export default function createWebSocketPlugin(socket) {
    return (store) => {
        socket.on('updateDate', data => {
            store.dispatch('updateDate', data);
        });

        socket.on('updatePrices', data => {
            store.dispatch('updateStocks', data);
        });

        socket.on('stop', () => {
            store.dispatch('stop');
        })
    }
}