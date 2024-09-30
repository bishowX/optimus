import { Hono } from "hono"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"

import { config } from "dotenv"
import OpenAI from "openai"
import { instruction } from "./instruction"
import { tools } from "./tools"

config({
    path: "../.env.local",
})

const client = new OpenAI()

async function initializeAssistant() {
    const assistant = await client.beta.assistants.create({
        name: "Web app navigator",
        instructions: instruction,
        tools: tools,
        model: "gpt-4-0613",
    })
    const thread = await client.beta.threads.create()
    return { assistant, thread }
}

async function handleToolCalls(toolCalls: any[]) {
    return Promise.all(
        toolCalls.map(async (toolCall) => {
            const { name, arguments: args } = toolCall.function
            console.log(`Executing tool: ${name} with args:`, JSON.parse(args))

            // Simulate API call to web app
            const apiResponse = await simulateApiCall(name, JSON.parse(args))
            console.log(`API response for ${name}:`, apiResponse)

            return {
                tool_call_id: toolCall.id,
                output: apiResponse,
            }
        }),
    )
}

async function simulateApiCall(toolName: string, args: any) {
    // This function simulates an API call to your web app
    switch (toolName) {
        case "navigateTo":
            return `Navigated to ${args.route}`
        case "updateUserPreferences":
            return { success: true, message: `Updated preferences: ${JSON.stringify(args)}` }
        case "fetchContent":
            return { success: true, message: `fetch content using ${args}` }
        // Add more cases as needed
        default:
            return { success: false, message: "Unknown tool" }
    }
}

async function getAssistantResponse(
    assistant: OpenAI.Beta.Assistant,
    thread: OpenAI.Beta.Thread,
    userInput: string,
) {
    console.log(`User: ${userInput}`)

    await client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userInput,
    })

    let run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
    })

    while (run.status !== "completed") {
        console.log(`Run status: ${run.status}`)

        if (run.status === "requires_action") {
            console.log("Tool calls required. Executing...")
            const toolOutputs = await handleToolCalls(
                run.required_action.submit_tool_outputs.tool_calls,
            )
            run = await client.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
                tool_outputs: toolOutputs,
            })
        } else {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            run = await client.beta.threads.runs.retrieve(thread.id, run.id)
        }
    }

    const messages = await client.beta.threads.messages.list(thread.id)
    const lastMessage = messages.data[0]

    console.log(`Assistant: ${JSON.stringify(lastMessage.content[0])}\n`)
    return lastMessage.content[0].text.value
}

const { assistant, thread } = await initializeAssistant()

const app = new Hono()
app.use(logger())
app.use(prettyJSON())

app.get("/api", (c) => {
    return c.text("Hello Hono!")
})

app.post("/api/ai", async (c) => {
    const b = await c.req.json()
    if (!b?.query) return c.json({ message: "query is required" }, 400)

    const r = await getAssistantResponse(assistant, thread, b.query)
    return c.json(r)
})

export default {
    port: 3009,
    fetch: app.fetch,
}
