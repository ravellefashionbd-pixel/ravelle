export async function verifyTurnstile(token: string) {
  if (!token) return false;
  console.log("Token received:", token);
  console.log("Secret key:", process.env.TURNSTILE_SECRET_KEY);
  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    const verifyData = await verifyRes.json();
    console.log("Turnstile response:", verifyData);
    if (!verifyData?.success) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}
