const Parser = require('rss-parser');
const { Feed } = require('feed');

const ignore = [
  'Demain nous appartient',
  'Plus belle la vie',
  'Un Si Grand Soleil',
  'Plus Belle la vie',
];

module.exports = async function () {
  const parser = new Parser();
  const input = await parser.parseURL(
    'http://rss.allocine.fr/ac/actualites/series'
  );

  const feed = new Feed(input);
  for (const item of input.items) {
    let skip = false;
    item.date = new Date(item.isoDate);
    for (const str of ignore) {
      if (item.title.startsWith(str)) {
        skip = true;
      }
    }
    if (!skip) feed.addItem(item);
  }

  return {
    headers: { 'content-type': 'application/atom+xml;charset=utf-8' },
    body: feed.atom1(),
  };
};
