const chalk = require('chalk');
const { fork } = require('child_process');

const deploying = process => `INDEX: Deploying ${process}...`;

const forkClient = () => {
    console.log(chalk.bold.bgWhite(deploying('client')));
    fork('./client');
}

console.log(chalk.bold.bgWhite(deploying('commands')));
fork('./deploy-commands').on('close', forkClient);