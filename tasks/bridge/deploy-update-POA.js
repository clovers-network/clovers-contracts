
task("deployUpdatePOA", "Deploy and Update POA Contracts")
.addFlag("v", "Add verbose output to the command", false)
.addFlag("a", "Deploy all", false)
.addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({a, v, overwrite}, { run }) => {
    var contracts = await run('deployPOA', {overwrite, v, a})
    await run('updatePOA', {v, contracts})
})
