import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	joined: false,
	name: '',
	messages: []
};

const mutations = {
	setJoined(state, payload) {
		state.joined = payload;
	},
	addMessage(state, payload) {
		state.messages.push(payload);
	}
};

const actions = {
	setJoined({ commit, state }, payload) {
		commit('setJoined', payload);
	},
	addMessage({ commit, state }, payload) {
		commit('addMessage', payload);
	}
};

const getters = {
	messages: (state) => {
		return state.messages;
	}
};

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
    strict: true
});