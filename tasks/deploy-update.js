usePlugin("@nomiclabs/buidler-truffle5");
// import { internalTask, task, types } from "../internal/core/config/config-env";

task("deployUpdate", "Deploy and Update Contracts")
.setAction(async (taskArgs, env) => {
    console.log({internalTask})
    await internalTask('deploy')
    await internalTask('update')
})
