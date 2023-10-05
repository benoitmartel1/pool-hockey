<template>
  <div>
    <div v-if="!$fetchState.pending">
      <div v-for="(p, index) in players" :key="index + 'p'">
        {{ p.fullName }}
      </div>
      <div v-for="(u, index) in users" :key="index + 'u'">
        {{ u.nom }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [],
      users: [],
    };
  },

  async fetch() {
    this.users = await this.$db
      .from("pool_users")
      .select("*")
      .then((res) => {
        console.log(res);
        return res.data;
      });
    this.players = await this.$db
      .from("pool_players")
      .select("*")
      .then(async (res) => {
        // res.data.forEach((player) => {
        //   let res = this.$axios.get("people/" + player.nhl_id).then((res) => {
        //     player.fullName = res.data.people[0].fullName;
        //     console.log(player);
        //   });
        // });

        const allPlayers = await Promise.all(
          res.data.map((player) =>
            this.$axios.get("people/" + player.nhl_id).then((resp) => {
              player.fullName = resp.data.people[0].fullName;
            })
          )
        );
        return res.data;
      });
  },
};
</script>
