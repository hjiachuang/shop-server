'use strict';

const baseUrl = '/api/upload';

module.exports = app => {
  const { router, controller } = app;
  router.post(`${baseUrl}/image`, controller.upload.image);
};
