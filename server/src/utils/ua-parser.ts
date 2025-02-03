import { UAParser } from "ua-parser-js";

export const parseUA = (ua: string) => new UAParser(ua).getResult();

export const getDeviceType = (ua: string) => parseUA(ua).device.type;
export const getUAInfos = (ua: string) => parseUA(ua);