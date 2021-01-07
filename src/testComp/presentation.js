import React, { Component } from 'react';
import axios from 'axios';
// import { spawn } from 'child_process';
// import openpgp from 'openpgp';
import SimpleCryptoJS from 'simple-crypto-js';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

// const app = window.require('electron').remote;
// const dialog = app.dialog;
// const fs = require('fs');

const { spawn } = window.require('child_process');

const openpgp =
  typeof window !== 'undefined' && window.openpgp
    ? window.openpgp
    : require('openpgp');
// openpgp.config.aead_protect = true;
// console.log(openpgp);
class PgpTest extends Component {
  state = {
    passphrase: 'Doggy floor skiped battery ewoks',
    passphrase: '',
    showPassphrase: false,
    pubkey: '',
    privkey: '',
    encryptedPrivateKey: '',
    decryptedPrivateKey: '',
    encryptedMessage: '',
    decryptedMessage: '',
    running: false
  };
  doLocal = () => {
    const ls = spawn('ls', { shell: true });

    ls.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });
  };
  generateKeys = async () => {
    this.setState({ running: true });
    console.log('Starting keygen...');
    const options = {
      userIds: { name: 'abstruction' },
      numBits: 4096,
      passphrase: this.state.passphrase
    };
    const keys = await openpgp.generateKey(options);
    this.setState({
      running: false,
      privkey: keys.privateKeyArmored,
      pubkey: keys.publicKeyArmored
    });
    // console.log('private key', JSON.stringify(keys.privateKeyArmored));
    // console.log('public key', JSON.stringify(keys.publicKeyArmored));
  };
  anotherTest = async () => {
    this.setState({ running: true });
    const decryptor = new SimpleCryptoJS(this.state.passphrase);
    const decrypted = decryptor.decrypt(this.state.encryptedPrivateKey);
    this.setState({ running: false, decryptedPrivateKey: decrypted });
  };
  encryptMessage = async () => {
    this.setState({ running: true });
    const message = 'What the fuck you lookin at?';
    const privKeyObj = openpgp.key.readArmored(this.state.decryptedPrivateKey)
      .keys[0];
    privKeyObj.decrypt(this.state.passphrase);
    const options = {
      data: message,
      publicKeys: openpgp.key.readArmored(this.state.pubkey).keys,
      privateKeys: privKeyObj
    };
    const encrypted = await openpgp.encrypt(options);
    this.setState({ running: false, encryptedMessage: encrypted.data });
  };
  decryptMessage = async () => {
    this.setState({ running: true });
    const privKeyObj = openpgp.key.readArmored(this.state.decryptedPrivateKey)
      .keys[0];
    privKeyObj.decrypt(this.state.passphrase);
    const options = {
      message: openpgp.message.readArmored(this.state.encryptedMessage),
      publicKeys: openpgp.key.readArmored(this.state.pubkey).keys,
      privateKey: privKeyObj
    };
    const decrypted = await openpgp.decrypt(options);
    this.setState({ running: false, decryptedMessage: decrypted.data });
  };

  handleMouseDownPassphrase = event => {
    event.preventDefault();
  };
  handleClickShowPasssword = () => {
    this.setState({ showPassphrase: !this.state.showPassphrase });
  };
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };
  refreshPassphraseHandler = async () => {
    try {
      const res = await axios.get(
        'https://makemeapassword.org/api/v1/readablepassphrase/json?pc=1&wc=4&sp=y&minCh=20&maxCh=30&s=RandomMedium'
      );
      const phrase = res.data.pws[0];
      this.setState({ passphrase: phrase });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <div>
        <Typography type="display1">
          Running: {this.state.running.toString()}
        </Typography>
        <Typography type="body1">
          Public Key: {JSON.stringify(this.state.pubkey)}
        </Typography>
        <Typography type="body1">
          Private Key: {JSON.stringify(this.state.privkey)}
        </Typography>
        {/* <Typography type="body1">
          Encrypted Private Key: {this.state.encryptedPrivateKey}
        </Typography>
        <Typography type="body1">
          Decrypted Private Key: {this.state.decryptedPrivateKey}
        </Typography> */}
        <Typography type="body1">
          Encrypted Message: {this.state.encryptedMessage}
        </Typography>
        <Typography type="body1">
          Decrypted Message: {this.state.decryptedMessage}
        </Typography>
        <Button onClick={this.generateKeys}>Generate Keys</Button>
        <Button onClick={this.anotherTest}>Encrypt Private Key</Button>
        <Button onClick={this.encryptMessage}>Encrypt Message</Button>
        <Button onClick={this.doLocal}>Unabstruse it</Button>
        <FormControl>
          <InputLabel htmlFor="passphrase">Passphrase</InputLabel>
          <Input
            id="passphrase"
            type="text"
            value={this.state.passphrase}
            onChange={this.handleChange('passphrase')}
            // endAdornment={
            //   <InputAdornment position="end">
            //     <IconButton
            //       onClick={this.handleClickShowPasssword}
            //       onMouseDown={this.handleMouseDownPassphrase}
            //     >
            //       {this.state.showPassphrase ? (
            //         <VisibilityOff />
            //       ) : (
            //         <Visibility />
            //       )}
            //     </IconButton>
            //   </InputAdornment>
            // }
          />
        </FormControl>
      </div>
    );
  }
}

export default PgpTest;
