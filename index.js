const { default: axios } = require("axios");
require("dotenv").config();
const kodeRef = process.env.KODE_REF;

async function getEmail(indexnya) {
  const options = {
    method: "POST",
    url: "https://temp-mail44.p.rapidapi.com/api/v3/email/new",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "temp-mail44.p.rapidapi.com",
    },
    data: {
      key1: "value",
      key2: "value",
    },
  };

  try {
    const response = await axios.request(options);
    await sendEmail(response.data.email, indexnya);
  } catch (error) {
    console.error(error);
  }
}

async function sendEmail(email, indexnya) {
  const body = {
    username: email,
    password: "Ridwan174!",
    referral_code: kodeRef,
  };
  try {
    const response = axios.post(
      `https://api.rug.ai/v1/auth/email/create`,
      body
    );
    const data = await response;
    await getInbox(email, indexnya);
  } catch (error) {}
}

async function getInbox(email, indexnya) {
  const options = {
    method: "GET",
    url: `https://temp-mail44.p.rapidapi.com/api/v3/email/${email}/messages`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "temp-mail44.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const bodyText = response.data[0].body_text;
    const regex = /\d{6}/;
    const verificationCode = bodyText.match(regex);

    if (verificationCode) {
      try {
        const body = {
          username: email,
          confirmation_code: verificationCode[0],
          password: "Ridwan174!",
          referral_code: kodeRef,
        };
        const verif = axios.post(
          "https://api.rug.ai/v1/auth/email/verify",
          body
        );
        const data = await verif;
        console.log(`[${indexnya}] ${email} ✅`);
      } catch (error) {}
    } else {
      console.log("Kode verifikasi tidak ditemukan.");
    }
  } catch (error) {
    console.error(error);
  }
}

async function loopnya() {
  for (let indexnya = 0; indexnya < 10; indexnya++) {
    await getEmail(indexnya + 1);
  }
  console.log("Done Bang 👌");
}

loopnya();
