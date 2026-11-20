export const createMeController = (profileService) => ({
  getMe: async (req, res) => {
    res.json(await profileService.getCurrentUser());
  },
});
