#! /usr/bin/env node

'use strict';

const ebics = require('../index');

const client = new ebics.Client({
	url: 'https://ebics.server',
	partnerId: '',
	userId: '',
	hostId: '',
	passphrase: 'test', // keys-test will be decrypted with this passphrase
	keyStorage: ebics.fsKeysStorage('./keys-test'),
});

// Client keys must be already generated and send by letter.
// The bank should have enabled the user
client.send(ebics.Orders.HPB)
	.then((resp) => {
		console.log('Respose for HPB order %j', resp);
		if (resp.technicalCode !== '000000')
			throw new Error('Something went wrong');

		console.log('Received bank keys: %j', resp.bankKeys);
		return client.setBankKeys(resp.bankKeys);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});