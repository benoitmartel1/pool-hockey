<template>
  <li>
    <div class="position">{{ index + 1 }}</div>

    <div class="nom" v-if="user.prenom">
      {{ (user.type == 'coach' ? 'Coach ' : '') + user.prenom }}
    </div>
    <div v-else class="nom">
      {{ user.firstName + ' ' + user.lastName }}
      <div class="player-position">{{ formatPosition(user.position) }}</div>
    </div>

    <div class="goals">{{ user.stats.goals || 0 }}</div>
    <div class="assists">{{ user.stats.assists || 0 }}</div>
    <div class="plusMinus">{{ user.stats.plusMinus || 0 }}</div>
    <div class="shots">{{ user.stats.shots || 0 }}</div>
    <div class="wins">{{ user.stats.wins || 0 }}</div>
    <div class="shutouts">{{ user.stats.shutouts || 0 }}</div>
    <div class="saves">{{ user.stats.shotsAgainst || 0 }}</div>
    <div class="goalsAgainst">{{ user.stats.goalsAgainst || 0 }}</div>
    <div class="score">{{ Math.round(user.score) || 0 }}</div>
  </li>
</template>

<script>
export default {
  props: ['user', 'index'],
  methods: {
    formatPosition(pos) {
      if (pos == 'L' || pos == 'R') {
        pos = pos + 'W';
      }
      return pos;
    },
  },
};
</script>
<style></style>
