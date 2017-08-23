<template>
	<div>
		<div v-if="!joined" class="text-center">
			<form>
				<div class="form-group">
					<input type="text" max="12" class="form-control input-lg text-center" placeholder="Name" v-model="name">
				</div>
				<button class="btn btn-primary btn-lg" type="button" @click="join">Join Chat</button>
			</form>
		</div>
		<div v-if="joined">
			<div class="chat">
				<div class="row" v-for="item in messages">
					<div class="col-sm-2 text-right">
						<span class="name">{{ item.user }}</span>
					</div>
					<div class="col-sm-10">
						<span class="message">{{ item.message }}</span>
					</div>
				</div>
			</div>
			<div class="text-center">
				<button class="btn btn-primary btn-lg" type="button" @click="leave">Leave Chat</button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		name: 'app',
		data: function () {
			return {
				name: ''
			}
		},
		computed: mapState({
			joined(state) {
				return state.joined;
			},
			messages(state) {
				return state.messages;
			}
		}),
		methods: {
			join: function () {
				if (this.name) {
					this.$store.dispatch('setJoined', true);
					this.$socket.emit('join', this.name);
				}
			},
			leave: function () {

			},
			send: function (message) {
				if (message) {
					this.$socket.emit('message', message);
				}
			}
		},
		sockets: {
			user: function (name) {
				var data = { user: name, message: 'Has joined the chat.' };
				this.$store.dispatch('addMessage', data);
			},
			message: function (data) {
				this.$store.dispatch('addMessage', data);
			}
		}
	}

</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}

	h1,
	h2 {
		font-weight: normal;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}

	.chat {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 10px;
		margin-bottom: 10px;
	}

	.name {
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.message {
		border-radius: 5px !important;
		background: #E0EDFF;
		padding: 5px 12px;
		font-size: 15px;
	}
</style>