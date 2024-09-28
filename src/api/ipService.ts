export const fetchIpData = async (ip: string) => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || "Location not found");
    }

    return {
      location: `${data.city}, ${data.country_name}`,
      countryCode: data.country_code,
      timezone: data.timezone,
    };
  } catch (err) {
    throw new Error("Failed to fetch location");
  }
};
