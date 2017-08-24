<template>
	<div>
		<div v-if="!joined" class="text-center">
			<form @submit.prevent>
				<button @click="setRoom('Cool Room')">Cool Room</button>
				<button @click="setRoom('Rad Room')">Rad Room</button>
				<!-- <button>Cool Room</button>
				<button>Cool Room</button> -->
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
						<a v-if="item.type === 'link'" rel="stylesheet" :href="item.message">{{item.message}}</a>
						<img v-else-if="item.type === 'image'" :src="item.message" alt="">
						<p v-else class="message"> {{ item.message }}</p>
					</div>
				</div>
			</div>
			<div class="text-center">
				<input type="text" max="12" class="form-control input-lg text-center" placeholder="Message" v-model="userMessage.message">
			</div>
			<div class="text-center">
				<button class="btn btn-primary btn-lg" type="button" @click="send">Send</button>
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
				roomName: '',
				name: '',
				userMessage: {
					message: '',
					type: 'message'
				}
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
			setRoom: function(room){
				this.roomName = room
				console.log(this.roomName)
			},
			join: function () {
				if (this.name) {
					this.$store.dispatch('setJoined', true);
					this.$socket.emit('join', {name:this.name, room:this.roomName});
				}
			},
			leave: function () {
				this.$store.dispatch('setJoined', false);
				this.$store.dispatch('clearMessages');
				this.$socket.emit('leave');
			},
			send: function (message) {
				var fileExtension = this.userMessage.message.substr((this.userMessage.message.lastIndexOf('.') + 1))
				var linkChecker = this.userMessage.message.includes("http" || "https")
				if (linkChecker == true) {
					this.userMessage.type = 'link';
				}
				if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'gif' || fileExtension === 'jpeg') {
					this.userMessage.type = 'image'
				}
				else { this.imageTag = false }
				if (this.userMessage) {
					this.$socket.emit('message', this.userMessage);
				}
				this.userMessage = {
					message: '',
					type: 'message'
				}
			},
			clear: function (data) {
				this.$store.dispatch('clearMessages');
			}
		},
		sockets: {
			user: function (name) {
				var data = { user: name, message: 'Has joined the chat.' };
				this.$store.dispatch('addMessage', data);
			},
			left: function (name) {
				var data = { user: name, message: "has left the chat." };
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
		max-height: 500px;
		overflow-y: auto;
		overflow-x: hidden;
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