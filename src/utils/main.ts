import * as Comlink from 'comlink'

const worker = new Worker(new URL('./webLLM.ts',import.meta.url),{type:'module'})
const aiworker = Comlink.wrap(worker);

    async function getReply({messages}){
        await aiworker.initEngine();

        await aiworker.changeMsg({cusMsg:messages});

        const newResponce = await aiworker.reply();

        return newResponce.choices[0].message.content
    }

    export {getReply}