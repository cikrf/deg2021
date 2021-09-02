import 'zone.js/dist/zone-node';
import '@shared/polyfills';
import express from 'express';
import { AppServerModule } from './main.server';
import { ɵCommonEngine as CommonEngine } from '@nguniversal/common/engine';
import * as bodyParser from 'body-parser';
import { createReadStream, existsSync, readFileSync } from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { PostDataToken } from '@modules/transfer-between-apps/transfer-between-apps.tokens';
import { sanitize } from 'sanitizer';

const DIST: string | undefined = process.env.PRODUCTION === 'true' ? process.env.DIST : 'dist/anon';
const PORT: string | undefined = process.env.PRODUCTION === 'true' ? process.env.PORT : '4201';

if (DIST === undefined) {
  throw new Error('index.html param (DIST) is not defined');
}

if (PORT === undefined) {
  throw new Error('port param (PORT) is not defined');
}

const engine = new CommonEngine(AppServerModule, []);
const server = express();
server.use(bodyParser.urlencoded({extended: false}));

const document = readFileSync(path.join(process.cwd(), DIST, 'index.html')).toString();

server.get('*.*', (req: Request, res: Response) => {
  console.warn(`Static request: ${req.url}`);
  const filePath = path.join(process.cwd(), DIST, req.url);
  if (existsSync(filePath)) {
    createReadStream(filePath).pipe(res);
  } else {
    res.status(404);
    res.send();
  }
});

server.all('*', (req: Request, res: Response) => {
  console.log(`Application request: ${req.url}`);
  engine.render({
    document,
    bootstrap: AppServerModule,
    url: sanitize(req.url),
    providers: [
      {
        provide: PostDataToken,
        useValue: Object.keys(req.body).reduce((acc, key) => {
          return {
            ... acc,
            [key]: sanitize(req.body[key]),
          };
        }, {}),
      },
    ],
  })
    .then((html: string) => res.send(html))
    .catch((error: any) => {
      console.error(error);
      res.status(500);
      res.send();
    });
});

server.listen(+PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

export * from './main.server';
