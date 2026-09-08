import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

function run(command, report) {
	const directory = mkdtempSync(join(tmpdir(), "publish-action-"));
	try {
		writeFileSync(
			join(directory, "node"),
			`#!${process.execPath}\nconsole.log(JSON.stringify(process.argv.slice(2)));\n`,
			{ mode: 0o755 },
		);
		return spawnSync("sh", [resolve("entrypoint.sh")], {
			encoding: "utf8",
			env: {
				...process.env,
				PATH: directory + ":" + process.env.PATH,
				CONFLUENCE_ACTION_COMMAND: command,
				CONFLUENCE_ACTION_REPORT_PATH: report,
			},
		});
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
}
test("publishing and read-only commands pass report paths as literal arguments", () => {
	for (const [command, flag] of [
		["publish", "--report"],
		["validate", "--output"],
		["plan", "--output"],
	]) {
		const path = "reports/a file $(must-not-run).json";
		const result = run(command, path);
		assert.equal(result.status, 0, result.stderr);
		assert.deepEqual(JSON.parse(result.stdout), [
			"/app/index.js",
			...(command === "publish" ? [] : [command]),
			flag,
			path,
		]);
	}
	assert.deepEqual(JSON.parse(run("", "").stdout), ["/app/index.js"]);
});
test("invalid commands fail before launching the CLI", () => {
	const result = run("publish; echo bad", "");
	assert.equal(result.status, 2);
	assert.equal(result.stdout, "");
});
test("every action input is mapped exactly once without credential defaults", () => {
	const action = readFileSync("action.yml", "utf8");
	const inputs = [
		...action
			.slice(action.indexOf("inputs:"), action.indexOf("runs:"))
			.matchAll(/^ +([A-Za-z][A-Za-z0-9]*):$/gm),
	].map((m) => m[1]);
	const mapped = [...action.matchAll(/\$\{\{ inputs\.([A-Za-z][A-Za-z0-9]*) \}\}/g)].map(
		(m) => m[1],
	);
	assert.deepEqual([...inputs].sort(), [...mapped].sort());
	assert.equal(new Set(mapped).size, mapped.length);
	assert.ok(!inputs.includes("confluenceApiPrefix"));
	assert.ok(
		inputs.includes("krokiEnabled") &&
			inputs.includes("command") &&
			inputs.includes("reportPath"),
	);
});
