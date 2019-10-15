
task("deployUpdate", "Deploy and Update Contracts")
.addFlag("v", "Add verbose output to the command", false)
.addFlag("a", "Deploy all", false)
.addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({a, v, overwrite}, { run }) => {
    var contracts = await run('deploy', {overwrite, v, a})
    await run('update', {v, contracts})
})
