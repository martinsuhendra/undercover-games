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
  mounted() {
    let audio = new Audio('https://00e9e64bac2928d02f318783502f50f6d41259e6529286c13e-apidata.googleusercontent.com/download/storage/v1/b/e-commercemartinsuhendra/o/thunder_strike_2-Mike_Koenig-2099467696.wav?qk=AD5uMEvhbtIToYiGIKnuijKxHgPHPSV1qDr6fx_LpCLlT4NTz98AfQUY14rP73MQRjMJzse_b5NF1Y-xhv-9jg9bm66kkj_Wv0IQuDMNYtJBZSePSBEDth-DxMV6wFHnZlwkcxIpGzqr_uA9uus0IVD2yAiblvSy5pMvtRfEFFhU8nRvUNTNSRVfpNXby1jjyDsYGwLinAtIkoXtKitjZT-QE6tx3u2pEowgOuNHekxCBmC-amd0hN44JYCbLv239JdjDO3oIjRjrz-0sC3pz2cEGCLXN11utcYKii4F42tFADL78Fbz6IW7jutymhGq0z-rwYy0xPNgkD4_ipcXG1C53QLRDakcUW8S6K0tPxeIPqGiEd2veLv0YH5dFwef-8hhvwSrT2P1CF00nDNKLa8lLub_KMhE5FSBKmo5A_Bjfsv9Hl2xOnb8FS8kvGoweOKnixaXikh41fDHr8Zy3lTLhQcE_k4g0Nmel_4g-Tpjdkr6D55UgSwwnQU88N8fT8YIVYzs_lPrXxslvvUfShjXZjVxpCniOlUAVMrXciTy40h19Q_5c16-bnFd9kgJGMWLszJwFS2tpuZRp4ooaF_dkYPTcecKO8oMP33Qzgs97oo-C2WWQ140rqyP4_EHyTD7CEExrN-rxIjtny0OcOK0TnSSYP6S0nDQgBqIXi3H5aNx3wJen8ejFleQc9ZdW6yHBKqBVzFQ-AepIiNo54k-L8i4dWlx6tYuoCEFw35EFFxsOxncV9efmbpRrfvQ_iNgYK8si-8QS19mC42GxiNl8PvdqX1T_nW2Hq8mY7bEmaFkwik50X4ePCWjGp5nvSgXQFmUSW30')
    audio.play()
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
      let payload = {
        room: this.roomName,
        name: this.playerName
      }
      this.$store.commit("setRoom", this.roomName)
      this.$store.dispatch("addPlayerToRoom", payload)
       
      this.$router.push('/play')
    },
    joinRoom(id) {
      let payload = {
        room: id,
        name: this.playerName
      }
      this.$store.commit("setRoom", id)
      this.$store.dispatch("addPlayerToRoom", payload)
       this.$store.dispatch("listenToPlayers")
      this.$router.push('/play')
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