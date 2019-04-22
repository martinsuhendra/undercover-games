<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h3>ini player name yaaa</h3>
    <input type="text" v-model="playerName">
    <br>
    <br>
    <br>
    <input type="text" v-model="roomName">
    <button type="submit" @click.prevent="createRoom">create room</button>
    <div v-for="(room, index) in list" :key="index">
      {{room.id}}
      <button type="submit" @click="joinRoom(room.id)">join room</button>
      <div >
        <ul v-for="(player, index) in room.players" :key="index">
          <li>{{player}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import db from '@/fb'
import firebase from 'firebase'
import 'firebase/firestore'

export default {
  name: 'home',
  data() {
    return {
      roomName: '',
      playerName: '',
      list: []
    }
  },
  components: {
  },
  created () {
    this.listRoom()
  },

  methods: {
    listRoom() {
      db
      .collection('rooms')
      .get()
      .then(querySnapshot => {
        this.list = querySnapshot.docs.map(el => {
          return {
            id: el.id,
            ...el.data()
          }
        })
      })
    },

    createRoom() {
      db
        .collection('rooms')
        .doc(this.roomName)
        .set({
          players: []
        })
        .then(docRef => {
          this.listRoom()
        })
        .catch(err => {
          console.log(err)
        })
    },

    joinRoom(id) {
      db
        .collection('rooms')
        .doc(id)
        .update({
          players: firebase.firestore.FieldValue.arrayUnion(this.playerName)
        })
        .then(() => {
          this.listRoom()
        })
    }
  }
}
</script>
