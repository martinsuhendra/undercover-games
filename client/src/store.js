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
    canDecideWinner:false,
    isFirstTime:true,
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
    },
    setWinnerStatus(state, payload){
      state.myWinnerStatus = payload
    }
  },
  actions: {
    addPlayerToRoom(context, payload){
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
            if(context.state.isFirstTime){
              context.dispatch("listenToPlayers")
              context.dispatch("listenToRoom")   
              context.state.isFirstTime = false
            }
                
        });
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    },
    listenToPlayers(context){
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
              db
              .collection("rooms").doc(context.state.room)
              .update({
                isPlaying:true
              })
              .then(()=>{
                context.commit("setCanDecided", true)
              })
              
            }
          }
        });
    },
    listenToRoom(context){
      db
        .collection("rooms").doc(context.state.room)
        .onSnapshot(function(doc){
            console.log(doc.data());
            context.commit("setIsPlaying", doc.data().isPlaying)
            if(!doc.data().isPlaying && context.state.canDecideWinner){
              if(context.state.myScore < 20){
                context.commit('setWinnerStatus',false)
              }else{
                context.commit('setWinnerStatus',true)
              }
              context.state.canDecideWinner = false;
            }
        })
    }
    
  }
})
