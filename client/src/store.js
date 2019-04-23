import Vue from 'vue'
import Vuex from 'vuex'
import db from '@/fb'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    room:"",
    myDocId:"",
    myName:"",
    myScore:"",
    myIsReady:"",
    myWinnerStatus:null,
    isPlaying:false,
    isGameOver:false,
    isProcessAdd:false,
    canDecideWinner:false,
    players:[]
  },
  mutations: {
    setRoom(state,payload){
      state.room = payload
    },
    setMyDocId(state,payload){
      state.myDocId = payload
    },
    setMyName(state,payload){
      state.myName=payload
    },
    setMyScore(state,payload){
      state.myScore = payload
    },
    setMyIsReady(state,payload){
      state.myIsReady = payload
    },
    setPlayers(state,payload){
      state.players = payload
    },
    setIsPlaying(state,payload){
      state.isPlaying = payload
    },
    setCanDecided(state,payload){
      state.canDecideWinner = payload
    }
  },
  actions: {
    addPlayerToRoom(context, payload){
      context.state.isProcessAdd = true;
      db
      .collection("rooms").doc(payload.room)
      .collection("players").add({
        name: payload.name,
        score: 0,
        isReady:false
      })
      .then(function(docRef) {
         context.commit("setMyDocId", docRef.id)
          db
          .collection("rooms").doc(context.state.room)
          .collection("players").doc(docRef.id)
          .onSnapshot(function(doc) {
            context.commit("setMyName",doc.data().name)
            context.commit("setMyScore", doc.data().score)
            context.commit("setMyIsReady", doc.data().isReady)
            context.dispatch("listenToPlayers")
            context.dispatch("listenToRoom")             
        });
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    },
    listenToPlayers(context){
      if(context.state.isProcessAdd){

        context.state.isProcessAdd = false
        return
      }
      db
        .collection("rooms").doc(context.state.room).collection("players")
        .onSnapshot(function(querySnapshot) {
          var playerArray = [];
          let allReady = false;
          querySnapshot.forEach(function(doc) {
        
            if(doc.id !== context.state.myDocId){
              playerArray.push(doc.data());
            }
              
          });
          
          context.commit("setPlayers", playerArray)
          if(!context.state.isGameOver && !context.state.isPlaying){
            if(playerArray.length === 2){
              context.commit("setIsPlaying",true)
              // db
              // .collection("rooms").doc(context.state.room)
              // .update({
              //   isPlaying:true
              // })
            }
          }
        });
    },
    listenToRoom(context){
      db
        .collection("rooms").doc(context.state.room)
        .onSnapshot(function(doc){
            context.commit("setIsPlaying", doc.data().isPlaying)
            context.commit("setCanDecided", true)
            if(!doc.data().isPlaying && context.state.canDecideWinner){
              if(context.state.myScore < 20){
                //anda kalah
                //ubah stat
                alert("anda kalah")
              }else{
                alert("anda menang")
              }
            }
        })
    }
    
  }
})
