const VALID_TIMEZONES = new Set(Intl.supportedValuesOf('timeZone'));

const isValidTimezone = (tz) => VALID_TIMEZONES.has(tz);

module.exports = isValidTimezone;