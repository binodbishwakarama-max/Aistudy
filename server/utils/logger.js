const formatMeta = (meta) => {
    if (!meta) return '';

    try {
        return ` ${JSON.stringify(meta)}`;
    } catch (error) {
        return ` ${String(meta)}`;
    }
};

const write = (level, message, meta) => {
    const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${formatMeta(meta)}`;
    console[level](line);
};

const logger = {
    info: (message, meta) => write('log', message, meta),
    warn: (message, meta) => write('warn', message, meta),
    error: (message, meta) => write('error', message, meta)
};

module.exports = { logger };
