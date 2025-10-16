

import { Sequelize } from 'sequelize';
import config = require('./database');


const sequelize = new Sequelize(config);


export default sequelize;