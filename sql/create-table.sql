-- Run this once to set up the database schema manually,
-- or let the monitor create it automatically via DatabaseWriter.initialize().

CREATE TABLE IF NOT EXISTS website_checks (
    id              SERIAL PRIMARY KEY,
    check_date      DATE        NOT NULL,
    check_hour      SMALLINT    NOT NULL,
    check_timestamp TIMESTAMPTZ NOT NULL,
    url             VARCHAR(255) NOT NULL,
    is_online       BOOLEAN     NOT NULL,
    status_code     SMALLINT,
    response_time_ms INTEGER,
    error_message   TEXT
);

-- Useful query: check results per day and hour
-- SELECT check_date, check_hour, is_online, status_code, response_time_ms
-- FROM website_checks
-- WHERE url = 'https://www.lyrikblog.at'
-- ORDER BY check_timestamp DESC;
