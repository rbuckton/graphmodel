const gulp = require("gulp");
const del = require("del");
const log = require("fancy-log");
const child_process = require("child_process");
const yargs = require("yargs")
    .wrap(Math.min(100, require("yargs").terminalWidth()))
    .hide("help")
    .hide("version")
    .option("testNamePattern", { type: "string", alias: ["tests", "test", "T", "t"], group: "Jest Options" })
    .option("testPathPattern", { type: "string", alias: ["files", "file", "F"], group: "Jest Options" })
    .option("testPathIgnorePatterns", { type: "string", alias: ["ignore", "I"], group: "Jest Options" })
    .option("maxWorkers", { type: "string", alias: ["w"], group: "Jest Options" })
    .option("onlyChanged", { type: "boolean", alias: ["changed", "o"], default: false, group: "Jest Options" })
    .option("onlyFailures", { type: "boolean", default: false, group: "Jest Options" })
    .option("runInBand", { type: "boolean", alias: "i", default: false, group: "Jest Options" })
    .option("watch", { type: "boolean", default: false, group: "Jest Options" })
    .option("watchAll", { type: "boolean", default: false, group: "Jest Options" })
    .option("force", { type: "boolean", default: false, group: "TypeScript Options" })
    .option("verbose", { type: "boolean", default: false, group: "TypeScript Options" });

const { argv } = yargs;

const clean = async () => {
    await exec(process.execPath, [require.resolve("typescript/lib/tsc.js"), {
        build: ".",
        clean: true
    }], { verbose: true });
    await del("dist");
};
gulp.task("clean", clean);

const build = () => exec(process.execPath, [require.resolve("typescript/lib/tsc.js"), {
    build: ".",
    force: argv.force
}], { verbose: true });
gulp.task("build", build);

const test = () => exec(process.execPath, [require.resolve("jest/bin/jest"), {
    "--testNamePattern": argv.testNamePattern,
    "--testPathPattern": argv.testPathPattern,
    "--testPathIgnorePatterns": argv.testPathIgnorePatterns,
    "--maxWorkers": argv.maxWorkers,
    "--onlyChanged": argv.onlyChanged,
    "--onlyFailures": argv.onlyFailures,
    "--runInBand": argv.runInBand,
    "--watch": argv.watch,
    "--watchAll": argv.watchAll,
}], { verbose: true });
gulp.task("test", test);

const watch = () => exec(process.execPath, [require.resolve("typescript/lib/tsc.js"), {
    build: ".",
    watch: true
}], { verbose: true });
gulp.task("watch", watch);

gulp.task("ci", gulp.series(clean, build, test));
gulp.task("default", gulp.series(build, test));

const exec = (cmd, cmdArgs, { verbose, ignoreExitCode, cwd } = {}) => new Promise((resolve, reject) => {
    const args = [];
    for (const arg of cmdArgs) {
        if (typeof arg === "object") {
            for (const [key, value] of Object.entries(arg)) {
                if (value !== undefined && value !== null && value !== false) {
                    args.push(key.startsWith("-") || key.startsWith("/") ? key : `${key.length === 1 ? "-" : "--"}${key}`);
                    if (value !== true) args.push(value.toString());
                }
            }
        }
        else {
            args.push(arg);
        }
    }

    const isWindows = /^win/.test(process.platform);
    const shell = isWindows ? "cmd" : "/bin/sh";
    const shellArgs = isWindows ? ["/c", cmd.includes(" ") >= 0 ? `"${cmd}"` : cmd, ...args] : ["-c", `${cmd} ${args.join(" ")}`];
    if (verbose) log(`> \u001B[32m${cmd}\u001B[39m ${args.join(" ")}`);

    const child = child_process.spawn(shell, shellArgs, { stdio: "inherit", cwd, windowsVerbatimArguments: true });
    child.on("exit", (exitCode) => {
        child.removeAllListeners();
        if (exitCode === 0 || ignoreExitCode) {
            resolve({ exitCode });
        }
        else {
            reject(new Error(`Process exited with code: ${exitCode}`));
        }
    });
    child.on("error", error => {
        child.removeAllListeners();
        reject(error);
    });
});
