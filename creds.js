const credentials = {
  type: 'service_account',
  project_id: 'confort-life',
  private_key_id: process.env.FIREBASE_API_KEY_ID,
  private_key: process.env.FIREBASE_API_KEY.replace(
    /\\n/g,
    '\n'
  ),
  client_email:
    'firebase-adminsdk-h1cp5@confort-life.iam.gserviceaccount.com',
  client_id: '101771906745101125234',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url:
    'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h1cp5%40confort-life.iam.gserviceaccount.com'
}

module.exports = {
  credentials
}
