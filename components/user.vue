<template>
  <li>
    <div class="position">{{ index + 1 }}</div>
    <div class="nom">
      {{ (user.type == 'coach' ? 'Coach ' : '') + user.prenom }}
    </div>
    <div class="goals">{{ user.userStats.goals }}</div>
    <div class="assists">{{ user.userStats.assists }}</div>
    <div class="plusMinus">{{ user.userStats.plusMinus }}</div>
    <div class="shots">{{ user.userStats.shots }}</div>
    <div class="wins">{{ user.userStats.wins }}</div>
    <div class="shutouts">{{ user.userStats.shutouts }}</div>
    <div class="saves">{{ user.userStats.shotsAgainst }}</div>
    <div class="goalsAgainst">{{ user.userStats.goalsAgainst }}</div>
    <div class="score">{{ Math.round(user.score) }}</div>
    <!-- <ul class="players">
            <li v-for="(p, index) in u.players" :key="index + 'p'">
              {{ getPlayerName(p.player_id) }}
            </li>
          </ul> -->

    <!-- <div v-for="p in user.players" :key="p">
      {{ p }}
    </div> -->
  </li>
</template>

<script>
export default {
  props: ['user', 'index'],
};
</script>
