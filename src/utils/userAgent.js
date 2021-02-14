import UAParser from 'ua-parser-js';

const USER_AGENT_PARSED = new UAParser().getResult();

export const isDesktop = (() => {
  const userAgentOsName = USER_AGENT_PARSED.os.name || [];
  const isWindows = userAgentOsName.indexOf('Windows') !== -1;
  const isMac = userAgentOsName.indexOf('Mac') !== -1;
  return isWindows || isMac;
})();

export const isMobile = (() => {
  const isMobileDevice = USER_AGENT_PARSED.device.type === 'mobile';
  return isMobileDevice || !isDesktop;
})();
