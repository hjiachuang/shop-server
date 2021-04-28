'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  jwt: {
    enable: true,
    package: 'egg-jwt',
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  minio: {
    enable: true,
    package: 'egg-minio',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },
};
