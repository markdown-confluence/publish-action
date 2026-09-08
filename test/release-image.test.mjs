import { test } from "node:test";
import assert from "node:assert/strict";
import { releaseImage } from "../scripts/release-image.mjs";

test("release image resolves a pinned literal or build argument", () => {
	const image = "ghcr.io/markdown-confluence/publish:7.0.0";
	assert.equal(releaseImage("FROM " + image + "\n"), image);
	assert.equal(releaseImage("ARG PUBLISH_IMAGE=" + image + "\nFROM ${PUBLISH_IMAGE}\n"), image);
});
test("release image rejects missing, floating or unrelated image names", () => {
	for (const input of [
		"FROM ${PUBLISH_IMAGE}\n",
		"FROM ghcr.io/markdown-confluence/publish:latest\n",
		"FROM example.com/publish:7.0.0\n",
	]) {
		assert.throws(() => releaseImage(input), /must pin/);
	}
});
