export const useSumScore = (stats) => {
  let score = 0;
  for (let [key, value] of Object.entries(stats)) {
    score += value * requiredStats[key];
  }
  return score;
};

export const requiredStats = {
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
