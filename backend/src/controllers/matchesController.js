export const createMatchesController = (matchesService) => ({
  getMatches: async (req, res) => {
    res.json(await matchesService.getMatches());
  },
  getMessages: async (req, res) => {
    res.json(await matchesService.getMessages(req.params.matchId));
  },
  sendMessage: async (req, res) => {
    res.status(201).json(await matchesService.sendMessage(req.params.matchId, res.locals.text));
  },
});
