export class CredObj {
  accessKey?: string; // 'ACCESS_KEY',
  secretKey?: string; // 'SECRET_KEY',
  sessionToken?: string; // 'SESSION_TOKEN', //OPTIONAL: If you are using temporary credentials you must include the session token
  region?: string; // e.g:'eu-west-1' // OPTIONAL: The region where the API is deployed, by default this parameter is set to us-east-1

  constructor(){}
}
