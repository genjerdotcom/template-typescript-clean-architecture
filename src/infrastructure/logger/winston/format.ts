import { format } from "winston";
import _ from "lodash";

const sentryFormat = format((info) => {
    const { path, requestId, ...extra } = info;
    info = {
        ...extra,
        message: info.message
            ? `${_.capitalize(info.level)}: ${JSON.stringify(info.message)}`
            : `${_.capitalize(info.level)}: INFO`,
        tags: {
            path: path ?? '',
            request_id: requestId ?? '',
        },
        level: info.level
    };
    return info;
});

export { sentryFormat };