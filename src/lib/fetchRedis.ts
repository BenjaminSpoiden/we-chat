const upstashRedisRestUrl = process.env.REDIS_URL;
const authToken = process.env.REDIS_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export const fetchRedis = async <T> (
  command: Command,
  ...args: (string | number)[]
) => {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result as T;
}
