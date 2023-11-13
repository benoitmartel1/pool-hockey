<script setup>
const client = useSupabaseClient();

const requiredStats = {
  gamesPlayed: 0,
  goals: 2,
  assists: 1.5,
  plusMinus: 0.5,
  shots: 0.25,
  wins: 2,
  shotsAgainst: 0.25,
  shutouts: 3,
  goalsAgainst: -1.5,
};

const { data: users } = await useAsyncData('users', async () => {
  const { data } = await client
    .from('pool_users')
    .select('*,  players:pool_player_to_user(player_id)');
  return data;
});

const { data: players } = await useAsyncData('players', async () => {
  const { data } = await client.from('pool_players').select('*');
  return data;
});

const stats = await Promise.all(
  players.value.map(async (player) => {
    const { data } = await useFetch(`/api/player/${player.nhl_id}`);

    //Get current season stats for every team player played with
    const currentSeasonLogs = data._rawValue.seasonTotals.filter(
      (s) => s.season == '20232024'
    );

    let stats = { ...requiredStats };
    for (let [key, value] of Object.entries(stats)) {
      stats[key] = 0;
    }
    //Sum every stat for every team he played with
    for (let [key, value] of Object.entries(stats)) {
      currentSeasonLogs.forEach((l) => {
        if (l[key]) {
          stats[key] += l[key];
        } else {
          stats[key] = null;
        }
      });
    }
    player.firstName = data._rawValue.firstName.default;
    player.lastName = data._rawValue.lastName.default;
    player.position = data._rawValue.position;
    player.stats = stats;

    return player;
  })
);

users.value.forEach((user) => {
  user.userStats = populateUserStats(user);
  user.score = sumScore(user.userStats);
});
function sumScore(stats) {
  let score = 0;
  for (let [key, value] of Object.entries(stats)) {
    score += value * requiredStats[key];
  }
  return score;
}
function populateUserStats(user) {
  let stats = { ...requiredStats };
  for (let [key, value] of Object.entries(stats)) {
    stats[key] = 0;
  }

  user.players.forEach((userPlayer) => {
    let player = players.value.find((p) => p.player_id == userPlayer.player_id);
    userPlayer.name = player.lastName;
    for (let [key, value] of Object.entries(stats)) {
      stats[key] += parseInt(player.stats[key]) || 0;
    }
  });
  return stats;
}
users.value.sort((a, b) => b.score - a.score);
</script>

<template>
  <div class="page">
    <div id="tgv">
      <div class="header">
        <div class="position"></div>
        <div class="nom">
          <img
            class="logo"
            src="https://www.publicationsports.com/cache/image/c5/cd/fa16d96e595133a0486e779b973a71d2_imagewall_1594890346_fr.jpg"
            alt=""
          />
        </div>
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
    </div>
    <ul>
      <User
        v-for="(u, index) in users"
        :key="u.user_id"
        :user="u"
        :index="index"
      />
    </ul>
    <!-- <ul>
      <li v-for="s in stats" :key="s.nhl_id">
        <div>{{ s.firstName + ' ' + s.lastName }}</div>
        <div>{{ s.stats }}</div>
      </li>
    </ul> -->
  </div>
</template>
<style>
* {
  box-sizing: border-box;
}
.logo {
  /* margin-right: 20px; */
  width: 50px;
  height: 50px;
  /* float: left; */
  border-radius: 50%;
}
.page {
  background-color: white;
  padding: 30px;
  min-height: 100vh;
  max-width: 1024px;
  margin: auto;
  display: flex;
  flex-direction: column;
}
@media print {
  .page {
    max-width: 210mm;
    height: 10in;
    margin: 0;
    padding: 0;
    justify-content: space-between;
  }
}
body {
  background-color: rgb(234, 244, 251);
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-size: 16px;
  margin: 0;
}
ul,
.header {
  margin: 0;
  padding: 10px;
  list-style-type: none;
  padding-top: 0;
  /* max-width: 640px; */
}
.header {
  padding: 0 10px;
  border-bottom: 1px solid #333;
  /* border-radius: 40px; */
  /* background-color: lightblue; */
  display: flex;
  align-items: end;
}

li {
  border-bottom: 1px solid #ccc;
  display: flex;
  /* justify-content: space-between; */
}
.header div,
li div {
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  min-width: 60px;
}
.header div:not(.nom) {
  padding-bottom: 10px;
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
