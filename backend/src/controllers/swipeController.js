export const createSwipeController = (swipeService) => ({
  swipe: async (req, res) => {
    const { targetId, action } = req.body;
    res.status(201).json(await swipeService.swipe({ targetId, action }));
  },
});
