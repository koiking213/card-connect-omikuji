const index = require('../src/index.js');

describe('Local Test', function() {
   this.timeout(50000);
   it('run locally', async () => {
      await index.runPuppeteer(true);
    });
});