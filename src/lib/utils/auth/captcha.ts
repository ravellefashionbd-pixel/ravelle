export async function verifyTurnstile(token: string) {
  if (!token) return false;

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

    if (!verifyData?.success) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}
