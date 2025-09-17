// config.ts
// This file is configured to load sensitive information from environment variables.
// Ensure all environment variables are set properly before running the application.
// Use a secrets management tool to store and retrieve these values securely.

import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash the whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

// Define features separately
const features = {
  HOME: 'home',
  PURCHASE_HISTORY: 'PURCHASE_HISTORY',
  USER_DETAILS: 'USER_DETAILS',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  SEND_APPLICATION: 'SEND_APPLICATION',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  TWO_FACTOR_AUTH: 'TWO_FACTOR_AUTH',
  ACTIVE_SESSIONS: 'ACTIVE_SESSIONS',
  WEAPON_CATALOG: 'catalog',
  SHOPPING_CART: 'SHOPPING_CART',
  CHECKOUT: 'CHECKOUT',
  CREATE_WEAPON: 'CREATE_WEAPON',
  RESET_PASSWORD_EMAIL: 'RESET_PASSWORD_EMAIL',
  RESET_PASSWORD: 'RESET_PASSWORD',
  APPLICATIONS_LIST: 'applicationsList',
  USER_APPLICATION_VIEW: 'applicationsList/user/:email',
  LICENSE_APPLICATION: 'licenseApplication',
  APPLICATION_STATUS: 'status/email/:email/:token',
  ITS_ME: 'ITS_ME',
};

// Define roleFeatures using the features keys
const roleFeatures = {
  ADMIN: [
    features.HOME,
    features.PURCHASE_HISTORY,
    features.USER_DETAILS,
    features.CHANGE_PASSWORD,
    features.SEND_APPLICATION,
    features.DELETE_ACCOUNT,
    features.TWO_FACTOR_AUTH,
    features.ACTIVE_SESSIONS,
    features.WEAPON_CATALOG,
    features.SHOPPING_CART,
    features.CHECKOUT,
    features.CREATE_WEAPON,
    features.RESET_PASSWORD_EMAIL,
    features.RESET_PASSWORD,
    features.APPLICATIONS_LIST,
    features.USER_APPLICATION_VIEW,
    features.LICENSE_APPLICATION,
    features.APPLICATION_STATUS,
    features.ITS_ME,
  ],
  CLIENT: [
    features.HOME,
    features.PURCHASE_HISTORY,
    features.USER_DETAILS,
    features.CHANGE_PASSWORD,
    features.SEND_APPLICATION,
    features.DELETE_ACCOUNT,
    features.TWO_FACTOR_AUTH,
    features.ACTIVE_SESSIONS,
    features.WEAPON_CATALOG,
    features.SHOPPING_CART,
    features.CHECKOUT,
    features.LICENSE_APPLICATION,
  ],
  ERCA: [
    features.PURCHASE_HISTORY,
    features.USER_DETAILS,
    features.CHANGE_PASSWORD,
    features.SEND_APPLICATION,
    features.DELETE_ACCOUNT,
    features.TWO_FACTOR_AUTH,
    features.ACTIVE_SESSIONS,
    features.CREATE_WEAPON,
    features.RESET_PASSWORD_EMAIL,
    features.RESET_PASSWORD,
    features.APPLICATIONS_LIST,
    features.USER_APPLICATION_VIEW,
    features.LICENSE_APPLICATION,
    features.APPLICATION_STATUS,
    features.ITS_ME,
  ],
};

// Configuration interface
interface Config {
  isProduction: boolean;
  port: number;
  httpPort: number;
  databaseURL: string;
  mongoUri: string;
  jwtSecret: string;
  logs: {
    level: string;
  };
  api: {
    prefix: string;
  };
  controllers: Record<string, { name: string; path: string }>;
  repos: Record<string, { name: string; path: string }>;
  services: Record<string, { name: string; path: string }>;
  schemas: Record<string, { name: string; schema: string }>;
  email: {
    service: string;
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
  };
  frontEnd: {
    url: string;
  };
  sslKeyPath: string;
  sslCertPath: string;
  sslCaPath: string;
  authenticatorSecret: string;
  roles: {
    ADMIN: string;
    CLIENT: string;
    ERCA: string;
  };
  features: {
    HOME: string;
    PURCHASE_HISTORY: string;
    USER_DETAILS: string;
    CHANGE_PASSWORD: string;
    SEND_APPLICATION: string;
    DELETE_ACCOUNT: string;
    TWO_FACTOR_AUTH: string;
    ACTIVE_SESSIONS: string;
    WEAPON_CATALOG: string;
    SHOPPING_CART: string;
    CHECKOUT: string;
    CREATE_WEAPON: string;
    RESET_PASSWORD_EMAIL: string;
    RESET_PASSWORD: string;
    APPLICATIONS_LIST: string;
    USER_APPLICATION_VIEW: string;
    LICENSE_APPLICATION: string;
    APPLICATION_STATUS: string;
    ITS_ME: string;
  };
  roleFeatures: {
    ADMIN: string[];
    CLIENT: string[];
    ERCA: string[];
  };
}

// Configuration object
const config: Config = {
  isProduction: process.env.NODE_ENV === 'production',

  port: parseInt(process.env.PORT, 10),

  httpPort: parseInt(process.env.HTTP_PORT, 10),

  databaseURL: process.env.MONGODB_URI,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  api: {
    prefix: '/api',
  },

  controllers: {
    user: {
      name: 'UserController',
      path: '../controllers/userController',
    },
    license: {
      name: 'LicenseController',
      path: '../controllers/licenseController',
    },
    order: {
      name: 'OrderController',
      path: '../controllers/orderController',
    },
    weapon: {
      name: 'WeaponController',
      path: '../controllers/weaponController',
    },
    resetPassword: {
      name: 'ResetPasswordController',
      path: '../controllers/resetPasswordController',
    },
  },

  repos: {
    user: {
      name: 'UserRepo',
      path: '../repos/userRepo',
    },
    application: {
      name: 'ApplicationRepo',
      path: '../repos/applicationRepo',
    },
    license: {
      name: 'LicenseRepo',
      path: '../repos/licenseRepo',
    },
    order: {
      name: 'OrderRepo',
      path: '../repos/orderRepo',
    },
    weapon: {
      name: 'WeaponRepo',
      path: '../repos/weaponRepo',
    },
    resetPassword: {
      name: 'ResetPasswordRepo',
      path: '../repos/resetPasswordRepo',
    },
    statusToken: {
      name: 'StatusTokenRepo',
      path: '../repos/statusTokenRepo',
    },
  },

  services: {
    user: {
      name: 'UserService',
      path: '../services/userService',
    },
    license: {
      name: 'LicenseService',
      path: '../services/licenseService',
    },
    order: {
      name: 'OrderService',
      path: '../services/orderService',
    },
    weapon: {
      name: 'WeaponService',
      path: '../services/weaponService',
    },
    resetPassword: {
      name: 'ResetPasswordService',
      path: '../services/resetPasswordService',
    },
  },

  schemas: {
    user: {
      name: 'userSchema',
      schema: '../persistence/schemas/userSchema',
    },
    application: {
      name: 'applicationSchema',
      schema: '../persistence/schemas/applicationSchema',
    },
    license: {
      name: 'licenseSchema',
      schema: '../persistence/schemas/licneseSchema',
    },
    order: {
      name: 'orderSchema',
      schema: '../persistence/schemas/orderSchema',
    },
    weapon: {
      name: 'weaponSchema',
      schema: '../persistence/schemas/weaponSchema',
    },
    resetPasswordToken: {
      name: 'resetPasswordTokenSchema',
      schema: '../persistence/schemas/resetPasswordTokenSchema',
    },
    password: {
      name: 'passwordSchema',
      schema: '../persistence/schemas/passwordSchema',
    },
    statusToken: {
      name: 'statusTokenSchema',
      schema: '../persistence/schemas/statusTokenSchema',
    },
  },

  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },

  frontEnd: {
    url: process.env.FRONTEND_URL,
  },

  roles: {
    ADMIN: 'Admin',
    CLIENT: 'Client',
    ERCA: 'ERCA',
  },

  features,

  roleFeatures,

  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCertPath: process.env.SSL_CERT_PATH,
  sslCaPath: process.env.SSL_CA_PATH,

  authenticatorSecret: process.env.AUTHENTICATOR_SECRET,
};

export default config;
