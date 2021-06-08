#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import program from "commander";

import { Altra } from "../index";

const pkg = fs.readJsonSync(path.join(__dirname, "../../package.json"));

program
  .version(pkg.version)
  .option("-v", "--version", () => {
    console.log(pkg.version);
  })
  .option("--debug [feat]", `[string | boolean]  show debug logs`)
  .usage("<command> [options]");

program
  .command("clean") //
  .description("nemos-cli clean")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "clean"
    }).exec();
  });

program
  .command("create") //
  .description("nemos-cli clean")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "create"
    }).exec();
  });

program
  .command("build") //
  .description("nemos-cli build")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "build"
    }).exec();
  });

program
  .command("watch") //
  .description("nemos-cli watch")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "watch"
    }).exec();
  });

program
  .command("build-dts") //
  .description("nemos-cli build-dts")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "buildDts"
    }).exec();
  });

program
  .command("test") //
  .description("nemos-cli build-dts")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "test"
    }).exec();
  });

program
  .command("lint") //
  .description("nemos-cli build-dts")
  .option("-f, --config [config]", "输入文件")
  .action(() => {
    new Altra({
      command: "lint"
    }).exec();
  });

program.parse(process.argv);
