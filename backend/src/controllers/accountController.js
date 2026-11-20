export const createAccountController = (accountService) => ({
  getAccount: async (req, res) => {
    res.json(await accountService.getAccount());
  },
  login: async (req, res) => {
    res.json(await accountService.login(req.body.phone));
  },
  update: async (req, res) => {
    res.json(await accountService.update(res.locals.changes));
  },
  remove: async (req, res) => {
    await accountService.remove();
    res.status(204).end();
  },
});
