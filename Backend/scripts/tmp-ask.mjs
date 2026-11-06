const questions = [
  "Do you offer GPU servers?",
  "Sab se sasta VPS kitne ka hai?",
  "What payment methods do you accept?",
  "What is the ping from Pakistan to Singapore?",
  "Do you have an SLA?",
  "Kya main JazzCash se payment kar sakta hoon?",
];

let cookie = "";
for (let i = 0; i < questions.length; i++) {
  const message = questions[i];
  const res = await fetch(
    "http://127.0.0.1:3000/api/v1/ai/conversations/trainlive0001/messages",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({
        clientRequestId: `trainlive${i}abcd`,
        message,
      }),
    },
  );
  const setCookie = res.headers.getSetCookie?.() ?? [];
  if (setCookie.length) {
    cookie = setCookie.map((row) => row.split(";")[0]).join("; ");
  }
  const raw = await res.text();
  const match = raw.match(/event: response\.complete\ndata: (.*)/);
  let text = raw.slice(0, 300);
  if (match) {
    try {
      text = JSON.parse(match[1]).text ?? text;
    } catch {
      text = match[1];
    }
  }
  console.log(`\n## ${res.status} ${message}\n${text}\n`);
}
