<template>
  <div>
    <div v-if="!$fetchState.pending">
      <div class="header">
        <div class="position"></div>
        <div class="nom">Nom</div>
        <div class="goals">G</div>
        <div class="assists">A</div>
        <div class="plusMinus">+ / -</div>
        <div class="shots">S</div>
        <div class="wins">W</div>
        <div class="shutouts">SO</div>
        <div class="saves">SV</div>
        <div class="goalsAgainst">GA</div>
        <div class="score">Score</div>
      </div>
      <ul>
        <li v-for="(u, index) in users" :key="index + 'u'">
          <div class="position">{{ index + 1 }}</div>
          <div class="nom">{{ u.prenom }}</div>
          <div class="goals">{{ u.userStats.goals }}</div>
          <div class="assists">{{ u.userStats.assists }}</div>
          <div class="plusMinus">{{ u.userStats.plusMinus }}</div>
          <div class="shots">{{ u.userStats.shots }}</div>
          <div class="wins">{{ u.userStats.wins }}</div>
          <div class="shutouts">{{ u.userStats.shutouts }}</div>
          <div class="saves">{{ u.userStats.saves }}</div>
          <div class="goalsAgainst">{{ u.userStats.goalsAgainst }}</div>
          <div class="score">{{ u.score }}</div>
          <ul class="players">
            <li v-for="(p, index) in u.players" :key="index + 'p'">
              {{ getPlayerName(p.player_id) }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  fetchOnServer: false,
  data() {
    return {
      players: [],
      users: [],
    };
  },
  mounted() {
    this.users.forEach((u) => {
      u.players.forEach((p) => {
        let playerStats = this.players.find(
          (el) => el.player_id == p.player_id
        ).stats;
        if (playerStats) {
          for (let s in u.userStats) {
            if (playerStats[s]) {
              u.userStats[s] += playerStats[s];
            }
          }
        }
      });
      u.score = this.getScore(u.userStats);
    });

    this.users.sort((a, b) => b.score - a.score); // b - a for reverse sort
  },
  methods: {
    getPlayerName(id) {
      return this.players.find((p) => p.player_id == id).infos.fullName;
    },
    getScore(u) {
      console.log(u);
      let score = 0;

      score += u.goals * 2;
      score += u.assists * 1.5;
      score += u.shots * 0.25;
      score += u.plusMinus * 0.5;
      score += u.wins * 2;
      score += u.saves * 0.25;
      score += u.shutouts * 3;
      score += u.goalsAgainst * -1.5;

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
            score: 0,
            userStats: {
              goals: 0,
              assists: 0,
              shots: 0,
              plusMinus: 0,
              wins: 0,
              saves: 0,
              shutouts: 0,
              goalsAgainst: 0,
            },
          });
          return newUser;
        });
        // console.log(res.data);
        return res.data;
      });
    this.players = await this.$db
      .from("pool_players")
      .select("*")
      .then(async (res) => {
        const stats = await Promise.all(
          res.data.map((player) => {
            this.$axios
              .get(
                "people/" +
                  player.nhl_id +
                  "/stats?stats=statsSingleSeason&season=20222023"
              )
              .then((resp) => {
                player.stats = resp.data.stats[0].splits[0]?.stat;
              });
          })
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
* {
  box-sizing: border-box;
}
body {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 16px;
  margin: 0;
}
.header {
  background-color: lightblue;
  display: flex;
}
ul,
.header {
  margin: 0;
  padding: 10px;
  list-style-type: none;
  /* max-width: 640px; */
}
li {
  border-bottom: 1px solid #ccc;
  display: flex;
  /* justify-content: space-between; */
}
.header div,
li div {
  padding: 5px 12px;
  display: flex;
  justify-content: center;
  min-width: 60px;
}

.position {
  min-width: 30px !important;
  max-width: 30px;
}
.nom {
  justify-content: start !important;
  /* background-color: blue; */
  flex: 1;
  width: 200px;
  font-weight: 800;
}
.score {
  font-weight: 800;
  /* flex-grow: 1; */
  min-width: 80px !important;
  justify-content: center !important;
}
.wins,
.goals,
.score {
  border-left: 1px solid #ccc;
}
.players {
  display: none;
}
</style>
