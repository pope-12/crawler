
const HCCrawler = require('headless-chrome-crawler');
const CSVExporter = require('headless-chrome-crawler/exporter/csv');

const FILE = './tmp/result.csv';

const exporter = new CSVExporter({
    file: FILE,
    fields: ['response.url', 'response.status', 'links.length', 'previousUrl'],
});

let count = 0;

(async () => {
    const crawler = await HCCrawler.launch({
        maxDepth: 10,
        maxConcurrency: 1, //max number of requests to send at once
        delay: 400, //ms to wait between each request, if set then maxConcurrency must be 1
        exporter,
        onSuccess: (result => {
            count++;
            process.stdout.write('.');
        }),
    });

    await crawler.queue({
        url: 'https://buenas.recipes',
        allowedDomains: ['buenas.recipes']
    });

    await crawler.onIdle();
    await crawler.close();

    console.log(`Crawled ${count} pages`);
})();