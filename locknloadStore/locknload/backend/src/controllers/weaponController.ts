import { Inject, Service } from 'typedi';
import config from '../../config';
import { NextFunction, Request, Response } from 'express';
import { Result } from '../core/logic/Result';
import IWeaponController from './IControllers/IWeaponController';
import { IWeaponDTO } from '../dto/IWeaponDTO';
import IWeaponService from '../services/IServices/IWeaponService';

import Logger from '../loaders/logger';

@Service()
export default class WeaponController implements IWeaponController {
  @Inject(config.services.weapon.name)
  private weaponServiceInstance: IWeaponService;

  public constructor() {
    //
  }

  public async postWeapon(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponOrError = (await this.weaponServiceInstance.postWeapon(req.body as IWeaponDTO)) as Result<IWeaponDTO>;
      if (weaponOrError.isFailure) {
        Logger.error('Error creating weapon:', weaponOrError.error);
        return res.status(400).send(weaponOrError.error);
      }

      Logger.info('Weapon created');
      const weaponDTO = weaponOrError.getValue();
      return res.status(201).json(weaponDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getWeapons(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponsOrError = (await this.weaponServiceInstance.getWeapons()) as Result<IWeaponDTO[]>;

      if (weaponsOrError.isFailure) {
        Logger.error('Failed to obtain weapons:', weaponsOrError.error);
        return res.status(400).send(weaponsOrError.error);
      }

      Logger.info('Weapons obtained');
      const weaponDTOs = weaponsOrError.getValue();
      return res.status(200).json(weaponDTOs);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getWeaponsByNameAsc(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponsOrError = (await this.weaponServiceInstance.getWeaponsByNameAsc()) as Result<IWeaponDTO[]>;

      if (weaponsOrError.isFailure) {
        Logger.error('Failed to obtain weapons:', weaponsOrError.error);
        return res.status(400).send(weaponsOrError.error);
      }

      Logger.info('Weapons obtained');
      const weaponDTOs = weaponsOrError.getValue();
      return res.status(200).json(weaponDTOs);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getWeaponsByNameDesc(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponsOrError = (await this.weaponServiceInstance.getWeaponsByNameDesc()) as Result<IWeaponDTO[]>;

      if (weaponsOrError.isFailure) {
        Logger.error('Failed to obtain weapons:', weaponsOrError.error);
        return res.status(400).send(weaponsOrError.error);
      }

      Logger.info('Weapons obtained');
      const weaponDTOs = weaponsOrError.getValue();
      return res.status(200).json(weaponDTOs);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getWeaponsByPriceDesc(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponsOrError = (await this.weaponServiceInstance.getWeaponsByPriceDesc()) as Result<IWeaponDTO[]>;

      if (weaponsOrError.isFailure) {
        Logger.error('Failed to obtain weapons:', weaponsOrError.error);
        return res.status(400).send(weaponsOrError.error);
      }

      Logger.info('Weapons obtained');
      const weaponDTOs = weaponsOrError.getValue();
      return res.status(200).json(weaponDTOs);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getWeaponsByPriceAsc(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponsOrError = (await this.weaponServiceInstance.getWeaponsByPriceAsc()) as Result<IWeaponDTO[]>;

      if (weaponsOrError.isFailure) {
        Logger.error('Failed to obtain weapons:', weaponsOrError.error);
        return res.status(400).send(weaponsOrError.error);
      }

      Logger.info('Weapons obtained');
      const weaponDTOs = weaponsOrError.getValue();
      return res.status(200).json(weaponDTOs);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }


  public async getWeaponsByName(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const weaponsOrError = (await this.weaponServiceInstance.getWeaponsByName(req.params.name)) as Result<IWeaponDTO[]>;

      if (weaponsOrError.isFailure) {
        Logger.error('Failed to obtain weapons:', weaponsOrError.error);
        return res.status(400).send(weaponsOrError.error);
      }

      Logger.info('Weapons obtained');
      const weaponDTOs = weaponsOrError.getValue();
      return res.status(200).json(weaponDTOs);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
