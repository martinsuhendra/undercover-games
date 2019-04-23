<template>
  <b-container>
    <b-row v-if="isPlaying">
      <b-col>{{firstNumber}}</b-col>
      <b-col>+</b-col>
      <b-col>{{secondNumber}}</b-col>
    </b-row>
    <img v-if="myWinnerStatus" src="https://thumbs.gfycat.com/VapidRecklessGalapagosmockingbird-size_restricted.gif" alt="">
    <h1 v-else-if="myWinnerStatus == false">You Lose!!!</h1>
    <video
      @ended="videoEnded"
      src="https://storage.googleapis.com/e-commercemartinsuhendra/ghost.mov"
      v-if="ghost"
      autoplay
      id="jumpscare"
    ></video>

    <div class="card mt-5">
      <b-row class="py-3 px-3">
        <b-card
          :header="myName"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          footer="Tes Koran"
          footer-tag="footer"
          footer-bg-variant="success"
          footer-border-variant="dark"
          title="Point"
          style="max-width: 15rem;"
          :key="myDocId"
        >
          <b-card-text>{{myScore}}</b-card-text>
        </b-card>

        <b-card
          :header="otherPlayer.name"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          footer="Tes Koran"
          footer-tag="footer"
          footer-bg-variant="success"
          footer-border-variant="dark"
          title="Point"
          style="max-width: 15rem;"
          v-for="(otherPlayer, index) in $store.state.players"
          :key="index"
        >
          <b-card-text>{{otherPlayer.score}}</b-card-text>
        </b-card>
      </b-row>
    </div>
    <div>
    <Chat style="margin-bottom: 50px;" />
    </div>
  </b-container>
</template>

<script>
import random from "@/helpers/randomNumber";
import { mapState } from "vuex";
import db from "@/fb";
import Chat from '@/components/Chat.vue'

export default {
  data() {
    return {
      firstNumber: 0,
      secondNumber: 0,
      result: 0,
      ready: false,
      ghost: false
    };
  },

  components: {
    Chat
  },

  methods: {
    videoEnded() {
      this.ghost = false;
    },
    generateSoal() {
      this.firstNumber = random();
      this.secondNumber = random();
      this.result = this.solution(this.firstNumber, this.secondNumber);
    },
    solution(x, y) {
      return (x + y) % 10;
    }
  },
  computed: {
    ...mapState([
      "myIsReady",
      "myName",
      "myScore",
      "myDocId",
      "room",
      "isPlaying",
      "myWinnerStatus"
    ])
  },
  created() {
    this.generateSoal();
    window.addEventListener("keydown", e => {
      if (e.keyCode >= 48 && e.keyCode < 58 && this.isPlaying) {
        let answer = 0;
        switch (e.keyCode) {
          case 48:
            answer = 0;
            break;
          case 49:
            answer = 1;
            break;
          case 50:
            answer = 2;
            break;
          case 51:
            answer = 3;
            break;
          case 52:
            answer = 4;
            break;
          case 53:
            answer = 5;
            break;
          case 54:
            answer = 6;
            break;
          case 55:
            answer = 7;
            break;
          case 56:
            answer = 8;
            break;
          case 57:
            answer = 9;
            break;
        }
        if (answer === this.result) {
          db.collection("rooms")
            .doc(this.room)
            .collection("players")
            .doc(this.myDocId)
            .update({
              score: this.myScore + 1
            });
          if (this.myScore + 1 === 20) {
            //update
            db.collection("rooms")
              .doc(this.room)
              .update({
                isPlaying: false
              });
          }
        } else {
          this.ghost = true;
        }
        this.generateSoal();
      }
    });
  }
};
</script>

<style scoped>
.col {
  max-width: 10%;
  font-family: "Pacifico", cursive;
  font-family: "Abril Fatface", cursive;
  font-size: 70px;
}

.row {
  display: flex;
  justify-content: center;
}

#jumpscare {
  position: fixed;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: 100;
    -ms-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);

    background-size: cover;
}
</style>
