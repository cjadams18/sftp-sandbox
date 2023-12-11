const { Client } = require("ssh2");
require("dotenv").config();

function readdirAsync(sftp, path) {
	return new Promise((resolve, reject) => {
		sftp.readdir(path, (err, list) => {
			if (err) {
				reject(err);
			} else {
				resolve(list);
			}
		});
	});
}

function closeSFTPConnection(sftp) {
	return new Promise((resolve, _reject) => {
		console.log("CLOSING 123");
		sftp.end();
		console.log("CLOSED 123");
		resolve();
	});
}

function main() {
	const conn = new Client();
	conn.on("ready", () => {
		console.log("Client :: ready");

		conn.sftp(async (err, sftp) => {
			if (err) {
				throw err;
			}

			try {
				const list = await readdirAsync(sftp, "C:/NoCloudZone");
				console.dir(list);
			} catch (err) {
				throw err;
			} finally {
				await closeSFTPConnection(sftp);
				console.log("SFTP CONN CLOSED SUCCESSFULLY");
				conn.destroy();
				console.log("SSH CONN CLOSED SUCCESSFULLY");
			}
		});
	});

	conn.on("close", () => {
		console.log("SSH CONN CLOSED SUCCESSFULLY");
	});

	conn.on("error", (err) => {
		console.error(err);
		if (err.level === "client-socket") {
			console.log("CLIENT SOCKET ERROR");
		} else {
			console.log("OTHER ERROR");
		}
	});

	conn.connect({
		host: process.env.host,
		port: process.env.port,
		username: process.env.username,
		password: process.env.password,
	});
}

try {
	main();
} catch (err) {
	console.log(`MY ERROR: ${err.message}`);
}
