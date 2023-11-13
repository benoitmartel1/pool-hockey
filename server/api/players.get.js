export default defineEventHandler(async (event) => {
  const player = await $fetch(
    `https://api-web.nhle.com/v1/player/${player_id}/landing/`
  );
  return player;
});
