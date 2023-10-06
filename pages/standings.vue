<template>
  <div>
    <div v-if="!$fetchState.pending">
      <table>
        <tr v-for="(p, index) in players" :key="index + 'p'" class="player">
          <td>{{ p.infos.lastName }}</td>
          <!-- <div>{{ p }}</div> -->
          <td class="score">
            {{ getScore(p.stats, p.infos.primaryPosition.code !== "G") }}
          </td>
        </tr>
      </table>
      <div class="header">
        <div class="position"></div>
        <div class="nom">Nom</div>
        <div class="goals">Buts</div>
        <div class="assists">Assists</div>
        <div class="plusMinus">+ / -</div>
        <div class="score">Score</div>
      </div>
      <!-- <ul>
        <li v-for="(u, index) in users" :key="index + 'u'">
          <div class="position">{{ index + 1 }}</div>
          <div class="nom">{{ u.prenom }}</div>
          <div class="goals">{{ u.goals }}</div>
          <div class="assists">{{ u.assists }}</div>
          <div class="plusMinus">{{ u.plusMinus }}</div>
          <div class="score">{{ u.score }}</div>
        </li>
      </ul> -->
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
  mounted() {
    this.users.forEach((u) => {
      u.players.forEach((p) => {
        p.stats = this.players.find((el) => el.player_id == p.player_id).stats;
        if (p.stats && p.stats.goals) {
          u.goals += p.stats.goals;
          u.assists += p.stats.assists;
          u.shots += p.stats.shots;
          u.plusMinus += p.stats.plusMinus;
        }
      });
      u.score = this.getScore(u);
    });

    this.users.sort((a, b) => b.score - a.score); // b - a for reverse sort
  },
  methods: {
    getScore(u, isForward) {
      console.log(u);
      let score = 0;
      if (u !== undefined) {
        if (isForward) {
          score += u.goals * 2;
          score += u.assists * 1.5;
          score += u.shots * 0.25;
          score += u.plusMinus * 0.5;
          //   score += u.shots * 0.4;
          // score += u.penaltyMinutes * 0.5;
        } else {
          score += u.wins * 2;
          score += u.saves * 0.25;
          score += u.shutouts * 3;
          score += u.goalsAgainst * -1.5;
          // score += u.plusMinus;
          // score += u.shots * 0.4;
        }
      }

      return Math.floor(score);
    },
  },

  async fetch() {
    this.users = await this.$db
      .from("pool_users")
      .select("*, players:pool_player_to_user(player_id)")
      .then((res) => {
        res.data = res.data.map((u) => {
          let newUser = Object.assign({}, u, {
            goals: 0,
            assists: 0,
            shots: 0,
            plusMinus: 0,
            score: 0,
          });
          return newUser;
        });
        return res.data;
      });
    this.players = await this.$db
      .from("pool_players")
      .select("*")
      .then(async (res) => {
        const stats = await Promise.all(
          res.data.map((player) =>
            this.$axios
              .get(
                "people/" +
                  player.nhl_id +
                  "/stats?stats=statsSingleSeason&season=20222023"
              )
              .then((resp) => {
                player.stats = resp.data.stats[0].splits[0]?.stat;
              })
          )
        );
        const infos = await Promise.all(
          res.data.map((player) =>
            this.$axios.get("people/" + player.nhl_id).then((resp) => {
              player.infos = resp.data.people[0];
            })
          )
        );
        return res.data;
      });
  },
};
</script>
<style>
ul,
.header {
  background-color: lightblue;
  padding: 20px;
  list-style-type: none;
  max-width: 640px;
}
li,
.header {
  display: flex;
  justify-content: space-between;
}
.player {
  /* display: flex; */
  width: 500px;
  justify-content: space-between;
}
</style>
