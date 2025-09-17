import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import config from '../../../config';

interface EmailPayload {
  [key: string]: any;
}

const readHTMLFile = (filePath: string): string => {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
};

const sendEmail = async (
  email: string,
  subject: string,
  payload: EmailPayload,
  templateName: string,
): Promise<void> => {
  try {
    // Register partials
    const header = readHTMLFile('./templates/partials/header.handlebars');
    const footer = readHTMLFile('./templates/partials/footer.handlebars');
    handlebars.registerPartial('header', header);
    handlebars.registerPartial('footer', footer);

    // Compile the layout template
    const layoutTemplate = readHTMLFile('./templates/layouts/main.handlebars');
    const compiledLayout = handlebars.compile(layoutTemplate);

    // Compile the main template
    const mainTemplate = readHTMLFile(`./templates/emails/${templateName}.handlebars`);
    const compiledMainTemplate = handlebars.compile(mainTemplate);

    // Combine the layout with the main template
    const html = compiledLayout({
      subject,
      body: compiledMainTemplate(payload),
    });

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: config.email.service,
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.username,
        pass: config.email.password, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const options = {
      from: config.email.from,
      to: email,
      subject: subject,
      html: html,
    };

    // Send email
    await transporter.sendMail(options);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;

/*
Usage Example:
sendEmail(
  "youremail@gmail.com",
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/
