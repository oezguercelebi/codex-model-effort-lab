import { spawn } from "node:child_process"
import process from "node:process"

export async function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["pipe", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    let timedOut = false

    child.stdout.on("data", (chunk) => {
      stdout += chunk
      if (options.echoStdout) process.stdout.write(chunk)
    })
    child.stderr.on("data", (chunk) => {
      stderr += chunk
      if (options.echoStderr) process.stderr.write(chunk)
    })
    child.once("error", reject)

    let timer
    if (options.timeoutMs) {
      timer = setTimeout(() => {
        timedOut = true
        child.kill("SIGTERM")
      }, options.timeoutMs)
    }

    child.once("close", (code, signal) => {
      if (timer) clearTimeout(timer)
      resolve({ code: code ?? 1, signal, stdout, stderr, timedOut })
    })

    if (options.input != null) child.stdin.end(options.input)
    else child.stdin.end()
  })
}

export async function requireSuccess(command, args, options = {}) {
  const result = await run(command, args, { ...options, echoStdout: true, echoStderr: true })
  if (result.code !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.code}`)
  }
  return result
}

export async function findBinary(candidates, versionArgs = ["--version"]) {
  for (const candidate of [...new Set(candidates.filter(Boolean))]) {
    try {
      const result = await run(candidate, versionArgs)
      if (result.code === 0) return { binary: candidate, version: result.stdout.trim() }
    } catch {
      // Try the next known installation.
    }
  }
  return null
}
