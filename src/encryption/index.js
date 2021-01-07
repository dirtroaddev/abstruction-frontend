const openpgp =
  typeof window !== 'undefined' && window.openpgp
    ? window.openpgp
    : require('openpgp');

export const encode = async (phrase, data) => {
  try {
    const options = {
      data,
      passwords: [phrase],
      armor: false
    };
    const cipher = await openpgp.encrypt(options);
    const encrypted = await cipher.message.packets.write();
    const encStr = encrypted.toString();
    return encStr;
  } catch (error) {
    throw new Error(error);
  }
};

export const decode = async (phrase, enc) => {
  try {
    const str = await enc;
    const arr = str.split(',');
    const uint8 = new Uint8Array(arr);
    const options = {
      message: openpgp.message.read(uint8),
      password: phrase,
      format: 'utf8'
    };
    const cipher = await openpgp.decrypt(options);
    const decoded = cipher.data;
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

export const encrypt = async (pubKey, privKey, phrase, data) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const decrypt = async (pubKey, privKey, phrase, data) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const generateKeyPair = async (phrase, name) => {
  try {
    const options = {
      userIds: { name },
      numBits: 4096,
      passphrase: phrase
    };
    const keyPair = await openpgp.generateKey(options);
    return {
      privateKey: keyPair.privateKeyArmored,
      publicKey: keyPair.publicKeyArmored
    };
  } catch (error) {
    console.log(error);
  }
};
