import { Inject, Service } from 'typedi';
import IUserController from './IControllers/IUserController';
import config from '../../config';
import IUserService from '../services/IServices/IUserService';
import { NextFunction, Request, Response } from 'express';
import { IUserDTO } from '../dto/IUserDTO';
import { Result } from '../core/logic/Result';
import Logger from '../loaders/logger';

@Service()
export default class UserController implements IUserController {
  @Inject(config.services.user.name)
  private userServiceInstance!: IUserService; // Definite assignment assertion

  public constructor() {
    //
  }

  public async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const userOrError = (await this.userServiceInstance.signUp(
        req.body as IUserDTO
      )) as Result<IUserDTO>;
      if (userOrError.isFailure) {
        Logger.error('Error creating user:', userOrError.error);
        return res.status(400).send(userOrError.error);
      }

      Logger.info('User Created');
      const userDTO = userOrError.getValue();
      return res.status(201).json(userDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const userOrError = (await this.userServiceInstance.updateUser(
        req.body as IUserDTO
      )) as Result<IUserDTO>;
      if (userOrError.isFailure) {
        Logger.error('Error updating user:', userOrError.error);
        return res.status(400).send(userOrError.error);
      }

      Logger.info('User Updated');
      const userDTO = userOrError.getValue();
      return res.status(201).json(userDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const deletedOrError = await this.userServiceInstance.deleteUser(
        req.headers['token']
      );
      if (!deletedOrError) {
        Logger.error('Error deleting user:');
        return res.status(400).send();
      }

      Logger.info('User Deleted');
      return res.status(201).json();
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async signIn(
    req: Request,
    res: Response,
    next: NextFunction,
    store: any
  ): Promise<Response> {
    try {

      const userOrError = (await this.userServiceInstance.SignIn(
        req.body.email,
        req.body.password,
        req.body.fingerprint,
        req.headers['twofactorcode'] || null
      )) as Result<{
        userDTO: IUserDTO;
        token: string;
      }>;

      if (userOrError.isFailure) {
        Logger.error('Error signing in:', userOrError.error);
        return res.status(400).send(userOrError.error);
      }

      const userDTO = userOrError.getValue();

      if (userDTO) {
        req.session.authenticated = true;
        req.session.user = { email: userDTO.userDTO.email };
      }

      // Store the session ID under the username
      store.get(userDTO.userDTO.email, (err, userSessions) => {
        if (err) {
          console.error(err);
        } else {
          if (!userSessions) {
            userSessions = [];
          }
          userSessions.push(req.sessionID);
          store.set(userDTO.userDTO.email, userSessions, err => {
            if (err) {
              console.error(err);
            }
          });
        }
      });

      // join the req.session with the userDTO
      const response = {
        ...userDTO,
        session: req.session,
      };

      return res.status(201).json(response);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const usersOrError =
        (await this.userServiceInstance.getUsers()) as Result<IUserDTO[]>;

      if (usersOrError.isFailure) {
        Logger.error('Error fetching users:', usersOrError.error);
        return res.status(400).send(usersOrError.error);
      }

      const usersDTO = usersOrError.getValue();
      return res.status(200).json(usersDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const userOrError = (await this.userServiceInstance.getUserByEmail(
        req.params.email
      )) as Result<IUserDTO>;

      if (userOrError.isFailure) {
        Logger.error('Error fetching user by email:', userOrError.error);
        return res.status(400).send(userOrError.error);
      }

      const userDTO = userOrError.getValue();
      return res.status(200).json(userDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {

      // get the bearer token from the request headers
      const token = req.headers['authorization'].split(' ')[1];

      const userOrError = (await this.userServiceInstance.getCurrentUser(
        token
      )) as Result<IUserDTO>;

      if (userOrError.isFailure) {
        Logger.error('Error fetching user by email:', userOrError.error);
        return res.status(400).send(userOrError.error);
      }

      const userDTO = userOrError.getValue();
      return res.status(200).json(userDTO);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async get2fa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const qrCodeOrError = (await this.userServiceInstance.get2fa(
        req.headers['token']
      )) as Result<string>;

      if (qrCodeOrError.isFailure) {
        Logger.error('Error fetching qr code:', qrCodeOrError.error);
        return res.status(400).send(qrCodeOrError.error);
      }

      const qrCode = qrCodeOrError.getValue();
      return res.status(200).json(qrCode);
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async has2fa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const has2fa = (await this.userServiceInstance.has2fa(
        req.headers['email']
      )) as Result<boolean>;

      if (has2fa.isFailure) {
        Logger.error('Error fetching 2fa status:', has2fa.error);
        return res.status(400).send(has2fa.error);
      }

      return res.status(200).json({
        has2fa: has2fa.getValue(),
      });
    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getUserFeatures(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      // get the user
      const userOrError = (await this.userServiceInstance.getUserByEmail(
        req.session.user.email
      )) as Result<IUserDTO>;

      if (userOrError.isFailure) {
        Logger.error('Error fetching user by email:', userOrError.error);
        return res.status(400).send(userOrError.error);
      }

      const userDTO = userOrError.getValue();

      // get its role
      const role = userDTO.role.toUpperCase();

      // find the key for the role with value role in the config file
      const features = config.roleFeatures[role];

      return res.status(200).json({
        features,
      });

    } catch (error) {
      Logger.error('Internal Server Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
