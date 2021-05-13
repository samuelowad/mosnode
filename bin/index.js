#!/usr/bin/env node

// import { usage } from "yargs";
const { usage } = require("yargs");
const axios = require("axios");
var fs = require("fs");

var obj = { project: [] };

const Clubhouse = require("clubhouse-lib");
const { default: chalk } = require("chalk");
const client = Clubhouse.create("YOUR API TOKEN");

const options = usage("Usage:-o <nameOfFile> -p <12,23>")
  .option("o", {
    alias: "nOF",
    describe: "name of output file",
    type: "string",
    demandOption: true,
  })
  .option("p", {
    alias: "list",
    describe: "List of Ids to be exported",
    type: "array",
    demandOption: true,
  }).argv;

console.log(chalk.blue("Hold On"));
async function test() {
  //   console.log(options.list);
  for (let i = 0; i < options.list.length; i++) {
    // console.log(options.list[i]);
    await client
      .getProject(options.list[i])
      .then((res) => {
        // console.log(res);
        if (res.statusCode != 200) {
          //   console.log("hh");
          //   return;
          const error = new Error(
            `project with id ${options.list[i]} can not be found `
          );
          throw error;
        } else {
          obj.project.push({
            id: res.id,
            name: res.name,
            description: res.description,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  var json = JSON.stringify(obj);
  fs.writeFile(`${options.nOF}.json`, json, "utf8", function (err) {
    if (err) console.log(err);
  });

  const greeting = `Hello there`;

  console.log(chalk.green("Done"));
}

test();
