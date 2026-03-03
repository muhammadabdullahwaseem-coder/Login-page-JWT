const LOGIN_LOG_KEY = 'login_logs_v2';
const MAX_ENTRIES = 300;

function maskSensitive(payload) {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const clone = { ...payload };

  if (Object.prototype.hasOwnProperty.call(clone, 'password')) {
    clone.password = '[REDACTED]';
  }

  if (Object.prototype.hasOwnProperty.call(clone, 'token') && typeof clone.token === 'string') {
    clone.token = `${clone.token.slice(0, 8)}...`;
  }

  return clone;
}

function readLogs() {
  try {
    const raw = localStorage.getItem(LOGIN_LOG_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[LOGIN_LOG] failed to read stored logs', err);
    return [];
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('[LOGIN_LOG] failed to persist logs', err);
  }
}

export function writeLoginLog(event, payload = {}) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    event,
    payload: maskSensitive(payload),
  };

  const logs = readLogs();
  logs.push(entry);

  if (logs.length > MAX_ENTRIES) {
    logs.splice(0, logs.length - MAX_ENTRIES);
  }

  saveLogs(logs);
  console.log('[LOGIN_LOG]', entry);

  return entry;
}

export function getLoginLogs() {
  return readLogs();
}

export function clearLoginLogs() {
  localStorage.removeItem(LOGIN_LOG_KEY);
  console.log('[LOGIN_LOG] cleared');
}

export { LOGIN_LOG_KEY, MAX_ENTRIES };