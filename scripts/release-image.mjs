import { readFileSync } from "node:fs";

export function releaseImage(dockerfile) {
	const from = dockerfile.match(/^FROM\s+(\S+)\s*$/m)?.[1];
	const image =
		from === "${PUBLISH_IMAGE}" ? dockerfile.match(/^ARG PUBLISH_IMAGE=(\S+)\s*$/m)?.[1] : from;
	if (!image || !/^ghcr\.io\/markdown-confluence\/publish:\d+\.\d+\.\d+$/.test(image)) {
		throw new Error("Release Dockerfile must pin a markdown-confluence image version");
	}
	return image;
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href) {
	console.log(releaseImage(readFileSync("Dockerfile", "utf8")));
}
