<template>
  <div class="stats">
    <div class="goals">{{ user.stats.goals || 0 }}</div>
    <div class="assists">{{ user.stats.assists || 0 }}</div>
    <div class="plusMinus">{{ user.stats.plusMinus || 0 }}</div>
    <div class="shots">{{ user.stats.shots || 0 }}</div>
    <div class="wins">{{ user.stats.wins || 0 }}</div>
    <div class="shutouts">{{ user.stats.shutouts || 0 }}</div>
    <div class="saves">{{ user.stats.shotsAgainst || 0 }}</div>
    <div class="goalsAgainst">{{ user.stats.goalsAgainst || 0 }}</div>
    <div class="score">{{ Math.round(user.score) || 0 }}</div>
  </div>
</template>

<script>
export default {
  props: ['user'],
};
</script>
<style>
.stats {
  height: 100%;
}
.stats div {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
}
</style>
