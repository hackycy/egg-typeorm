import yargs from "yargs";

yargs
    .usage("Usage: $0 <command> [options]")
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help").argv;
