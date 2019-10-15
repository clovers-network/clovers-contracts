
task("deployUpdate", "Deploy and Update Contracts")
.addFlag("v", "Add verbose output to the command", false)
.addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({v, overwrite}, { run }) => {
    var contracts = await run('deploy', {overwrite, v})
    await run('update', {v, contracts})
})
