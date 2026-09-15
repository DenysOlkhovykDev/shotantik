import { spawnSync } from "node:child_process";

const filter = process.argv[2];

const args = ["playwright", "test", "--workers=1"];

if (filter) {
  args.push("--grep", filter);
}

const result = spawnSync("npx", args, {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
