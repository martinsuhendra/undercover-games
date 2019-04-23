<template>
  <b-container>
    <b-row>
      <b-col>{{firstNumber}}</b-col>
      <b-col>+</b-col>
      <b-col>{{secondNumber}}</b-col>
    </b-row>

  <b-button variant="outline-warning" @click="ghost = true">show Ghost!</b-button>
  <video @ended = "videoEnded" src="https://storage.cloud.google.com/e-commercemartinsuhendra/ghost.mov?_ga=2.222143516.-560635594.1554268415"  v-if="ghost" autoplay></video>
    <div class="card mt-5">
      <b-row class="py-3 px-3">
        <b-card
          header="Player name"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          footer="Score :"
          footer-tag="footer"
          footer-bg-variant="success"
          footer-border-variant="dark"
          title="Point"
          style="max-width: 15rem;"
         
        >
          <b-card-text>point here</b-card-text>
          <b-button variant="outline-warning" v-if="!ready" @click="ready = true">Not Ready!</b-button>
          <b-button variant="outline-warning" v-else disabled>Ready!</b-button>
        </b-card>
        <b-card
          header="Player name"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          footer="Score :"
          footer-tag="footer"
          footer-bg-variant="success"
          footer-border-variant="dark"
          title="Point"
          style="max-width: 15rem;"
          :key="index"
          v-for="(i, index) in 4"
        >
          <b-card-text>point here</b-card-text>

          <b-button variant="outline-warning" disabled>Ready!</b-button>
        </b-card>
      </b-row>
      <b-button type="submit" @click.prevent="generateNumber">Generate</b-button>
    </div>
<div></div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      firstNumber: 3,
      secondNumber: 5,
      result: 5,
      ready: false,
      ghost : false
    };
  },
  methods: {
    videoEnded() {
      this.ghost = false
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    },
    generateNumber() {
      this.firstNumber = this.getRandomInt(0, 9);
      this.secondNumber = this.getRandomInt(0, 9);
      this.result = this.firstNumber + this.secondNumber;
    },
  },

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

</style>
