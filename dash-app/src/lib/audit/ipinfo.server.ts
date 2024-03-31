import { FIND_IP_KEY } from "$env/static/private";

const FIND_IP_API = `https://api.findip.net/%s/?token=${FIND_IP_KEY}`;

type IPInfo = {
    ip: string,
    asn: string,
    location: string
}

async function getIpInfo(ip: string): Promise<IPInfo> {
    const response = await fetch(FIND_IP_API.replace("%s", ip));
    const json = await response.json();
    
    if (json) {
        return {
            ip: ip,
            asn: `${json.traits.autonomous_system_organization} (AS${json.traits.autonomous_system_number})`,
            location: `${json.city.names.en}, ${json.postal.code}, ${json.country.names.en} (${json.location.latitude}, ${json.location.longitude})`
        }
    } else {
        return {
            ip: ip,
            asn: "",
            location: "Unknown Location"
        }
    }
}

export { getIpInfo };