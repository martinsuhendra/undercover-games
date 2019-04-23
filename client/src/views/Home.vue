<template>
  <div class="home">
    <div>
      <b-button
        class="lets-play animated infinite bounce delay-2s"
        v-if="play == false"
        @click="changePlay"
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
            @click="joinRoom(room.id)"
          >join room</button>
          <div>
            <ul v-for="(player, index) in room.players" :key="index">
              <li>{{player}}</li>
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
  created() {
    this.listRoom();
  },

  methods: {
    listRoom() {
      db.collection("rooms")
        .get()
        .then(querySnapshot => {
          this.list = querySnapshot.docs.map(el => {
            return {
              id: el.id,
              ...el.data()
            };
          });
        });
    },

    createRoom() {
      db.collection("rooms")
        .doc(this.roomName)
        .set({
          players: []
        })
        .then(docRef => {
          this.listRoom();
        })
        .catch(err => {
          console.log(err);
        });
    },

    joinRoom(id) {
      db.collection("rooms")
        .doc(id)
        .update({
          players: firebase.firestore.FieldValue.arrayUnion(this.playerName)
        })
        .then(() => {
          this.listRoom();
        });
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