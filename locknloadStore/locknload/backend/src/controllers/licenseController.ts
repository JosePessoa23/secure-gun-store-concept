import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import ILicenseController from './IControllers/ILicenseConroller';
import config from '../../config';
import ILicenseService from '../services/IServices/ILicenseService';
import { IApplicationDTO } from '../dto/IApplicationDTO';
import Logger from '../loaders/logger';

@Service()
export default class LicenseController implements ILicenseController {
  @Inject(config.services.license.name)
  private licenseServiceInstance: ILicenseService;

  public constructor() {
    //
  }

  public async submitApplication(
    req: Request & { files: Record<string, Express.Multer.File[]> },
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      if (
        !req.files ||
        !req.files.medicalCertificate ||
        !req.files.documentId
      ) {
        return res.status(400).send('No files uploaded');
      }

      const applicationDTO: IApplicationDTO = {
        name: req.body.name,
        email: req.body.email,
        birthDate: req.body.birthDate,
        address: req.body.address,
        medicalCertificate: req.files.medicalCertificate[0].buffer,
        documentId: req.files.documentId[0].buffer,
      };
      const applicationOrError =
        await this.licenseServiceInstance.submitApplication(applicationDTO);
      if (applicationOrError.isFailure) {
        return res.status(400).send(applicationOrError.error);
      }

      Logger.info('Application Submitted');

      const applicationDTORes = applicationOrError.getValue();
      return res.status(201).json(applicationDTORes);
    } catch (error) {
      Logger.error('Error submitting application:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getApplicationByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      console.log(req.params.email);
      const applicationOrError =
        await this.licenseServiceInstance.getApplicationByEmail(
          req.params.email
        );
      if (applicationOrError.isFailure) {
        return res.status(400).send(applicationOrError.error);
      }

      const applicationDTORes = applicationOrError.getValue();
      return res.status(200).json(applicationDTORes);
    } catch (error) {
      Logger.error('Error getting application by email:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getApplicationStatusByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const applicationOrError =
        await this.licenseServiceInstance.getApplicationStatusByEmail(
          req.params.email,
          req.params.token
        );
      if (applicationOrError.isFailure) {
        return res.status(400).send(applicationOrError.error);
      }

      const applicationDTORes = applicationOrError.getValue();
      return res.status(200).json(applicationDTORes);
    } catch (error) {
      Logger.error('Error getting application by email:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async getApplicationsOrderedByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const applicationsOrError =
        await this.licenseServiceInstance.getApplicationsOrderedByDate();
      if (applicationsOrError.isFailure) {
        return res.status(400).send(applicationsOrError.error);
      }

      const applicationDTORes = applicationsOrError.getValue();
      return res.status(200).json(applicationDTORes);
    } catch (error) {
      Logger.error('Error getting application by email:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  public async approveApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const applicationsOrError =
        await this.licenseServiceInstance.approveApplication(
          req.params.email,
          req.params.approve
        );
      if (applicationsOrError.isFailure) {
        return res.status(400).send(applicationsOrError.error);
      }

      const applicationDTORes = applicationsOrError.getValue();
      return res.status(200).json(applicationDTORes);
    } catch (error) {
      Logger.error('Error getting application by email:', error);
      return res.status(500).send('Internal Server Error');
    }
  }
}
