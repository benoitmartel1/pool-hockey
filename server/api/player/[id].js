export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const player = await $fetch(
    `https://api-web.nhle.com/v1/player/${id}/landing/`
  );
  return {
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    seasonTotals: player.seasonTotals,
  };
});
