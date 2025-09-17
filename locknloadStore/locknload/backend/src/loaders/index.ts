import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';
import path from 'path';

import config from '../../config';

export default async ({ expressApp }: any) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    name: config.schemas.user.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'userSchema'),
  };

  const userController = {
    name: config.controllers.user.name,
    path: path.join(__dirname, '..', '..', 'src', 'controllers', 'userController'),
  };

  const userRepo = {
    name: config.repos.user.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'userRepo'),
  };

  const userService = {
    name: config.services.user.name,
    path: path.join(__dirname, '..', '..', 'src', 'services', 'userService'),
  };

  const applicationSchema = {
    name: config.schemas.application.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'applicationSchema'),
  };

  const applicationRepo = {
    name: config.repos.application.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'applicationRepo'),
  };

  const licenseController = {
    name: config.controllers.license.name,
    path: path.join(__dirname, '..', '..', 'src', 'controllers', 'licenseController'),
  };

  const licenseService = {
    name: config.services.license.name,
    path: path.join(__dirname, '..', '..', 'src', 'services', 'licenseService'),
  };

  const orderSchema = {
    name: config.schemas.order.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'orderSchema'),
  };

  const orderController = {
    name: config.controllers.order.name,
    path: path.join(__dirname, '..', '..', 'src', 'controllers', 'orderController'),
  };

  const orderRepo = {
    name: config.repos.order.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'orderRepo'),
  };

  const orderService = {
    name: config.services.order.name,
    path: path.join(__dirname, '..', '..', 'src', 'services', 'orderService'),
  };

  const weaponSchema = {
    name: config.schemas.weapon.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'weaponSchema'),
  };

  const weaponController = {
    name: config.controllers.weapon.name,
    path: path.join(__dirname, '..', '..', 'src', 'controllers', 'weaponController'),
  };

  const weaponRepo = {
    name: config.repos.weapon.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'weaponRepo'),
  };

  const weaponService = {
    name: config.services.weapon.name,
    path: path.join(__dirname, '..', '..', 'src', 'services', 'weaponService'),
  };

  const resetPasswordController = {
    name: config.controllers.resetPassword.name,
    path: path.join(__dirname, '..', '..', 'src', 'controllers', 'resetPasswordController'),
  };

  const resetPasswordService = {
    name: config.services.resetPassword.name,
    path: path.join(__dirname, '..', '..', 'src', 'services', 'resetPasswordService'),
  };

  const resetPasswordRepo = {
    name: config.repos.resetPassword.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'resetPasswordRepo'),
  };

  const resetPasswordTokenSchema = {
    name: config.schemas.resetPasswordToken.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'resetPasswordTokenSchema'),
  };

  const passwordSchema = {
    name: config.schemas.password.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'passwordSchema'),
  };

  const licenseSchema = {
    name: config.schemas.license.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'licenseSchema'),
  };

  const licenseRepo = {
    name: config.repos.license.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'licenseRepo'),
  };

  const statusTokenSchema = {
    name: config.schemas.statusToken.name,
    schema: path.join(__dirname, '..', '..', 'src', 'persistence', 'schemas', 'statusTokenSchema'),
  };

  const statusTokenRepo = {
    name: config.repos.statusToken.name,
    path: path.join(__dirname, '..', '..', 'src', 'repos', 'statusTokenRepo'),
  };

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [userSchema, applicationSchema, orderSchema, weaponSchema, resetPasswordTokenSchema, passwordSchema, licenseSchema, statusTokenSchema],
    controllers: [userController, licenseController, orderController, weaponController, resetPasswordController],
    repos: [userRepo, applicationRepo, orderRepo, weaponRepo, resetPasswordRepo, licenseRepo, statusTokenRepo],
    services: [userService, licenseService, orderService, weaponService, resetPasswordService],
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
