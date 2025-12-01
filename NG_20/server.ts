import { APP_BASE_HREF } from '@angular/common';
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const server = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const angularApp = new AngularNodeAppEngine();

server.get('*.*', express.static(browserDistFolder, {
  maxAge: '1y'
}));

server.get('*', (req: any, res: any, next: any) => {
  angularApp
    .handle(req)
    .then((response: any) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        res.status(404).send('Page not found');
      }
    })
    .catch((err: any) => next(err));
});

const port = process.env['PORT'] || 4000;

server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});