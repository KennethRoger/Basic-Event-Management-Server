const logger = {
    info: (...args) => console.log(`[INFO]`, new Date().toISOString(), ...args),
    warn: (...args) => console.warn(`[WARN]`, new Date().toISOString(), ...args),
    error: (...args) => console.log(`[ERROR]`, new Date().toISOString(), ...args)
}

module.exports = logger;