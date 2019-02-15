export default {
    namespaced: true,
    state: {
        showMenu: true,
    },
    getters: {
        isShowMenu(state) {
            return state.showMenu
        },
    },
    mutations: {
        show(state) {
            state.showMenu = true;
        },
        hide(state) {
            state.showMenu = false;
        }
    },
    actions: {
        hideMenu(context) {
            context.commit('hide');
        },
        showMenu(context) {
            context.commit('show');
        }
    }
}