const chalk = require('chalk');
const tlink = require('terminal-link');

function generateChoices(tools) {
  const { fav: favChoices, more: moreChoices } = Object.entries(tools)
    .map(([value, info]) => {
      const title = chalk.bold(info.title);
      const link = tlink(
        chalk.cyan(info.pkg),
        `https://www.npmjs.com/package/${info.pkg}`,
      );
      return {
        payload: {
          title: `${title} (${link})`,
          value,
        },
        fav: info.fav,
      };
    })
    .reduce(
      ({ fav, more }, tool) => {
        if (tool.fav) {
          return { fav: [...fav, tool.payload], more };
        }
        return { more: [...more, tool.payload], fav };
      },
      {
        fav: [],
        more: [],
      },
    );

  return {
    favChoices: [
      ...favChoices,
      {
        title: 'More ...',
        value: 'more',
      },
    ],
    moreChoices,
  };
}
exports.generateChoices = generateChoices;
