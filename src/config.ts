const EnvConfig = new Map<string, string>(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  )
);

const vars = [
  //"DB_HOST",
  //"DB_PORT",
  //"DB_USER",
  //"DB_PASSWORD",
  //"DB_NAME",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
];

const missingVars = vars.filter((v) => !EnvConfig.has(v));
if (missingVars.length) {
  throw new Error(`Missing env vars: ${missingVars.join(", ")}`);
}

export default EnvConfig;
