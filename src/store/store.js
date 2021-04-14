import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {}
    },
    mutations: {
        saveUser(state, user) {
            state.user = user;
        },
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getName(state) {
            if (state.user == undefined) {
                state.user = {};
                state.user.roles = []
            }
            if (localStorage.getItem('local') != "zh") {
                return state.user.englishname;
            } else {
                return state.user.name;
            }
        },
        isResearcher(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "01") {
                    return true;
                }
            }
            return false;
        },
        isFeeder(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "02") {
                    return true;
                }
            }
            return false;
        },
        isReviewer(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999"
                    || role.roletype == "40") {
                    return true;
                }
            }
            return false;
        },
        isAdmin(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999") {
                    return true;
                }
            }
            return false;
        },
        isBioAna(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "34") {
                    return true;
                }
            }
            return false;
        },
        isVector(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999") {
                    return true;
                }
            }
            if (state.user.group.groupname == "载体工程中心") {
                return true;
            }
            return false;
        },
        isGroupAdmin(state) {
            if (state.user.group.groupadmin == state.user.id) {
                return true;
            }
        },
        isOther(state) {
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "09") {
                    return true;
                }
            }
            return false;
        },
        isCurrentUser: (state) => (id) => {
            if (state.user.id == id) {
                return true;
            }
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999") {
                    return true;
                }
            }
            return false;
        },
        isCurrentUserByName: (state) => (name) => {
            if (state.user.name == name) {
                return true;
            }
            for (var i = 0; i < state.user.roles.length; i++) {
                var role = state.user.roles[i];
                if (role.roletype == "999999") {
                    return true;
                }
            }
            return false;
        },
    }
})