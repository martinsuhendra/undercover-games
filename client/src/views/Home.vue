<template>
  <div class="home">
    <div>
      <b-button
        class="lets-play animated infinite bounce delay-2s"
        v-if="play == false"
        @click.prevent="changePlay"
        variant="outline-danger"
      >Let's Play</b-button>
    </div>

    <b-form action v-if="play">
      <div>
        <b-row class="my-1">
          <b-col>
            <h3>Input Player Name :</h3>
            <b-form-input
              id="input-small"
              size="sm"
              placeholder="Enter your name"
              v-model="playerName"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
      <div style="color: #df0054">or</div>
      <b-row class="my-1">
        <b-form-input
          class="mb-3"
          id="input-small"
          size="sm"
          placeholder="Room Name"
          v-model="roomName"
        ></b-form-input>
        <div>
          <b-button type="submit" @click.prevent="createRoom">create room</b-button>
        </div>
      </b-row>
    </b-form>

    <div v-if="play">
      <div class="container mt-4" style="display: flex;">
        <div
          v-for="(room, index) in list"
          :key="index"
          style="background-color:white"
          class="py-2 px-2"
        >
          Room : {{room.id}}
          <button
            class="btn btn-success"
            type="submit"
            @click.prevent="joinRoom(room.id)"
          >join room</button>
          <div>
            <ul v-for="(player, index) in room.players" :key="index">
              <li>{{player.name}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import db from "@/fb";
import firebase from "firebase";
import "firebase/firestore";

export default {
  name: "home",
  data() {
    return {
      roomName: "",
      playerName: "",
      list: [],
      play: false
    };
  },
  components: {},

  watch: {
    list () {
      this.list.forEach(el => {
        console.log(el)
        if (el.players.length === 3) {
          el.players.forEach(player => {
            if (localStorage.getItem('name') === player) {
              this.$router.replace({ path: `/play` })
            }
          })
        }
      })
    }
  },


  created() {
    this.listRoom();
  },

  methods: {
    listRoom() {
      db
        .collection('rooms')
        .onSnapshot(querySnapshot => {
          this.list = [];
          querySnapshot.docs.forEach(el => {
            let obj = {
              id: el.id,
              players: []
            }
            el.ref.collection('players').onSnapshot(snapshot => {
              obj.players = []
              snapshot.docs.forEach(x => {
                obj.players.push({
                  id: x.id,
                  ...x.data()
                })
              })
            })
            this.list.push(obj)
          })
        })
    },
    createRoom() {
      db
        .collection('rooms')
        .doc(this.roomName)
        .set({
          isPlaying: false,
        })
        .then(() => {
          this.createPlayers()
        })
        .catch(err => {
          console.log(err)
        })
    },
    createPlayers() {
      db
        .collection('rooms')
        .doc(this.roomName)
        .collection("players").add({
           name: this.playerName,
           score: 0,
           isReady:false
         })
        .then(() => {
          localStorage.setItem('name', this.playerName)
          this.roomName = ''
          this.playerName = ''
          this.$router.push('/play')
        })
        .catch(err => {
          console.log(err)
        })


    },
    joinRoom(id) {
      db
        .collection('rooms')
        .doc(id)
        .collection("players").add({
           name: this.playerName,
           score: 0,
           isReady:false
         })
        .then(() => {
          localStorage.setItem('name', this.playerName)
          this.roomName = ''
          this.playerName = ''
          this.$router.push('/play')
        })
        .catch(err => {
          console.log(err)
        })
    },

    changePlay() {
      this.play = true;
    }
  }
};
</script>

<style scoped>
.home {
  background: url("https://images.unsplash.com/photo-1474926136673-20f4d627b833?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Pacifico", cursive;
  font-family: "Special Elite", cursive;
}

.lets-play {
  width: 300px;
  font-size: 40px;
}

h3 {
  font-size: 40px;
  color: #df0054;
}
</style>