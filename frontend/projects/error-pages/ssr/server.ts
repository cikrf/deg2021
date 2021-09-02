import 'zone.js/dist/zone-node';
import express from 'express';
import { AppServerModule } from './main.server';
import { ɵCommonEngine as CommonEngine } from '@nguniversal/common/engine';
import * as bodyParser from 'body-parser';
import { createReadStream, existsSync, readFileSync } from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { sanitize } from 'sanitizer';
const PORT: string | undefined = process.env.PORT || '4203';


if (PORT === undefined) {
  throw new Error('port param (PORT) is not defined');
}

const engine = new CommonEngine(AppServerModule, []);
const server = express();
server.use(bodyParser.urlencoded({extended: false}));

const document = readFileSync(path.join(process.cwd(), 'projects/error-pages', 'index.html')).toString();

server.get('*.*', (req: Request, res: Response) => {
  console.warn(`Static request: ${req.url}`);
  const filePath = path.join(process.cwd(), 'projects/error-pages', req.url);
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
  })
    .then((html: string) => res.send(html))
    .catch((error: any) => {
      console.error(error);
      res.status(500);
      res.send();
    });
});

export * from './main.server';

