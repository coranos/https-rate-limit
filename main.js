'use strict';

const index = require('./index.js');

const run = async () => {
  console.log('https-rate-limit');
  if (process.argv.length < 2) {
    console.log('#usage:');
    console.log('npm start <url>');
  } else {
    const genesis = 'ban_1bananobh5rat99qfgt1ptpieie5swmoth87thi74qgbfrij7dcgjiij94xr';
    const historyChunkSize = 1000;

    const url = process.argv[2];
    console.log('url', url);

    const visitedAccountSet = new Set();
    const frontierAccountList = [];
    frontierAccountList.push({account: genesis});

    index.setUrl(url);

    while (frontierAccountList.length > 0) {
      const accountData = frontierAccountList.pop();
      visitedAccountSet.add(accountData.account);
      const req = {
        action: 'account_history',
        account: accountData.account,
        count: historyChunkSize,
      };
      if (accountData.previous) {
        req.previous = accountData.previous;
      }
      const resp = await index.sendRequest(req);
      console.log('account', accountData.account,
          'previous', accountData.previous,
          'visitedAccountSet.size', visitedAccountSet.size,
          'frontierAccountList.length', frontierAccountList.length);
      if (resp.history) {
        if (resp.history.length > 0) {
          let previous;
          resp.history.forEach((historyElt) => {
            previous = historyElt.previous;
            if (!visitedAccountSet.has(historyElt.account)) {
              frontierAccountList.push({account: historyElt.account});
            }
          });
          if (previous !== undefined) {
            frontierAccountList.push({account: genesis, previous: previous});
          }
        }
      }
    }
  }
};

run();
