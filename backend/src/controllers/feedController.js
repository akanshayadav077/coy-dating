export const createFeedController = (feedService) => ({
  getFeed: async (req, res) => {
    res.json(await feedService.getFeed(res.locals.limit));
  },
});
