<template>
  <div class="page">
    <h2 class="top">
      <div>{{ user.prenom }}</div>
      <div>{{ index + 1 + (index > 0 ? 'e' : 'er') }}</div>

      <div>{{ Math.round(user.score) + ' pts' }}</div>
    </h2>

    <div id="tgv">
      <Header />
    </div>
    <ul class="players">
      <Player
        v-for="(p, index) in sortedPlayers"
        :key="p.player_id"
        :index="index"
        :user="p"
      />
    </ul>
  </div>
</template>

<script setup>
const route = useRoute();
const mainStore = useMainStore();

const user = mainStore.users.find((u) => u.user_id == route.params.id);
const index = mainStore.users.findIndex((u) => u.user_id == route.params.id);

const players = user.players.map((up) => {
  return mainStore.players.find((p) => p.player_id == up.player_id);
});
const sortedPlayers = players.sort((b, a) => b.round - a.round);
</script>
<style>
h2 {
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  padding: 0 20px 0 20px;
}
@media print {
  .stats div {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 50px !important;
  }
}
</style>
