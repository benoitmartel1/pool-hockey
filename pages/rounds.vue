<template>
  <div>
    <div v-if="!$fetchState.pending" class="main">
      <div class="id">
        <img
          class="express"
          src="https://www.publicationsports.com/cache/image/c5/cd/fa16d96e595133a0486e779b973a71d2_imagewall_1594890346_fr.jpg"
          alt=""
        />
        <div class="title">Pool TGV || Pee-Wee A</div>
        <div class="label">Ton nom :</div>
      </div>
      <div v-for="(r, index) in rounds()" class="round" :key="index + 'r'">
        <div class="header">Ronde {{ index + 1 }}</div>
        <div
          v-for="(p, index) in playersByRound(r)"
          class="player"
          :key="index + 'p'"
        >
          <div class="checkBox"></div>
          <div class="name">
            <div class="firstName">{{ p.infos.firstName }}</div>
            <div class="lastName">{{ p.infos.lastName }}</div>
            <div class="logo">
              <img
                :src="
                  'https://assets.nhle.com/logos/nhl/svg/' +
                  getTeam(p.infos.currentTeam.id) +
                  '_light.svg'
                "
                alt=""
              />
              <div class="number">{{ p.infos.primaryNumber }}</div>
            </div>
          </div>
          <div class="photo">
            <img
              :src="
                'https://assets.nhle.com/mugs/nhl/20232024/' +
                getTeam(p.infos.currentTeam.id) +
                '/' +
                p.nhl_id +
                '.png'
              "
              alt=""
            />
          </div>
          <div class="infos">
            <div class="position">
              {{ p.infos.primaryPosition.abbreviation }}
            </div>
            <div class="age">{{ p.infos.currentAge }} ans</div>
          </div>
        </div>
      </div>
      <div class="scoring">
        <div class="group">
          <div class="header">Attaquants</div>
          <div class="items">
            <div class="scoring-item">
              <div class="item">Buts / Goals</div>
              <div class="points">2</div>
            </div>
            <div class="scoring-item">
              <div class="item">Passes / Assists</div>
              <div class="points">1.5</div>
            </div>
            <div class="scoring-item">
              <div class="item">Lancers / Shots</div>
              <div class="points">0.25</div>
            </div>
            <div class="scoring-item">
              <div class="item">Plus Minus +/-</div>
              <div class="points">.5</div>
            </div>
          </div>
        </div>
        <div class="group">
          <div class="header">Gardiens</div>
          <div class="items">
            <div class="scoring-item">
              <div class="item">Victoires / Wins</div>
              <div class="points">3</div>
            </div>
            <div class="scoring-item">
              <div class="item">Blanchissages / Shutouts</div>
              <div class="points">2</div>
            </div>
            <div class="scoring-item">
              <div class="item">Arrêts / Saves</div>
              <div class="points">0.25</div>
            </div>
            <div class="scoring-item">
              <div class="item">Buts contre /<br />Goals Against</div>
              <div class="points">-1.5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      players: [],
      teams: [],
    };
  },
  mounted() {},
  methods: {
    getTeam(id) {
      return this.teams.find((t) => t.id == id).abbreviation;
    },
    playersByRound(r) {
      return this.players.filter((p) => p.round == r);
    },
    rounds() {
      return [
        ...new Set(
          this.players.map((item) => {
            return item.round;
          })
        ),
      ].sort((b, a) => b - a);
    },
  },

  async fetch() {
    this.teams = await this.$axios.get("teams").then((resp) => {
      console.log(resp);
      return resp.data.teams;
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
* {
  box-sizing: border-box;
}
body {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: 16px;
  margin: 0;
}
.main {
  width: 800px;
}
.header {
  padding-bottom: 10px;
}
.round {
  display: inline-block;
  width: 360px;
  padding: 12px 20px;
  border-radius: 10px;
  border: 2px solid #555;
  margin: 5px;
  /* flex-basis: 0; */
  /* background-color: lightcyan; */
}
.player {
  min-width: 0;
  /* width: 330px; */
  border-top: 1px solid lightgray;
  align-items: center;
  display: flex;
}
.name {
  width: 100px;
  display: flex;
  flex-direction: column;
}
.firstName {
  font-size: 0.8em;
  font-weight: 400;
}
.lastName {
  font-weight: 900;
}
.photo img {
  margin-right: 30px;
  border-radius: 50%;
  width: 80px;
}
.logo {
  display: flex;
  align-items: center;
}
.logo img {
  margin-top: 4px;
  margin-left: -8px;
  width: 50px;
  margin-right: 10px;
}

.checkBox {
  border: 3px solid grey;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 20px;
}
* {
  box-sizing: border-box;
}
.id {
  justify-content: space-between;
  /* background-color: orange; */
  align-items: center;
  max-width: 735px;
  /* box-sizing: border-box; */
  display: flex;
  height: auto;
  margin-bottom: 12px;
}
.express {
  margin-right: 20px;
  width: 60px;
  height: 60px;
  /* float: left; */
  border-radius: 50%;
}
.label {
  flex: 1;
  /* min-width: 100%; */
  margin-top: 5px;
  margin-left: 20px;
  padding: 5px 20px;
  /* background-color: red; */
  height: 60px;
  align-items: center;
  display: flex;
  border: 2px #555 solid;
  border-radius: 30px;
}
.scoring {
  width: 735px;
  column-count: 2;
  column-gap: 40px;
  padding: 0px 10px;
}
.group {
  /* display: flex; */
  /* column-count: 2; */
}
.items {
  column-count: 2;
}
.scoring-item {
  font-size: 0.9em;
  font-weight: 400;
  display: flex;
  min-width: 50%;
  padding: 2px;
  /* margin-bottom: 7px; */
  justify-content: space-between;
}
.scoring .header {
  /* display: block; */
  width: 100%;
  padding-bottom: 4px;
}
</style>
