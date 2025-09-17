import LoggerInstance from './logger';
import { Container } from 'typedi';
import path from 'path';

export default ({
  mongoConnection,
  schemas,
  controllers,
  repos,
  services,
}: {
  mongoConnection: any;
  schemas: { name: string; schema: string }[];
  controllers: { name: string; path: string }[];
  repos: { name: string; path: string }[];
  services: { name: string; path: string }[];
}) => {
  try {
    Container.set('logger', LoggerInstance);

    schemas.forEach(m => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const schemaClass = require(m.schema).default;
      Container.set(m.name, schemaClass);
    });

    repos.forEach(m => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const repoClass = require(m.path).default;
      const repoInstance = new repoClass();
      Container.set(m.name, repoInstance);
    });

    services.forEach(m => {
      const servicePath = path.resolve(m.path);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceClass = require(servicePath).default;
      const serviceInstance = Container.get(serviceClass);
      Container.set(m.name, serviceInstance);
    });

    controllers.forEach(m => {
      const controllerPath = path.resolve(m.path);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const controllerClass = require(controllerPath).default;
      const controllerInstance = Container.get(controllerClass);
      Container.set(m.name, controllerInstance);
    });

    return;
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
