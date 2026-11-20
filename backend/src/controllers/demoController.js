export const createDemoController = (demoService) => ({
  reset: async (req, res) => {
    res.json(await demoService.resetDemo());
  },
});
