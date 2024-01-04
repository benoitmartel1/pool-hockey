<template>
  <li>
    <div class="infos">
      <div class="position">
        {{ user.round }}
      </div>
      <div>
        <img :src="user.teamLogo" alt="" />
      </div>
      <!-- <div class="headshot">
        <img :src="user.headShot" alt="" />
      </div> -->
      <div class="nom">
        {{ user.firstName + ' ' + user.lastName }}
        <div class="player-position">{{ formatPosition(user.position) }}</div>
      </div>
    </div>
    <Stats :user="user" />
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
<style>
img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
