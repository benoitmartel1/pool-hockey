<template>
  <li>
    <div class="position">{{ index + 1 }}</div>
    <div class="nom" v-if="user.prenom">
      {{ (user.type == 'coach' ? 'Coach ' : '') + user.prenom }}
    </div>
    <Stats :user="user" />
  </li>
</template>

<script>
export default {
  props: ['user', 'index'],
};
</script>
<style></style>
