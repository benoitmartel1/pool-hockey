<script setup>
const nuxtApp = useNuxtApp();
const client = useSupabaseClient();
const mainStore = useMainStore();

//Fetch pool users
const { data: fetchedUsers } = await useAsyncData(
  'fetchedUsers',
  async () => {
    const { data } = await client
      .from('pool_users')
      .select('*,  players:pool_player_to_user(player_id)');
    return data;
  },
  {
    getCachedData(key) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);
mainStore.users = fetchedUsers;
//Fetch pool NHL players IDs
const { data: fetchedPlayers } = await useAsyncData(
  'fetchedPlayers',
  async () => {
    const { data } = await client
      .from('pool_players')
      .select('player_id, nhl_id, round');
    return data;
  },
  {
    getCachedData(key) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);
mainStore.players = fetchedPlayers;

//For every NHL player, retrieve current season stats
const stats = await Promise.all(
  mainStore.players.map(async (player) => {
    const { data } = await useFetch(
      //https://dash.cloudflare.com/33c34580d322d7187a306d420538bbe4 to EDIT
      `https://worker-summer-mode-dcb6.martel-b.workers.dev?id=${player.nhl_id}`,

      {
        pick: [
          'seasonTotals',
          'fullName',
          'position',
          'firstName',
          'lastName',
          'teamLogo',
          'headshot',
        ],
        getCachedData(key) {
          const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
          return data;
        },
      }
    );
    player.firstName = data.value.firstName.default;
    player.lastName = data.value.lastName.default;
    player.fullName = data.value.fullName;
    player.position = data.value.position;
    player.teamLogo = data.value.teamLogo;
    player.headShot = data.value.headshot;

    //Get current season stats for every team player played with
    const currentSeasonLogs = data?.value?.seasonTotals.filter(
      (s) => s.season == '20232024'
    );

    //Create the key for every stat needed in player object
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

    player.stats = stats;

    //Define the score according to defined requiredStats chart
    player.score = useSumScore(player.stats);

    return player;
  })
);

mainStore.users.forEach((user) => {
  user.stats = populateUserStats(user);
  user.score = useSumScore(user.stats);
});

function populateUserStats(user) {
  let stats = { ...requiredStats };
  for (let [key, value] of Object.entries(stats)) {
    stats[key] = 0;
  }

  user.players.forEach((userPlayer) => {
    let player = mainStore.players.find(
      (p) => p.player_id == userPlayer.player_id
    );
    // userPlayer.name = player.lastName;
    for (let [key, value] of Object.entries(stats)) {
      stats[key] += parseInt(player.stats[key]) || 0;
    }
  });
  return stats;
}
mainStore.users.sort((a, b) => b.score - a.score);
mainStore.players.sort((a, b) => b.score - a.score);
</script>

<template>
  <div class="page">
    <div id="tgv">
      <Header />
    </div>
    <ul class="users">
      <User
        v-for="(u, index) in mainStore.users"
        :key="u.user_id"
        :user="u"
        :index="index"
        @click="
          {
            {
              $router.push({ path: '/users/' + u.user_id });
            }
          }
        "
      />
    </ul>
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
  }
}
body {
  background-color: rgb(234, 244, 251);
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-size: 16px;
  margin: 0;
}
ul {
  margin: 0;
  padding: 10px;
  list-style-type: none;
  padding-top: 0;
}
.header {
  padding: 0 10px;
  border-bottom: 1px solid #333;
}

li {
  cursor: pointer;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  height: 48px;
  justify-content: space-between;
}
li > * {
  display: flex;
}
.infos {
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}
.infos > * {
  padding: 0 6px;
}
.position {
  min-width: 30px !important;
  max-width: 30px;
}
.nom {
  flex: 1;

  font-weight: 800;
  display: flex;
  justify-content: space-between;
}
.player-position {
  padding: 0;
}
.score {
  font-weight: 800;
  min-width: 80px !important;
  justify-content: center !important;
}
.wins,
.goals,
.score {
  border-left: 1px solid #ccc;
}
</style>
