import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

function deriveKey(password: string, salt: string, keyLength: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, 64);

  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedPassword: string
) {
  if (!storedPassword.startsWith("scrypt$")) {
    return password === storedPassword;
  }

  const [, salt, storedKeyHex] = storedPassword.split("$");
  if (
    !salt ||
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !storedKeyHex ||
    !/^[a-f0-9]{128}$/i.test(storedKeyHex)
  ) {
    return false;
  }

  const storedKey = Buffer.from(storedKeyHex, "hex");
  const key = await deriveKey(password, salt, storedKey.length);

  return timingSafeEqual(key, storedKey);
}
