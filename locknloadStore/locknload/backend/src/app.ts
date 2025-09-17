import 'reflect-metadata'; // We need this in order to use @Decorators

import config from '../config';

import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';

import Logger from './loaders/logger';
import loadLoaders from './loaders'; // Use an alias to clarify the import


async function startServer() {
  const app = express();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const loaders = await import('./loaders');
  // await loaders.default({ expressApp: app });
  await loadLoaders({ expressApp: app });

  //old
  //await require('./loaders').default({ expressApp: app });


  if(config.isProduction)
    {
      // Load SSL certificate information
      const privateKey = fs.readFileSync(config.sslKeyPath, 'utf8');
      const certificate = fs.readFileSync(config.sslCertPath, 'utf8');
      const ca = fs.readFileSync(config.sslCaPath, 'utf8');
      
      const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
      };

      // Create an HTTPS Server.
      const httpsServer = https.createServer(credentials, app);

      httpsServer
        .listen(config.port, '0.0.0.0', () => {
          console.log('HTTPS Server listening on port: ' + config.port);

          Logger.info(`
          ####################################################
          🛡️  HTTPSServer listening on port: ${config.port} 🛡️
          ####################################################
        `);
        })
        .on('error', (err) => {
          Logger.error(err);
          process.exit(1);
        });

      // Creating and http server to redirect to HTTPS
      const httpApp = express();
      httpApp.use((req, res, next) => {
        if (!req.secure) {
          return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
      });

      http.createServer(httpApp).listen(config.httpPort, () => {
        Logger.info(`
        #######################################################################
        🛡️  HTTP Server listening on port ${config.httpPort} for redirection 🛡️
        #######################################################################
      `);
      });
    }else{
      app
      .listen(config.port, '0.0.0.0', () => {
        console.log('HTTP Server listening on port: ' + config.port);

        Logger.info(`
        ################################################
        🛡️  HTTP Server listening on port: ${config.port} 🛡️
        ################################################
      `);
      })
      .on('error', (err) => {
        Logger.error(err);
        process.exit(1);
      });
    }
  
}

startServer();
