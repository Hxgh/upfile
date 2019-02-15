export default {
    namespaced: true,
    state: {
        token: '',
    },
    getters: {
        showToken(state) {
            return state.token
        },
    },
    mutations: {
        set(state,token) {
            state.token = token;
        },
        remove(state){
            state.token = '';
        }
    },
    actions: {
        setToken(context) {
            context.commit('set');
        },
        removeToken(context) {
            context.commit('remove');
        }
    }
}